"use client";

import { Bot, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { getAIRecommendation } from "@/services/aiAssistant";

export default function AIAssistant() {
  const [query, setQuery] = useState("I need emergency heart treatment");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    try {
      const result = await getAIRecommendation(query);
      setResponse(result);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="assistant"
      className="bg-gradient-to-b from-white to-red-50/50 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-500">
            <Sparkles className="h-7 w-7" aria-hidden />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            AI Emergency Assistant
          </h2>
          <p className="mt-3 text-gray-600">
            Describe your situation and get instant facility recommendations.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 max-w-2xl rounded-2xl border border-red-100 bg-white p-6 shadow-lg shadow-red-100/30 sm:p-8"
        >
          <label htmlFor="ai-query" className="sr-only">
            Describe your emergency
          </label>
          <textarea
            id="ai-query"
            rows={4}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. I need emergency heart treatment"
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 placeholder:text-gray-400 transition-colors focus:border-red-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Analyzing...
              </>
            ) : (
              <>
                <Bot className="h-4 w-4" aria-hidden />
                Get AI Recommendation
              </>
            )}
          </button>
        </form>

        <div
          className="mx-auto mt-6 max-w-2xl rounded-2xl border border-red-100 bg-white p-6 shadow-md transition-all duration-300"
          aria-live="polite"
        >
          {!response && !loading && (
            <div className="text-gray-600">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Example
              </p>
              <p className="mt-2 leading-relaxed">
                Nearest hospital with ICU and emergency cardiac support
                recommended.
              </p>
            </div>
          )}
          {loading && (
            <div className="flex items-center gap-3 text-gray-600">
              <Loader2 className="h-5 w-5 animate-spin text-red-500" />
              <p className="text-sm">Finding the best nearby options...</p>
            </div>
          )}
          {response && !loading && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-red-500">
                Recommendation
              </p>
              <p className="mt-2 leading-relaxed text-gray-800">{response}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
