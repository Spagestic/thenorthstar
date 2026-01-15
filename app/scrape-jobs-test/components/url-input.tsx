"use client";

import { SearchIcon, Loader2, Globe } from "lucide-react";
import { useId, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function UrlInput({
  value = "",
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
} = {}) {
  const id = useId();
  const [inputValue, setInputValue] = useState(value);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidDomain, setIsValidDomain] = useState(false); // Track if domain is valid structure

  const debouncedDomain = useDebounce(inputValue, 500);

  // Extract domain from a full URL or just use the input if it's already a domain
  const extractDomain = (input: string): string | null => {
    try {
      // If input starts with protocol, use URL API
      if (/^https?:\/\//i.test(input)) {
        return new URL(input).hostname;
      }
      // If input is just domain/path, prepend protocol for parsing
      if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(input)) {
        return new URL(`https://${input}`).hostname;
      }
    } catch {
      return null;
    }
    return null;
  };

  const fetchLogoForDomain = async (input: string) => {
    const domain = extractDomain(input);
    const isDomainLike = !!domain;
    setIsValidDomain(isDomainLike);

    if (!isDomainLike) {
      setLogoUrl(null);
      return;
    }

    setIsLoading(true);
    try {
      const targetUrl = `https://${domain}`;
      const res = await fetch(
        `/api/link-preview?url=${encodeURIComponent(targetUrl)}`
      );
      const data = await res.json();

      if (data.logo) setLogoUrl(data.logo);
      else setLogoUrl(null);
    } catch (error) {
      console.error("Failed to fetch logo:", error);
      setLogoUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const cleanText = pastedText.replace(/^https?:\/\//, "").replace(/\/$/, ""); // Remove protocol & trailing slash
    setInputValue(cleanText);
    onChange?.(cleanText);
    // Immediately fetch logo for pasted URL
    fetchLogoForDomain(cleanText);
  };

  useEffect(() => {
    fetchLogoForDomain(debouncedDomain);
  }, [debouncedDomain]);

  return (
    <div className="*:not-first:mt-2">
      <div className="relative group">
        {/* Protocol Prefix + Icon */}
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none z-10">
          <div className="flex items-center justify-center w-4 h-4 mr-2">
            {isLoading ? (
              <Loader2
                size={16}
                className="animate-spin text-muted-foreground"
              />
            ) : logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo"
                className="w-4 h-4 object-contain"
              />
            ) : isValidDomain ? (
              // Fallback icon for valid domain but no logo found
              <Globe size={16} className="text-muted-foreground" />
            ) : (
              // Default state
              <SearchIcon size={16} className="text-muted-foreground/50" />
            )}
          </div>
          <span className="text-muted-foreground font-medium text-sm pt-0.5 select-none">
            https://
          </span>
        </div>

        <Input
          id={id}
          className="peer ps-22 pe-9 font-mono text-sm" // Monospace font helps with URL reading
          placeholder="x.ai/careers/open-roles"
          type="text"
          autoComplete="off" // Disable browser history autocomplete covering your custom UI
          spellCheck={false}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange?.(e.target.value);
          }}
          onPaste={handlePaste}
        />
      </div>
    </div>
  );
}
