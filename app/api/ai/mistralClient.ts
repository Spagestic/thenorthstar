// app/api/ai/mistralClient.ts
import { mistral } from "@ai-sdk/mistral";

// Use 'mistral-large-latest' or 'mistral-small-latest' for best results with JSON
export const mistralModel = mistral("mistral-large-latest");
