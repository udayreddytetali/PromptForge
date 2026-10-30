export const PROMPT_CATEGORIES = [
  {
    key: 'realistic-photography',
    label: 'Realistic photography',
    family: 'photography',
    cues: [/\bphoto(?:graphy|graph|realistic photo)?\b/i, /\bphotorealistic\b/i, /\brealistic\b/i, /\bphoto-real\b/i],
    guidance:
      'Use believable photographic lighting and detail, a deliberate camera angle, a suitable lens and depth of field, and plausible exposure settings only when useful.'
  },
  {
    key: 'portrait-headshot',
    label: 'Portrait and headshot photography',
    family: 'photography',
    cues: [/\bportrait(?:s)?\b/i, /\bheadshots?\b/i, /\bclose[- ]?up of (?:a )?(?:person|face|man|woman|child)\b/i],
    guidance:
      'Prioritize expression, natural skin texture, sharp eye focus, flattering portrait light, a suitable portrait focal length, and a background that supports the subject.'
  },
  {
    key: 'cinematic-photography',
    label: 'Cinematic photography',
    family: 'photography',
    cues: [/\bcinematic\b/i, /\bfilm still\b/i, /\bmovie still\b/i, /\bfilm[- ]?noir\b/i],
    guidance:
      'Specify a purposeful camera angle, lens and depth of field, motivated cinematic lighting, atmospheric environment, filmic color treatment, and a composed frame.'
  },
  {
    key: 'fashion-photography',
    label: 'Fashion photography',
    family: 'photography',
    cues: [/\bfashion\b/i, /\bfashion editorial\b/i, /\bcouture\b/i, /\boutfit\b/i, /\brunway\b/i],
    guidance:
      'Highlight styling, garment silhouette and fabric texture, pose, editorial direction, light that reveals materials, and a coherent fashion setting.'
  },
  {
    key: 'product-photography',
    label: 'Product photography',
    family: 'photography',
    cues: [/\bproduct(?: shot| photography| photo)?\b/i, /\bpackaging\b/i, /\bstill life\b/i],
    guidance:
      'Make the product the clear hero; describe materials, accurate shape, controlled reflections, clean background, commercial studio lighting, and crisp focus.'
  },
  {
    key: 'food-photography',
    label: 'Food photography',
    family: 'photography',
    cues: [/\bfood\b/i, /\bcuisine\b/i, /\bdish\b/i, /\brecipe\b/i, /\brestaurant menu\b/i],
    guidance:
      'Emphasize appetizing but believable texture, fresh ingredients, thoughtful plating, food styling, directional light, and a suitable close-up or overhead composition.'
  },
  {
    key: 'wedding-photography',
    label: 'Wedding photography',
    family: 'photography',
    cues: [/\bwedding\b/i, /\bbride(?:s)?\b/i, /\bgroom(?:s)?\b/i, /\bbridal\b/i],
    guidance:
      'Capture authentic emotion and elegant details, with flattering natural or soft light, refined composition, and a wedding-appropriate documentary or editorial feel.'
  },
  {
    key: 'nature-wildlife',
    label: 'Nature and wildlife',
    family: 'photography',
    cues: [/\bwildlife\b/i, /\banimal(?:s)?\b/i, /\bbird(?:s)?\b/i, /\bsafari\b/i, /\bplant life\b/i, /\bbotanical\b/i],
    guidance:
      'Keep species, anatomy, behavior, and habitat plausible; use a respectful natural perspective and suggest telephoto or macro optics only when appropriate.'
  },
  {
    key: 'landscape',
    label: 'Landscape photography',
    family: 'photography',
    cues: [/\blandscape\b/i, /\bmountain(?:s)?\b/i, /\bseascape\b/i, /\bscenic vista\b/i, /\bdesert dunes\b/i],
    guidance:
      'Establish scale and foreground-to-background depth, atmospheric conditions, time of day, natural color, and a suitable wide composition.'
  },
  {
    key: 'architecture-interior',
    label: 'Architecture and interior design',
    family: 'photography',
    cues: [/\barchitecture\b/i, /\barchitectural\b/i, /\binterior design\b/i, /\binterior\b/i, /\bbuilding\b/i, /\broom design\b/i],
    guidance:
      'Describe architectural style, spatial layout, materials, balanced perspective, natural or designed light, and scale without distorting structural details.'
  },
  {
    key: 'anime-manga',
    label: 'Anime and manga',
    family: 'illustration',
    cues: [/\banime\b/i, /\bmanga\b/i, /\bcel[- ]shad(?:ed|ing)\b/i],
    guidance:
      'Use intentional anime or manga linework, expressive but consistent character design, stylized proportions, a coherent palette, and purposeful cel shading; do not force photographic camera specifications.'
  },
  {
    key: 'cartoon-illustration',
    label: 'Cartoon and illustration',
    family: 'illustration',
    cues: [/\bcartoon\b/i, /\billustration\b/i, /\bcomic(?: book)?\b/i, /\bcharacter art\b/i],
    guidance:
      'Define the illustration style, readable silhouettes, line quality, shape language, color palette, and visual hierarchy; keep the result illustrated rather than photorealistic.'
  },
  {
    key: '3d-rendering',
    label: '3D art and rendering',
    family: '3d',
    cues: [/\b3d\b/i, /\bthree[- ]dimensional\b/i, /\b3d render(?:ing)?\b/i, /\bblender\b/i, /\bcgi\b/i],
    guidance:
      'Describe modeling and geometry, materials and surface response, scene lighting, camera composition, and polished rendering while avoiding arbitrary software requirements.'
  },
  {
    key: 'fantasy-sci-fi',
    label: 'Fantasy and sci-fi art',
    family: 'illustration',
    cues: [/\bfantasy\b/i, /\bsci[- ]?fi\b/i, /\bscience fiction\b/i, /\bcyberpunk\b/i, /\bspace opera\b/i, /\bmagical\b/i],
    guidance:
      'Build a coherent genre world with distinctive setting, believable world-specific details, scale, atmosphere, and imaginative visual effects that support the original idea.'
  },
  {
    key: 'digital-painting-sketch',
    label: 'Digital painting and sketches',
    family: 'illustration',
    cues: [/\bdigital painting\b/i, /\bhand[- ]painted\b/i, /\bhand art\b/i, /\bpainted portrait\b/i, /\bsketch(?:es|ed|ing)?\b/i, /\bwatercolor\b/i, /\boil painting\b/i, /\bpencil drawing\b/i, /\bconcept art\b/i],
    guidance:
      'Name a suitable medium or brush treatment, mark-making, texture, value structure, and degree of finish; preserve the hand-made artistic character.'
  },
  {
    key: 'logo-branding',
    label: 'Logo and branding',
    family: 'design',
    cues: [/\blogos?\b/i, /\bbranding\b/i, /\bbrand identity\b/i, /\bwordmark\b/i, /\bemblem\b/i],
    guidance:
      'Prioritize a distinctive, simple mark, strong silhouette, intentional typography if requested, scalable vector-like clarity, and a restrained brand palette; avoid mockup clutter.'
  },
  {
    key: 'posters-banners',
    label: 'Posters and banners',
    family: 'design',
    cues: [/\bposters?\b/i, /\bbanners?\b/i, /\bflyers?\b/i, /\bpromo(?:tional)? graphic\b/i],
    guidance:
      'Set a clear visual hierarchy, focal image, readable type treatment when text is requested, intentional negative space, and a composition suited to the requested format.'
  },
  {
    key: 'youtube-thumbnails',
    label: 'YouTube thumbnails',
    family: 'design',
    cues: [/\byoutube\b/i, /\bthumbnail\b/i, /\bvideo thumbnail\b/i],
    guidance:
      'Create a strong single focal subject, expressive readable shapes, high contrast at small sizes, a 16:9 composition, and clear reserved space for short title text if needed.'
  },
  {
    key: 'social-media',
    label: 'Social media designs',
    family: 'design',
    cues: [/\bsocial media\b/i, /\binstagram\b/i, /\btiktok\b/i, /\bfeed post\b/i, /\bstory post\b/i],
    guidance:
      'Use a platform-appropriate square or vertical composition, mobile-first readability, clear focal hierarchy, and safe margins for interface overlays.'
  },
  {
    key: 'advertisements',
    label: 'Advertisements',
    family: 'design',
    cues: [/\badvert(?:isement|ising|s)\b/i, /\bcampaign graphic\b/i, /\bcommercial ad\b/i, /\bcall[- ]to[- ]action\b/i],
    guidance:
      'Make the product or offer immediately clear, use a persuasive but uncluttered commercial layout, maintain brand consistency, and reserve room for requested copy or a call to action.'
  },
  {
    key: 'infographics',
    label: 'Infographics',
    family: 'design',
    cues: [/\binfographics?\b/i, /\bdata visualization\b/i, /\bdiagram\b/i, /\bvisual explainer\b/i],
    guidance:
      'Organize information into a clear sequence, use accurate and legible labels only when requested, consistent iconography, accessible contrast, and uncluttered spacing.'
  },
  {
    key: 'book-album-covers',
    label: 'Book and album covers',
    family: 'design',
    cues: [/\bbook cover\b/i, /\balbum cover\b/i, /\bcover art\b/i, /\bnovel cover\b/i],
    guidance:
      'Create a genre-appropriate central image with deliberate title and author/artist space, strong thumbnail readability, cohesive typography when requested, and polished cover composition.'
  },
  {
    key: 'icons-stickers',
    label: 'Icons and stickers',
    family: 'design',
    cues: [/\bicons?\b/i, /\bstickers?\b/i, /\bemoji\b/i, /\bapp icon\b/i],
    guidance:
      'Use a clean silhouette, simplified details that remain legible at small sizes, consistent shape language, and a transparent or sticker-cutout treatment only when appropriate.'
  },
  {
    key: 'automotive-photography',
    label: 'Automotive photography',
    family: 'photography',
    cues: [/\bautomotive\b/i, /\bcar(?:s)?\b/i, /\bmotorcycle(?:s)?\b/i, /\bvehicle photography\b/i, /\bauto photo\b/i],
    guidance:
      'Preserve plausible vehicle proportions and details; choose an automotive camera angle, controlled paint reflections, environment and motion cues suited to the scene.'
  },
  {
    key: 'educational-illustrations',
    label: 'Educational illustrations',
    family: 'illustration',
    cues: [/\beducational\b/i, /\beducational illustration\b/i, /\bteaching diagram\b/i, /\bclassroom\b/i, /\banatomy diagram\b/i, /\blearning illustration\b/i],
    guidance:
      'Favor factual accuracy, age-appropriate clarity, labeled parts only when requested, readable visual hierarchy, and a simple instructional illustration style.'
  }
];

export const PROMPT_STRATEGIES = {
  cinematic: {
    key: 'cinematic',
    label: 'CINEMATIC / REALISTIC',
    summary: 'Atmospheric storytelling, deliberate framing, expressive light, and strong visual depth.',
    systemInstruction:
      "You are a cinematic visual prompt engineer. Expand the idea into one complete, standalone image-generation prompt, usually 60–100 words, with a specific subject and action, purposeful composition, lighting, setting, visual texture, atmosphere, depth, and a coherent style. Adapt all choices to the detected category: use camera, lens, exposure, and photographic realism only for photography; for illustration, 3D, and graphic design, use the appropriate medium and craft instead. Interpret the user's central subject and requested medium literally; phrases such as 'hand art' or 'art of my pic' do not make a hand the subject unless a hand is explicitly requested. Preserve the user's subject, intent, named details, and constraints. Do not invent personal appearance, objects, actions, or context not supplied. Avoid vague filler, repetition, labels, and meta commentary. Output only the final prompt."
  },
  creative: {
    key: 'creative',
    label: 'CREATIVE / ARTISTIC',
    summary: 'Distinctive art direction, palette, mood, imaginative detail, and a memorable visual voice.',
    systemInstruction:
      "You are an imaginative art director and visual prompt engineer. Create one distinctive image-generation prompt with a purposeful palette, mood, atmosphere, artistic medium, and memorable details. Adapt the creative treatment to the detected category rather than applying one style to everything: photography remains photographically plausible, illustrations use intentional drawing or painting language, 3D uses material and form language, and design uses strong graphic hierarchy. Preserve the user's original concept and constraints; embellish without replacing or contradicting them. Output only the final prompt."
  },
  professional: {
    key: 'professional',
    label: 'PROFESSIONAL / COMMERCIAL',
    summary: 'Clear subject hierarchy, production-ready details, format-aware composition, and quality controls.',
    systemInstruction:
      "You are a professional visual prompt specialist. Produce one production-ready image-generation prompt that is precise, organized, category-aware, and faithful to the user's idea. Optimize subject clarity, layout or camera framing, environment, finish, and category-specific quality requirements. For commercial designs, address hierarchy, format, legibility, and usable negative space; for photography or artwork, specify the appropriate technical and stylistic detail. End with a concise negative prompt clause for common defects relevant to this category, without negating requested content. Output only the final prompt."
  }
};

export const FINAL_PROMPT_REQUIREMENTS =
  "Return exactly one complete, standalone image-generation prompt as a single plain-text paragraph of 60–100 words. Do not include markdown, headings, labels such as 'Prompt' or 'Polishing', commentary, explanations, quotation marks around the prompt, or extra delimiters. Clearly describe the intended subject and action, composition, setting or background, lighting, and category-appropriate style or material details. Preserve the user's requested subject and medium. Do not turn modifiers such as 'hand-painted' or 'art of my picture' into a hand as the subject unless a hand is explicitly requested. Never invent personal appearance, age, gender, ethnicity, facial features, pose, or expression, or unrelated objects and context. If the idea refers to the user's picture or photo, specify that its visible subject and likeness should be preserved without making up details. Avoid fragments, repetition, contradictions, and generic filler.";

export function validateGeneratedPrompt(value, idea = '') {
  const prompt = String(value || '').replace(/\s+/g, ' ').trim();
  const wordCount = prompt.match(/\b[\p{L}\p{N}][\p{L}\p{N}'’-]*\b/gu)?.length || 0;
  const hasMarkdown = /```|^\s{0,3}#{1,6}(?:\s|$)|^\s*[-*]\s|(?:^|\s)\*\*[^*]+\*\*/m.test(prompt);
  const hasMetaPreface = /^(?:here(?:'s| is)|prompt|polishing)\s*[:：-]/i.test(prompt);
  const endsAsACompleteSentence = /[.!?]["'’”)]?$/u.test(prompt);
  const isHandArtOfPicture = /\bhand art\b/i.test(idea) &&
    /\b(?:my|this|the)\s+(?:pic|picture|photo|photograph|image)\b/i.test(idea);
  const makesHandsTheSubject =
    /\b(?:focus(?:es|ed|ing)? on|center(?:ed|ing)? on|close[- ]?up of|depict(?:s|ed|ing)?|show(?:s|ing)?|feature(?:s|d|ing)?)\s+(?:the\s+)?(?:subject['’]s\s+)?(?:hands?|fingers?|palms?)\b/i.test(prompt) ||
    /\b(?:hands?|fingers?|palms?)\b.{0,40}\b(?:main|central) subject\b/i.test(prompt);

  const promptIssues = [];
  if (wordCount < 45) promptIssues.push('too_short');
  if (wordCount > 150) promptIssues.push('too_long');
  if (hasMarkdown || hasMetaPreface) promptIssues.push('invalid_format');
  if (!endsAsACompleteSentence) promptIssues.push('unfinished');
  if (isHandArtOfPicture && makesHandsTheSubject) promptIssues.push('wrong_subject');

  if (promptIssues.length > 0) {
    const error = new Error('Provider returned a prompt that did not meet the content or formatting requirements.');
    error.code = 'INVALID_PROMPT_OUTPUT';
    error.reason = promptIssues[0];
    throw error;
  }

  return prompt;
}

export function getCategoryByKey(categoryKey) {
  return PROMPT_CATEGORIES.find((category) => category.key === categoryKey);
}

export function detectCategory(idea) {
  const normalizedIdea = String(idea || '').trim();
  let bestMatch = null;
  let bestScore = 0;

  for (const category of PROMPT_CATEGORIES) {
    const matches = category.cues.reduce(
      (total, cue) => total + (cue.test(normalizedIdea) ? 1 : 0),
      0
    );
    const score = matches > 0
      ? matches + (category.key === 'realistic-photography' ? 0 : 0.25)
      : 0;

    if (score > bestScore) {
      bestMatch = category;
      bestScore = score;
    }
  }

  return bestMatch || PROMPT_CATEGORIES[0];
}

export function resolveCategory(idea, requestedCategory = 'auto') {
  if (requestedCategory === 'auto') {
    return { ...detectCategory(idea), detection: 'automatic' };
  }

  const category = getCategoryByKey(requestedCategory);
  return category ? { ...category, detection: 'manual' } : null;
}

export function buildPromptPayload({ idea, category, provider, strategyKey }) {
  const strategy = PROMPT_STRATEGIES[strategyKey] || PROMPT_STRATEGIES.cinematic;
  const safeIdea = String(idea || '').trim().replace(/\s+/g, ' ');

  const userPrompt = [
    `Create one improved image-generation prompt based on this original idea: "${safeIdea}".`,
    `Detected visual category: ${category.label} (${category.family}).`,
    `Category-specific direction: ${category.guidance}`,
    `Apply this strategy: ${strategy.summary}`,
    'Keep the original subject, requested medium, and stated details recognizable. Expand it into a complete, specific, standalone prompt with a clear subject/action, composition, setting or background, lighting or medium-specific rendering, and useful texture/detail. Do not reinterpret a modifier as the subject, add unsupported personal attributes, or pad with generic quality claims.',
    /\b(?:my|this|the)\s+(?:pic|picture|photo|photograph|image|reference)\b|\bof my (?:pic|picture|photo|photograph|image)\b/i.test(safeIdea)
      ? 'This idea refers to a user-provided picture: instruct the downstream image generator to preserve the pictured subject and likeness, and do not guess age, gender, ethnicity, facial features, pose, or expression.'
      : '',
    /\bhand art\b/i.test(safeIdea) &&
      /\b(?:my|this|the)\s+(?:pic|picture|photo|photograph|image)\b/i.test(safeIdea)
      ? 'Interpret “hand art of my picture” as a hand-painted or hand-crafted artwork based on the picture, not artwork depicting hands. Keep the pictured subject as the focus; do not include hands, fingers, palms, or hand gestures.'
      : '',
    'Do not generate an image, explanation, title, markdown, or commentary; return only the finished prompt text.'
  ].filter(Boolean).join('\n');

  return {
    providerName: provider,
    strategy: strategy.label,
    strategyKey: strategy.key,
    systemInstruction: `${strategy.systemInstruction}\n\n${FINAL_PROMPT_REQUIREMENTS}`,
    userPrompt,
    category: category.key,
    categoryLabel: category.label,
    categoryFamily: category.family,
    idea: safeIdea
  };
}
