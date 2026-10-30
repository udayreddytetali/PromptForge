import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPromptPayload,
  detectCategory,
  FINAL_PROMPT_REQUIREMENTS,
  PROMPT_CATEGORIES,
  PROMPT_STRATEGIES,
  resolveCategory,
  validateGeneratedPrompt
} from './promptTemplates.js';

const detectionExamples = [
  ['A realistic photo of a cat', 'realistic-photography'],
  ['Hand art of my pic', 'digital-painting-sketch'],
  ['Studio portrait headshot of a musician', 'portrait-headshot'],
  ['A cinematic film still of a detective', 'cinematic-photography'],
  ['Fashion editorial with a red couture dress', 'fashion-photography'],
  ['Product shot of a glass perfume bottle', 'product-photography'],
  ['Food photography of a plated dessert', 'food-photography'],
  ['An intimate wedding portrait of the bride and groom', 'wedding-photography'],
  ['Wildlife photo of a bird in its habitat', 'nature-wildlife'],
  ['A mountain landscape at sunrise', 'landscape'],
  ['Modern architecture and interior design of a home', 'architecture-interior'],
  ['Anime manga character with cel shading', 'anime-manga'],
  ['Colorful cartoon illustration of a fox', 'cartoon-illustration'],
  ['A 3D render of a tiny robot', '3d-rendering'],
  ['Fantasy sci-fi city on an alien planet', 'fantasy-sci-fi'],
  ['Watercolor digital painting and pencil sketch of a flower', 'digital-painting-sketch'],
  ['Minimal logo and branding for a bakery', 'logo-branding'],
  ['A concert poster banner with bold lettering', 'posters-banners'],
  ['A YouTube thumbnail for a cooking video', 'youtube-thumbnails'],
  ['Instagram social media story design', 'social-media'],
  ['Advertisement campaign graphic for a new drink', 'advertisements'],
  ['An infographic diagram about the water cycle', 'infographics'],
  ['Book cover art for a mystery novel', 'book-album-covers'],
  ['A set of app icons and stickers', 'icons-stickers'],
  ['Automotive photography of a sports car', 'automotive-photography'],
  ['Educational illustration of the solar system', 'educational-illustrations']
];

test('all supported visual categories can be detected from representative ideas', () => {
  assert.equal(PROMPT_CATEGORIES.length, 25);

  for (const [idea, expectedCategory] of detectionExamples) {
    assert.equal(detectCategory(idea).key, expectedCategory, idea);
  }
});

test('automatic detection falls back to realistic photography and manual selection overrides it', () => {
  assert.equal(detectCategory('A quiet scene at dusk').key, 'realistic-photography');
  assert.equal(resolveCategory('A quiet scene at dusk', 'anime-manga').detection, 'manual');
  assert.equal(resolveCategory('A quiet scene at dusk', 'unknown-category'), null);
});

test('each strategy has different instructions and receives category-aware guidance', () => {
  const strategyInstructions = Object.values(PROMPT_STRATEGIES).map(
    (strategy) => strategy.systemInstruction
  );
  assert.equal(new Set(strategyInstructions).size, 3);

  const portraitCategory = resolveCategory('A portrait headshot', 'auto');
  const cinematicPayload = buildPromptPayload({
    idea: 'A portrait headshot',
    category: portraitCategory,
    provider: 'gemini',
    strategyKey: 'cinematic'
  });
  const creativePayload = buildPromptPayload({
    idea: 'A portrait headshot',
    category: portraitCategory,
    provider: 'groq',
    strategyKey: 'creative'
  });
  const professionalPayload = buildPromptPayload({
    idea: 'A portrait headshot',
    category: portraitCategory,
    provider: 'cohere',
    strategyKey: 'professional'
  });

  assert.match(cinematicPayload.userPrompt, /portrait focal length/i);
  assert.notEqual(cinematicPayload.systemInstruction, creativePayload.systemInstruction);
  assert.notEqual(creativePayload.systemInstruction, professionalPayload.systemInstruction);
  assert.equal(cinematicPayload.category, 'portrait-headshot');
});

test('graphic design direction avoids forcing photographic camera details', () => {
  const category = resolveCategory('A logo for a neighborhood bakery', 'auto');
  const payload = buildPromptPayload({
    idea: 'A logo for a neighborhood bakery',
    category,
    provider: 'gemini',
    strategyKey: 'cinematic'
  });

  assert.equal(category.key, 'logo-branding');
  assert.match(payload.userPrompt, /scalable vector-like clarity/i);
  assert.doesNotMatch(payload.userPrompt, /portrait focal length/i);
});

test('all provider strategies share clear, faithful plain-text output requirements', () => {
  for (const strategyKey of Object.keys(PROMPT_STRATEGIES)) {
    const payload = buildPromptPayload({
      idea: 'Hand art of my pic',
      category: resolveCategory('Hand art of my pic', 'auto'),
      provider: strategyKey,
      strategyKey
    });

    assert.ok(payload.systemInstruction.includes(FINAL_PROMPT_REQUIREMENTS));
    assert.match(payload.userPrompt, /complete, specific, standalone prompt/i);
    assert.match(payload.userPrompt, /Do not reinterpret a modifier as the subject/i);
    assert.match(payload.userPrompt, /preserve the pictured subject and likeness/i);
    assert.match(payload.userPrompt, /not artwork depicting hands/i);
  }
});

test('provider output validation accepts complete prompts and rejects fragments or formatting', () => {
  const completePrompt =
    'Create a hand-painted portrait based on the provided reference, keeping the person as the clear central subject. Use expressive layered brushstrokes, carefully observed facial features, and a warm, harmonious palette. Frame the portrait from the shoulders upward against a softly textured studio background, with gentle directional light shaping the face and subtle color transitions in the shadows. Preserve the reference image composition and avoid adding unrelated objects or changing the person’s appearance.';

  assert.equal(validateGeneratedPrompt(completePrompt), completePrompt);
  assert.throws(() => validateGeneratedPrompt('A macro photograph of an elegant hand.'), /content or formatting requirements/);
  assert.throws(
    () => validateGeneratedPrompt('A hand-painted illustration recreating the subject and likeness from the reference photo in a rich digital acrylic medium. The subject is captured in centered portrait framing, surrounded'),
    /content or formatting requirements/
  );
  assert.throws(() => validateGeneratedPrompt(`### Polishing\n${completePrompt}`), /content or formatting requirements/);
  assert.throws(() => validateGeneratedPrompt(`Polishing: ${completePrompt}`), /content or formatting requirements/);
  assert.throws(() => validateGeneratedPrompt(`${completePrompt} ${completePrompt} ${completePrompt}`), /content or formatting requirements/);
  const handFocusedDraft = completePrompt.replace('person as the clear central subject', 'hands as the clear central subject');
  assert.throws(
    () => validateGeneratedPrompt(handFocusedDraft, 'Hand art of my pic'),
    /content or formatting requirements/
  );
});
