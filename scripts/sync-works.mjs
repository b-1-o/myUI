import { mkdir, writeFile, readdir, unlink } from 'node:fs/promises';
import { join } from 'node:path';

const owner = 'b-1-o';
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

const excludedRepos = new Set([
  'b-1-o',
  'portfolio',
  'myUI',
  'Portfolio',
]);

const displayNames = {
  Bio: 'Bio',
  AI: 'AI',
  heaven: 'HEAVEN',
  music: 'b1api',
};

async function github(path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'b-1-o-myui-sync',
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API ${response.status}: ${path}`);
  }

  return response.json();
}

/** Professional per-project logos (128×128 dark tile). */
const CUSTOM_ICONS = {
  jobrain: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect width="128" height="128" rx="28" fill="#0c0c0c"/>
  <path d="M40 52c0-12 10-22 24-22s24 10 24 22v6c0 4-2 7-5 9l-3 2v8c0 6-5 11-11 11h-10c-6 0-11-5-11-11v-8l-3-2c-3-2-5-5-5-9v-6z" stroke="#e8e8e8" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M52 72h24M56 82h16" stroke="#e8e8e8" stroke-width="2.8" stroke-linecap="round"/>
  <circle cx="64" cy="44" r="3" fill="#e8e8e8"/>
  <path d="M48 38c4-6 12-9 16-9s12 3 16 9" stroke="#e8e8e8" stroke-width="2.4" stroke-linecap="round" opacity="0.5"/>
</svg>`,
  selfmusic: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect width="128" height="128" rx="28" fill="#0c0c0c"/>
  <path d="M48 78V42l36-6v36" stroke="#e8e8e8" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="42" cy="78" r="10" stroke="#e8e8e8" stroke-width="3.5"/>
  <circle cx="78" cy="72" r="10" stroke="#e8e8e8" stroke-width="3.5"/>
  <path d="M48 50l36-6" stroke="#e8e8e8" stroke-width="2" opacity="0.4"/>
</svg>`,
  music: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect width="128" height="128" rx="28" fill="#0c0c0c"/>
  <path d="M48 78V42l36-6v36" stroke="#e8e8e8" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="42" cy="78" r="10" stroke="#e8e8e8" stroke-width="3.5"/>
  <circle cx="78" cy="72" r="10" stroke="#e8e8e8" stroke-width="3.5"/>
  <path d="M48 50l36-6" stroke="#e8e8e8" stroke-width="2" opacity="0.4"/>
</svg>`,
  'cloud-project': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect width="128" height="128" rx="28" fill="#0c0c0c"/>
  <path d="M38 72h42a14 14 0 0 0 0-28 18 18 0 0 0-34-6 16 16 0 0 0-8 34z" stroke="#e8e8e8" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M48 78h32v18H48z" stroke="#e8e8e8" stroke-width="2.8" stroke-linejoin="round"/>
  <path d="M54 84h20M54 90h14" stroke="#e8e8e8" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
</svg>`,
  heaven: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect width="128" height="128" rx="28" fill="#0c0c0c"/>
  <rect x="32" y="36" width="64" height="56" rx="8" stroke="#e8e8e8" stroke-width="3.2"/>
  <path d="M44 56l12 10 8-8 16 16" stroke="#e8e8e8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M44 80h28" stroke="#e8e8e8" stroke-width="2.6" stroke-linecap="round" opacity="0.6"/>
</svg>`,
  ai: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect width="128" height="128" rx="28" fill="#0c0c0c"/>
  <circle cx="64" cy="64" r="14" stroke="#e8e8e8" stroke-width="3.2"/>
  <circle cx="64" cy="64" r="5" fill="#e8e8e8"/>
  <path d="M64 36v10M64 82v10M36 64h10M82 64h10M44 44l7 7M77 77l7 7M44 84l7-7M77 51l7-7" stroke="#e8e8e8" stroke-width="2.8" stroke-linecap="round"/>
</svg>`,
  coffee: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect width="128" height="128" rx="28" fill="#0c0c0c"/>
  <path d="M38 48h42v28a16 16 0 0 1-16 16H54a16 16 0 0 1-16-16V48z" stroke="#e8e8e8" stroke-width="3.2" stroke-linejoin="round"/>
  <path d="M80 56h8a10 10 0 0 1 0 20h-8" stroke="#e8e8e8" stroke-width="3.2" stroke-linecap="round"/>
  <path d="M46 92h36" stroke="#e8e8e8" stroke-width="3" stroke-linecap="round"/>
  <path d="M52 38c2-4 6-6 10-6s8 2 10 6" stroke="#e8e8e8" stroke-width="2.4" stroke-linecap="round" opacity="0.55"/>
</svg>`,
  nothing: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect width="128" height="128" rx="28" fill="#0c0c0c"/>
  <rect x="44" y="28" width="40" height="72" rx="8" stroke="#e8e8e8" stroke-width="3.2"/>
  <rect x="56" y="36" width="16" height="4" rx="2" fill="#e8e8e8" opacity="0.5"/>
  <circle cx="64" cy="86" r="4" stroke="#e8e8e8" stroke-width="2.5"/>
</svg>`,
  bio: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect width="128" height="128" rx="28" fill="#0c0c0c"/>
  <path d="M64 30c-12 0-22 10-22 22v6c0 8 4 15 11 19v7c0 6 5 11 11 11s11-5 11-11v-7c7-4 11-11 11-19v-6c0-12-10-22-22-22z" stroke="#e8e8e8" stroke-width="3.2" stroke-linejoin="round"/>
  <path d="M52 52c3-6 8-9 12-9s9 3 12 9" stroke="#e8e8e8" stroke-width="2.4" stroke-linecap="round" opacity="0.45"/>
  <circle cx="56" cy="58" r="2.5" fill="#e8e8e8"/>
  <circle cx="72" cy="58" r="2.5" fill="#e8e8e8"/>
  <path d="M58 70h12" stroke="#e8e8e8" stroke-width="2.4" stroke-linecap="round"/>
</svg>`,
  my: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect width="128" height="128" rx="28" fill="#0c0c0c"/>
  <circle cx="64" cy="50" r="16" stroke="#e8e8e8" stroke-width="3.2"/>
  <path d="M36 98c6-18 16-26 28-26s22 8 28 26" stroke="#e8e8e8" stroke-width="3.2" stroke-linecap="round"/>
</svg>`,
  autofill: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect width="128" height="128" rx="28" fill="#0c0c0c"/>
  <rect x="34" y="34" width="60" height="60" rx="8" stroke="#e8e8e8" stroke-width="3.2"/>
  <path d="M46 52h36M46 64h28M46 76h20" stroke="#e8e8e8" stroke-width="2.8" stroke-linecap="round"/>
  <path d="M78 72l12 6-12 6v-5h-10v-2h10v-5z" fill="#e8e8e8"/>
</svg>`,
};

/** Fallback glyph paths (24×24 style) for unknown repos. */
const GLYPHS = {
  music: 'M9 18V5l12-2v13M6 18a3 3 0 1 0 0-0.01M18 16a3 3 0 1 0 0-0.01',
  phone: 'M7 2h10a2.5 2.5 0 0 1 2.5 2.5v15A2.5 2.5 0 0 1 17 22H7a2.5 2.5 0 0 1-2.5-2.5v-15A2.5 2.5 0 0 1 7 2zM11 18h2',
  web: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18',
  terminal: 'M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM7 11l3 3-3 3M12 17h5',
  agent: 'M5 10h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zM9 10V8a3 3 0 0 1 6 0v2M9 15h.01M15 15h.01M10 18h4',
  linux: 'M4 17h16M6 17l1.5-9.5a4.5 4.5 0 0 1 9 0L18 17M9 8.5c.5-1 1.5-1.5 3-1.5s2.5.5 3 1.5',
  brand: 'M12 2l3 7h7l-5.5 4.5L18.5 22 12 17l-6.5 5 1.5-8.5L2 9h7l3-7z',
  coffee: 'M6 8h12v6a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8zM18 10h2a2 2 0 0 1 0 4h-2M8 20h8',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 22c2-6 6-9 8-9s6 3 8 9',
  ascii: 'M4 6h16v12H4zM8 10h2M12 10h4M8 14h8',
  default: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18',
};

const iconKeyFor = (name) => {
  const value = name.toLowerCase();
  if (value.includes('music') || value === 'b1api') return 'music';
  if (value.includes('nothing')) return 'phone';
  if (value.includes('heaven')) return 'terminal';
  if (value === 'ai' || value.includes('agent')) return 'agent';
  if (value === 'bio' || value.includes('biohub')) return 'linux';
  if (value.includes('coffee')) return 'coffee';
  if (value === 'my') return 'user';
  if (value.includes('ascii')) return 'ascii';
  if (value.includes('portfolio')) return 'brand';
  return 'default';
};

function makeFallbackSvg(key) {
  const d = GLYPHS[key] || GLYPHS.default;
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">',
    '<rect width="128" height="128" rx="28" fill="#0c0c0c"/>',
    `<g transform="translate(64 64) scale(3.1) translate(-12 -12)" fill="none" stroke="#e8e8e8" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">`,
    `<path d="${d}"/>`,
    '</g>',
    '</svg>',
    '',
  ].join('');
}

function makeIconSvg(repoName) {
  const key = repoName.toLowerCase();
  if (CUSTOM_ICONS[key]) return CUSTOM_ICONS[key].trim() + '\n';
  return makeFallbackSvg(iconKeyFor(repoName));
}

const languageLabel = (language) => {
  if (!language) return 'GitHub · Project';
  const map = {
    TypeScript: 'TypeScript',
    JavaScript: 'JavaScript',
    CSS: 'CSS',
    HTML: 'HTML',
    Python: 'Python',
    Swift: 'Swift',
  };
  return map[language] || language;
};

const repos = await github(
  `/users/${owner}/repos?per_page=100&type=owner&sort=updated`
);
const publicRepos = repos.filter(
  (repo) =>
    !repo.private &&
    !repo.archived &&
    !repo.fork &&
    !excludedRepos.has(repo.name)
);

const works = [];
const iconDir = 'public/icons';
await mkdir(iconDir, { recursive: true });

const usedIconFiles = new Set();

for (const repo of publicRepos) {
  let site = repo.homepage || null;

  if (!site && repo.has_pages) {
    try {
      const pages = await github(`/repos/${owner}/${repo.name}/pages`);
      site =
        pages.html_url ||
        (pages.url ? `https://${owner}.github.io/${repo.name}/` : null);
    } catch {
      // ignore
    }
  }

  if (!site && repo.has_pages) {
    site = `https://${owner}.github.io/${repo.name}/`;
  }

  const displayName = displayNames[repo.name] || repo.name;
  const iconFile = `${repo.name.toLowerCase()}.svg`;
  usedIconFiles.add(iconFile);

  const svg = makeIconSvg(repo.name);
  await writeFile(join(iconDir, iconFile), svg, 'utf8');

  const lang = languageLabel(repo.language);
  const description = repo.description?.trim()
    ? repo.description.trim()
    : `${lang}`;

  works.push({
    image: `icons/${iconFile}`,
    title: displayName,
    description,
    site,
    repo: repo.html_url,
    link: site || repo.html_url,
    updatedAt: repo.updated_at,
  });
}

works.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
works.forEach((w) => {
  delete w.updatedAt;
});

try {
  const existing = await readdir(iconDir);
  for (const file of existing) {
    if (!file.endsWith('.svg')) continue;
    if (file.includes('-light')) continue;
    if (!usedIconFiles.has(file)) {
      await unlink(join(iconDir, file));
      console.log(`Removed orphan icon: ${file}`);
    }
  }
} catch {
  // icons dir may be empty on first run
}

await writeFile(
  'src/works.auto.json',
  `${JSON.stringify(works, null, 2)}\n`,
  'utf8'
);
console.log(`Synced ${works.length} works + icons.`);
