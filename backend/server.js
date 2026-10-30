import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  buildPromptPayload,
  validateGeneratedPrompt,
  PROMPT_CATEGORIES,
  PROMPT_STRATEGIES,
  resolveCategory
} from './src/promptTemplates.js';

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(backendDirectory, '.env') });
dotenv.config({ path: path.resolve(backendDirectory, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const allowedCategories = new Set(PROMPT_CATEGORIES.map((category) => category.key));

function getConfiguredApiKey(environmentVariable) {
  const apiKey = process.env[environmentVariable]?.trim();
  if (!apiKey || /^(your[_-]|replace[_-]|<)/i.test(apiKey)) {
    return undefined;
  }

  return apiKey;
}

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'PromptForge Backend',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

const providerConfigs = [
  {
    provider: 'gemini',
    label: 'Google Gemini',
    strategyKey: 'cinematic',
    envKey: 'GEMINI_API_KEY',
    getApiKey: () => getConfiguredApiKey('GEMINI_API_KEY'),
    async call({ systemInstruction, userPrompt }) {
      const apiKey = getConfiguredApiKey('GEMINI_API_KEY');
      if (!apiKey) {
        throw new Error('Provider is not configured.');
      }

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
        {
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: userPrompt }]
            }
          ],
          generationConfig: {
            temperature: 0.6,
            topP: 0.9,
            maxOutputTokens: 1000
          }
        },
        {
          timeout: 30000,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const text = response.data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text)
        .join(' ')
        .trim();

      if (!text) {
        throw new Error('Provider returned an empty result.');
      }

      return text;
    }
  },
  {
    provider: 'groq',
    label: 'Groq',
    strategyKey: 'creative',
    envKey: 'GROQ_API_KEY',
    getApiKey: () => getConfiguredApiKey('GROQ_API_KEY'),
    async call({ systemInstruction, userPrompt }) {
      const apiKey = getConfiguredApiKey('GROQ_API_KEY');
      if (!apiKey) {
        throw new Error('Provider is not configured.');
      }

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'openai/gpt-oss-120b',
          temperature: 0.8,
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: userPrompt }
          ]
        },
        {
          timeout: 30000,
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const text = response.data?.choices?.[0]?.message?.content?.trim();
      if (!text) {
        throw new Error('Provider returned an empty result.');
      }

      return text;
    }
  },
  {
    provider: 'cohere',
    label: 'Cohere',
    strategyKey: 'professional',
    envKey: 'COHERE_API_KEY',
    getApiKey: () => getConfiguredApiKey('COHERE_API_KEY'),
    async call({ systemInstruction, userPrompt }) {
      const apiKey = getConfiguredApiKey('COHERE_API_KEY');
      if (!apiKey) {
        throw new Error('Provider is not configured.');
      }

      const response = await axios.post(
        'https://api.cohere.com/v2/chat',
        {
          model: 'command-a-03-2025',
          temperature: 0.8,
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: userPrompt }
          ]
        },
        {
          timeout: 30000,
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const text = response.data?.message?.content
        ?.filter((part) => part.type === 'text')
        .map((part) => part.text)
        .join('\n')
        .trim();
      if (!text) {
        throw new Error('Provider returned an empty result.');
      }

      return text;
    }
  }
];

function getSafeProviderError(providerConfig, error) {
  if (!providerConfig.getApiKey()) {
    return `Not configured. Set ${providerConfig.envKey} in the backend environment.`;
  }

  const status = error?.response?.status;
  if (error?.code === 'INVALID_PROMPT_OUTPUT') {
    const reasonMessages = {
      too_short: 'returned an incomplete prompt',
      too_long: 'returned an overly long prompt',
      invalid_format: 'returned formatting or commentary instead of a prompt',
      unfinished: 'returned an unfinished prompt',
      wrong_subject: 'did not preserve the requested subject'
    };
    const reason = reasonMessages[error.reason] || 'returned a prompt that did not meet the requirements';
    return `${providerConfig.label} ${reason}. Try again.`;
  }
  if (status === 401 || status === 403) {
    return `${providerConfig.label} rejected the API key or access (HTTP ${status}). Create or rotate the key in the provider dashboard and check its permissions.`;
  }
  if (status === 404) {
    return `${providerConfig.label} could not find the requested model or endpoint (HTTP 404). Check the configured model ID.`;
  }
  if (status === 429) {
    return `${providerConfig.label} rate limit or quota reached (HTTP 429). Check provider usage and retry later.`;
  }
  if (status) {
    return `${providerConfig.label} request failed (HTTP ${status}). Check provider status and configuration.`;
  }

  return `${providerConfig.label} request failed. Check network connectivity and provider configuration.`;
}

app.post('/api/generate', asyncHandler(async (req, res) => {
  const rawIdea = typeof req.body?.idea === 'string' ? req.body.idea.trim() : '';
  const requestedCategory =
    typeof req.body?.category === 'string'
      ? req.body.category.trim().toLowerCase()
      : 'auto';

  if (rawIdea.length < 8 || rawIdea.length > 500) {
    return res.status(400).json({
      message: 'Please enter an idea between 8 and 500 characters.'
    });
  }

  if (requestedCategory !== 'auto' && !allowedCategories.has(requestedCategory)) {
    return res.status(400).json({
      message: 'Invalid category. Choose Auto-detect or one of the supported visual categories.'
    });
  }

  const category = resolveCategory(rawIdea, requestedCategory);
  if (!category) {
    return res.status(400).json({
      message: 'The selected category could not be resolved.'
    });
  }

  const results = await Promise.allSettled(
    providerConfigs.map(async (providerConfig) => {
      const payload = buildPromptPayload({
        idea: rawIdea,
        category,
        provider: providerConfig.provider,
        strategyKey: providerConfig.strategyKey
      });

      let generatedPrompt = await providerConfig.call(payload);
      let prompt;
      try {
        prompt = validateGeneratedPrompt(generatedPrompt, rawIdea);
      } catch (error) {
        if (error?.code !== 'INVALID_PROMPT_OUTPUT') {
          throw error;
        }

        generatedPrompt = await providerConfig.call({
          ...payload,
          userPrompt: `${payload.userPrompt}\nThe previous draft did not meet the content or formatting requirements. Write a new complete 60–100 word prompt as one plain-text paragraph, follow every subject constraint, and finish the final sentence.`
        });
        prompt = validateGeneratedPrompt(generatedPrompt, rawIdea);
      }

      return {
        provider: providerConfig.provider,
        label: providerConfig.label,
        strategy: PROMPT_STRATEGIES[providerConfig.strategyKey].label,
        strategyKey: providerConfig.strategyKey,
        prompt,
        status: 'success',
        originalIdea: rawIdea,
        category: category.key,
        categoryLabel: category.label
      };
    })
  );

  const normalizedResults = results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }

    const providerConfig = providerConfigs[index];
    return {
      provider: providerConfig.provider,
      label: providerConfig.label,
      strategy: PROMPT_STRATEGIES[providerConfig.strategyKey].label,
      strategyKey: providerConfig.strategyKey,
      prompt: '',
      status: 'failed',
      error: getSafeProviderError(providerConfig, result.reason),
      originalIdea: rawIdea,
      category: category.key,
      categoryLabel: category.label
    };
  });

  const successfulProviders = normalizedResults.filter((item) => item.status === 'success');
  const failedProviders = normalizedResults.filter((item) => item.status === 'failed');
  const missingKeys = providerConfigs
    .filter((providerConfig) => !providerConfig.getApiKey())
    .map((providerConfig) => providerConfig.envKey);

  const message =
    successfulProviders.length > 0
      ? undefined
      : missingKeys.length === providerConfigs.length
        ? `PromptForge is not configured. Add ${missingKeys.join(', ')} to the backend environment.`
        : 'No provider generated a prompt. Check the provider errors and try again.';

  return res.status(successfulProviders.length > 0 ? 200 : 503).json({
    success: successfulProviders.length > 0,
    message,
    idea: rawIdea,
    category: category.key,
    categoryLabel: category.label,
    categoryFamily: category.family,
    categoryDetection: category.detection,
    generatedAt: new Date().toISOString(),
    successfulProviders: successfulProviders.map((item) => ({
      provider: item.provider,
      label: item.label,
      strategy: item.strategy
    })),
    failedProviders: failedProviders.map((item) => ({
      provider: item.provider,
      label: item.label,
      error: item.error
    })),
    results: normalizedResults,
    summary: {
      total: normalizedResults.length,
      success: successfulProviders.length,
      failed: failedProviders.length
    },
    warnings:
      missingKeys.length > 0
        ? {
            missingKeys,
            message: 'Some providers are not configured. Available providers were still attempted.'
          }
        : undefined
  });
}));

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ message: 'Request body must contain valid JSON.' });
  }

  console.error('Unhandled PromptForge request error.');
  return res.status(500).json({ message: 'An unexpected server error occurred.' });
});

app.listen(PORT, () => {
  console.log(`PromptForge backend running on http://localhost:${PORT}`);
});
