const BOILERPLATE_LINE_PATTERNS = [
  /^apply now$/i,
  /^apply$/i,
  /^back to jobs$/i,
  /^view all jobs$/i,
  /^share this job$/i,
  /^save job$/i,
  /^click here to apply$/i,
  /^submit application$/i,
  /^job alerts$/i,
];

const LIST_BULLET_PATTERN = /^([*\-+]|[•●◦▪‣◉·])\s+/;
const NUMBERED_LIST_PATTERN = /^(\d+)[\)\-:]\s+/;

export type NormalizeJobDescriptionInput = {
  extractedDescription?: string | null;
  rawDescription?: string | null;
  responsibilities?: string[] | null;
  qualifications?: string[] | null;
};

export type NormalizeJobDescriptionResult = {
  raw: string | null;
  normalizedMarkdown: string | null;
};

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function stripHtmlToText(value: string): string {
  if (!/<[a-z][\s\S]*>/i.test(value)) {
    return value;
  }

  return value
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(/<(br|hr)\b[^>]*\/?>/gi, "\n")
    .replace(/<\/(p|div|section|article|ul|ol|li|h[1-6]|table|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, "");
}

function normalizeLine(line: string): string {
  const trimmed = line.trim();

  if (!trimmed) {
    return "";
  }

  if (BOILERPLATE_LINE_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    return "";
  }

  if (LIST_BULLET_PATTERN.test(trimmed)) {
    return trimmed.replace(LIST_BULLET_PATTERN, "- ");
  }

  if (NUMBERED_LIST_PATTERN.test(trimmed)) {
    return trimmed.replace(NUMBERED_LIST_PATTERN, "$1. ");
  }

  return trimmed.replace(/[ \t]+/g, " ");
}

function collapseDuplicateLines(lines: string[]): string[] {
  const collapsed: string[] = [];

  for (const line of lines) {
    const previous = collapsed[collapsed.length - 1];

    if (line === "" && previous === "") {
      continue;
    }

    if (
      line !== "" &&
      previous !== "" &&
      line.localeCompare(previous, undefined, { sensitivity: "base" }) === 0
    ) {
      continue;
    }

    collapsed.push(line);
  }

  return collapsed;
}

function normalizeMarkdownText(value: string): string {
  const htmlStripped = stripHtmlToText(decodeHtmlEntities(value));
  const normalizedNewlines = htmlStripped
    .replace(/\r\n?/g, "\n")
    .replace(/\u00a0/g, " ");

  const normalizedLines = normalizedNewlines
    .split("\n")
    .map(normalizeLine)
    .filter((line, index, lines) => {
      if (line !== "") {
        return true;
      }

      const prev = lines[index - 1];
      const next = lines[index + 1];
      return Boolean(prev || next);
    });

  return collapseDuplicateLines(normalizedLines)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeListItems(items?: string[] | null): string[] {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => normalizeMarkdownText(item))
    .filter(Boolean);
}

function buildSection(title: string, items: string[]): string {
  if (items.length === 0) {
    return "";
  }

  return `## ${title}\n${items.map((item) => `- ${item}`).join("\n")}`;
}

function hasEnoughStructuredContent(value: string): boolean {
  const wordCount = value.split(/\s+/).filter(Boolean).length;
  const lineCount = value.split("\n").filter(Boolean).length;
  return wordCount >= 80 || lineCount >= 6;
}

function chooseBaseDescription(
  extractedDescription: string | null,
  rawDescription: string | null,
): string | null {
  if (extractedDescription && rawDescription) {
    if (hasEnoughStructuredContent(extractedDescription)) {
      return extractedDescription;
    }

    if (rawDescription.length > extractedDescription.length * 1.5) {
      return rawDescription;
    }
  }

  return extractedDescription || rawDescription;
}

export function normalizeJobDescription(
  input: NormalizeJobDescriptionInput,
): NormalizeJobDescriptionResult {
  const raw = input.rawDescription?.trim() || input.extractedDescription?.trim() ||
    null;
  const normalizedExtracted = input.extractedDescription
    ? normalizeMarkdownText(input.extractedDescription)
    : null;
  const normalizedRaw = input.rawDescription
    ? normalizeMarkdownText(input.rawDescription)
    : null;

  const responsibilities = normalizeListItems(input.responsibilities);
  const qualifications = normalizeListItems(input.qualifications);
  const baseDescription = chooseBaseDescription(
    normalizedExtracted,
    normalizedRaw,
  );

  const sections: string[] = [];

  if (baseDescription) {
    sections.push(baseDescription);
  }

  if (
    responsibilities.length > 0 &&
    !/##?\s*responsibilities\b/i.test(baseDescription ?? "")
  ) {
    sections.push(buildSection("Responsibilities", responsibilities));
  }

  if (
    qualifications.length > 0 &&
    !/##?\s*(qualifications|requirements)\b/i.test(baseDescription ?? "")
  ) {
    sections.push(buildSection("Qualifications", qualifications));
  }

  const normalizedMarkdown = sections
    .filter(Boolean)
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim() || null;

  return {
    raw,
    normalizedMarkdown,
  };
}
