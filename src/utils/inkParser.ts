/**
 * Utility for loading and compiling Ink stories.
 *
 * In development: place compiled .ink.json files in /public/assets/ink/
 * Compile .ink files using the Inky editor or inklecate CLI:
 *   inklecate -o main.ink.json main.ink
 */
export async function loadInkJson(url: string): Promise<object> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ink story: ${url} (${res.status})`);
  return res.json();
}

export function parseTagValue(tag: string, prefix: string): string | null {
  if (tag.startsWith(`${prefix}:`)) {
    return tag.slice(prefix.length + 1);
  }
  return null;
}

export function extractTags(tags: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  tags.forEach(tag => {
    const colon = tag.indexOf(':');
    if (colon !== -1) {
      result[tag.slice(0, colon).trim()] = tag.slice(colon + 1).trim();
    } else {
      result[tag.trim()] = 'true';
    }
  });
  return result;
}
