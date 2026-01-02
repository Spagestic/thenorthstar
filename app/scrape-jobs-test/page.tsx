"use client";
import { useState } from "react";

export default function ScrapeJobsTestPage() {
  const [url, setUrl] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMarkdown("");
    try {
      const res = await fetch("/api/scrape-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Failed to scrape");
      const data = await res.json();
      setMarkdown(data.markdown || "No content found.");
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 24 }}>
      <h2>Test Scrape Jobs API</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to scrape"
          style={{ width: "80%", padding: 8, marginRight: 8 }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "8px 16px" }}
        >
          {loading ? "Scraping..." : "Scrape"}
        </button>
      </form>
      {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}
      {markdown && (
        <div style={{ background: "#f9f9f9", padding: 16, borderRadius: 8 }}>
          <pre style={{ whiteSpace: "pre-wrap" }}>{markdown}</pre>
        </div>
      )}
    </div>
  );
}
