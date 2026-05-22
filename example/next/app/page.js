'use client';

import { useState } from 'react';

export default function HomePage() {
  const [prompt, setPrompt] = useState('Explain what dev-ai-sdk does in one paragraph.');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [meta, setMeta] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setAnswer('');
    setMeta(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed.');
      }

      setAnswer(data.data);
      setMeta(`${data.provider} (${data.model})`);
    } catch (err) {
      setError(err.message || 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="wrap">
      <section className="card">
        <h1>dev-ai-sdk + Next.js</h1>
        <p>Send a prompt to a simple Next.js backend using OpenAI via dev-ai-sdk.</p>

        <form onSubmit={onSubmit}>
          <label htmlFor="prompt">Prompt</label>
          <textarea
            id="prompt"
            rows={6}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </form>

        {error ? <p className="error">{error}</p> : null}

        {answer ? (
          <div className="result">
            {meta ? `${meta}\n\n` : ''}
            {answer}
          </div>
        ) : null}
      </section>
    </main>
  );
}
