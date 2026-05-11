// ============================================
// State — Simple content cache
// ============================================

const cache = {};

export async function loadContent(filename) {
  if (cache[filename]) return cache[filename];
  try {
    const res = await fetch(`/content/${filename}`);
    const data = await res.json();
    cache[filename] = data;
    return data;
  } catch (e) {
    console.error('Failed to load', filename, e);
    return null;
  }
}
