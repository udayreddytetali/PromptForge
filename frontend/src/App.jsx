import { useMemo, useState } from 'react';

const initialIdea = '';
const categoryOptions = [
  { label: 'Auto-detect from my idea', value: 'auto' },
  { label: 'Realistic photography', value: 'realistic-photography' },
  { label: 'Portrait and headshot photography', value: 'portrait-headshot' },
  { label: 'Cinematic photography', value: 'cinematic-photography' },
  { label: 'Fashion photography', value: 'fashion-photography' },
  { label: 'Product photography', value: 'product-photography' },
  { label: 'Food photography', value: 'food-photography' },
  { label: 'Wedding photography', value: 'wedding-photography' },
  { label: 'Nature and wildlife', value: 'nature-wildlife' },
  { label: 'Landscape photography', value: 'landscape' },
  { label: 'Architecture and interior design', value: 'architecture-interior' },
  { label: 'Anime and manga', value: 'anime-manga' },
  { label: 'Cartoon and illustration', value: 'cartoon-illustration' },
  { label: '3D art and rendering', value: '3d-rendering' },
  { label: 'Fantasy and sci-fi art', value: 'fantasy-sci-fi' },
  { label: 'Digital painting and sketches', value: 'digital-painting-sketch' },
  { label: 'Logo and branding', value: 'logo-branding' },
  { label: 'Posters and banners', value: 'posters-banners' },
  { label: 'YouTube thumbnails', value: 'youtube-thumbnails' },
  { label: 'Social media designs', value: 'social-media' },
  { label: 'Advertisements', value: 'advertisements' },
  { label: 'Infographics', value: 'infographics' },
  { label: 'Book and album covers', value: 'book-album-covers' },
  { label: 'Icons and stickers', value: 'icons-stickers' },
  { label: 'Automotive photography', value: 'automotive-photography' },
  { label: 'Educational illustrations', value: 'educational-illustrations' }
];

const providerMeta = {
  gemini: { label: 'Google Gemini', accent: 'from-blue-500 to-cyan-400' },
  groq: { label: 'Groq', accent: 'from-violet-500 to-fuchsia-500' },
  cohere: { label: 'Cohere', accent: 'from-emerald-500 to-teal-400' }
};

function App() {
  const [idea, setIdea] = useState(initialIdea);
  const [category, setCategory] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [results, setResults] = useState([]);
  const [detectedCategory, setDetectedCategory] = useState(null);
  const [successfulProviders, setSuccessfulProviders] = useState([]);
  const [failedProviders, setFailedProviders] = useState([]);

  const summary = useMemo(() => {
    const success = results.filter((result) => result.status === 'success').length;
    return {
      total: results.length,
      success,
      failed: results.length - success
    };
  }, [results]);

  async function fetchPrompts() {
    if (idea.trim().length < 8 || idea.trim().length > 500) {
      setError('Enter an idea between 8 and 500 characters.');
      return;
    }

    setLoading(true);
    setError('');
    setNotice('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idea, category })
      });

      const data = await response.json();
      setResults(data.results || []);
      setSuccessfulProviders(data.successfulProviders || []);
      setFailedProviders(data.failedProviders || []);
      setDetectedCategory(
        data.categoryLabel
          ? {
              label: data.categoryLabel,
              detection: data.categoryDetection
            }
          : null
      );

      if (!response.ok || !data.success) {
        setError(data.message || 'No AI provider generated a prompt. Check the provider errors and try again.');
      }

      if (data.warnings?.message) {
        setNotice(data.warnings.message);
      }
    } catch (requestError) {
      setError(requestError.message || 'Could not reach the PromptForge backend.');
      setResults([]);
      setSuccessfulProviders([]);
      setFailedProviders([]);
      setDetectedCategory(null);
    } finally {
      setLoading(false);
    }
  }

  async function copyPrompt(text) {
    try {
      await navigator.clipboard.writeText(text);
      setNotice('Prompt copied to clipboard.');
    } catch {
      setNotice('Clipboard access is unavailable in this browser.');
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">Universal AI Prompt Studio</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-white md:text-5xl">PromptForge</h1>
          </div>
          <div className="rounded-full border border-cyan-500/30 bg-slate-900/70 px-4 py-2 text-sm text-cyan-200 shadow-glow">
            25 visual categories • 3 adaptive strategies
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.7fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-2xl shadow-blue-950/30 backdrop-blur md:p-6">
            <label htmlFor="idea" className="mb-3 block text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
              Your visual idea
            </label>
            <textarea
              id="idea"
              value={idea}
              onChange={(event) => setIdea(event.target.value)}
              rows={7}
              maxLength={500}
              placeholder="Describe a photo, illustration, 3D render, logo, poster, or other visual..."
              className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-950/80 p-4 text-base text-slate-100 shadow-inner outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
            />
            <div className="mt-2 text-right text-xs text-slate-500">{idea.length}/500</div>
          </section>

          <aside className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-2xl shadow-blue-950/30 backdrop-blur md:p-6">
            <label htmlFor="category" className="mb-3 block text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
              Visual category
            </label>
            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-base text-slate-100 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Auto-detect is recommended. Choose a category to override detection.
            </p>

            <button
              type="button"
              onClick={fetchPrompts}
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-5 py-3 text-base font-bold text-white shadow-lg shadow-cyan-600/30 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Generating prompts...
                </span>
              ) : (
                'Generate Prompts'
              )}
            </button>

            {detectedCategory && (
              <div className="mt-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  {detectedCategory.detection === 'automatic' ? 'Automatically detected' : 'Selected category'}
                </div>
                <div className="mt-1 text-sm font-bold text-cyan-100">{detectedCategory.label}</div>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Provider status</h2>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                  <div className="text-xl font-extrabold text-emerald-300">{summary.success}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-200">Success</div>
                </div>
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3">
                  <div className="text-xl font-extrabold text-rose-300">{summary.failed}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-rose-200">Failed</div>
                </div>
                <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3">
                  <div className="text-xl font-extrabold text-sky-300">{summary.total}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-sky-200">Total</div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {error && (
          <div role="alert" className="mt-6 rounded-2xl border border-rose-500/50 bg-rose-500/10 p-4 text-sm text-rose-200">
            {error}
          </div>
        )}
        {notice && (
          <div role="status" className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
            {notice}
          </div>
        )}

        {(successfulProviders.length > 0 || failedProviders.length > 0) && (
          <section className="mt-8 grid gap-4 lg:grid-cols-2" aria-label="Provider results">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">Successful providers</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {successfulProviders.length > 0 ? (
                  successfulProviders.map((provider) => (
                    <span key={provider.provider} className="rounded-full border border-emerald-400/50 bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-100">
                      {provider.label}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-emerald-100/80">None</span>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-200">Failed providers</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {failedProviders.length > 0 ? (
                  failedProviders.map((provider) => (
                    <span key={provider.provider} className="rounded-full border border-rose-400/50 bg-rose-500/20 px-3 py-1 text-xs font-medium text-rose-100">
                      {provider.label}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-rose-100/80">None</span>
                )}
              </div>
            </div>
          </section>
        )}

        {results.length > 0 && (
          <section className="mt-8 grid gap-5 xl:grid-cols-3" aria-label="Generated prompts">
            {results.map((result) => {
              const meta = providerMeta[result.provider] || {
                label: result.label,
                accent: 'from-slate-500 to-slate-400'
              };

              return (
                <article key={result.provider} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur">
                  <div className={`mb-4 flex items-center justify-between rounded-2xl bg-gradient-to-r ${meta.accent} p-3`}>
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-white/90">Provider</div>
                      <div className="text-xl font-extrabold text-white">{meta.label}</div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${
                        result.status === 'success'
                          ? 'bg-emerald-500/20 text-emerald-100'
                          : 'bg-rose-500/20 text-rose-100'
                      }`}
                    >
                      {result.status === 'success' ? 'Ready' : 'Failed'}
                    </span>
                  </div>

                  <div className="mb-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-3">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Strategy</div>
                      <div className="mt-2 text-sm font-bold text-cyan-200">{result.strategy}</div>
                    </div>
                    <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-3">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Detected category</div>
                      <div className="mt-2 text-sm font-bold text-cyan-200">{result.categoryLabel}</div>
                    </div>
                  </div>

                  {result.status === 'success' ? (
                    <>
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-3">
                          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Before</div>
                          <p className="mt-2 text-sm leading-6 text-slate-200">{result.originalIdea}</p>
                        </div>
                        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-3">
                          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">After</div>
                          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-100">{result.prompt}</p>
                        </div>
                      </div>

                      <div className="mt-5 flex gap-3">
                        <button
                          type="button"
                          onClick={() => copyPrompt(result.prompt)}
                          className="flex-1 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20"
                        >
                          Copy Prompt
                        </button>
                        <button
                          type="button"
                          onClick={fetchPrompts}
                          disabled={loading}
                          className="flex-1 rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Regenerate all
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="mt-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-200">Provider error</div>
                      <p className="mt-2 text-sm text-rose-100">{result.error || 'Provider returned no output.'}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
