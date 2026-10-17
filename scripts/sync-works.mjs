import { mkdir, writeFile, readdir, unlink } from 'node:fs/promises';
import { join } from 'node:path';

const owner = 'b-1-o';
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

// Meta / self-referential repos that should never appear on /works.
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

/** Icon glyph paths (24x24 style), used inside the dark rounded tile. */
const GLYPHS = {
  music:
    'M9 18V5l12-2v13M6 18a3 3 0 1 0 0-0.01M18 16a3 3 0 1 0 0-0.01',
  phone:
    'M7 2h10a2.5 2.5 0 0 1 2.5 2.5v15A2.5 2.5 0 0 1 17 22H7a2.5 2.5 0 0 1-2.5-2.5v-15A2.5 2.5 0 0 1 7 2zM11 18h2',
  web: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18',
  terminal:
    'M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM7 11l3 3-3 3M12 17h5',
  agent:
    'M5 10h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zM9 10V8a3 3 0 0 1 6 0v2M9 15h.01M15 15h.01M10 18h4',
  linux:
    'M4 17h16M6 17l1.5-9.5a4.5 4.5 0 0 1 9 0L18 17M9 8.5c.5-1 1.5-1.5 3-1.5s2.5.5 3 1.5',
  brand:
    'M12 2l3 7h7l-5.5 4.5L18.5 22 12 17l-6.5 5 1.5-8.5L2 9h7l3-7z',
  coffee:
    'M6 8h12v6a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8zM18 10h2a2 2 0 0 1 0 4h-2M8 20h8',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 22c2-6 6-9 8-9s6 3 8 9',
  ascii:
    'M4 6h16v12H4zM8 10h2M12 10h4M8 14h8',
  default:
    'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18',
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

function makeIconSvg(key) {
  const d = GLYPHS[key] || GLYPHS.default;
  // Match existing public/icons style: dark tile + light stroke glyph.
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">',
    '<rect width="128" height="128" rx="32" fill="#111"/>',
    `<g transform="translate(64 64) scale(3.2) translate(-12 -12)" fill="none" stroke="#e8e8e8" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">`,
    `<path d="${d}"/>`,
    '</g>',
    '</svg>',
    '',
  ].join('');
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
  const iconKey = iconKeyFor(repo.name);
  const iconFile = `${repo.name.toLowerCase()}.svg`;
  usedIconFiles.add(iconFile);

  const svg = makeIconSvg(iconKey);
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

// Remove orphan icon svgs that no longer map to a live repo (keep *-light variants).
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
