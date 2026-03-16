// app/(protected)/career-batch-test/page.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CareerBatchTestPage() {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState("");

  async function handleBatchTest(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/jobs/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          limit: 15,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json?.error || "Request failed");
      }

      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-semibold mb-6">Career Batch Test</h1>

      <form
        onSubmit={handleBatchTest}
        className="w-full max-w-md flex flex-col gap-4 mb-8"
      >
        <Input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/careers"
          disabled={loading}
          required
          className="w-full"
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Running..." : "Test Batch"}
        </Button>
      </form>

      <div id="batch-results" className="w-full max-w-3xl text-left">
        {error && <p className="mb-2 text-sm text-red-500">Error: {error}</p>}
        <pre className="text-xs whitespace-pre-wrap break-all bg-muted p-3 rounded-md">
          {data ? JSON.stringify(data, null, 2) : "No results yet."}
        </pre>
      </div>
    </div>
  );
}
