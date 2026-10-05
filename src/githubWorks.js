const OWNER = 'b-1-o';
const EXCLUDED = new Set(['b-1-o', 'portfolio', 'myUI', 'Portfolio']);
const DISPLAY_NAMES = { Bio: 'Bio', AI: 'AI', heaven: 'HEAVEN', music: 'b1api' };

const GLYPHS = {
  music: 'M9 18V5l12-2v13M6 18a3 3 0 1 0 0-0.01M18 16a3 3 0 1 0 0-0.01',
  phone: 'M7 2h10a2.5 2.5 0 0 1 2.5 2.5v15A2.5 2.5 0 0 1 17 22H7a2.5 2.5 0 0 1-2.5-2.5v-15A2.5 2.5 0 0 1 7 2zM11 18h2',
  web: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0-9-18M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18',
  terminal: 'M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM7 11l3 3-3 3M12 17h5',
  agent: 'M5 10h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zM9 10V8a3 3 0 0 1 6 0v2M9 15h.01M15 15h.01M10 18h4',
  linux: 'M4 17h16M6 17l1.5-9.5a4.5 4.5 0 0 1 9 0L18 17M9 8.5c.5-1 1.5-1.5 3-1.5s2.5.5 3 1.5',
  brand: 'M12 2l3 7h7l-5.5 4.5L18.5 22 12 17l-6.5 5 1.5-8.5L2 9h7l3-7z',
  coffee: 'M6 8h12v6a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8zM18 10h2a2 2 0 0 1 0 4h-2M8 20h8',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 22c2-6 6-9 8-9s6 3 8 9',
  ascii: 'M4 6h16v12H4zM8 10h2M12 10h4M8 14h8',
};

function iconKeyFor(repo) {
  const topics = Array.isArray(repo.topics) ? repo.topics : [];
  const h = [repo.name, repo.description, repo.language, ...topics].filter(Boolean).join(' ').toLowerCase();
  const n = repo.name.toLowerCase();
  if (n.includes('music') || /music|audio|spotify/.test(h)) return 'music';
  if (n.includes('nothing') || /iphone|ios|swift|android|mobile/.test(h)) return 'phone';
  if (n === 'ai' || /agent|ai|llm|machine.?learning|openai/.test(h)) return 'agent';
  if (n.includes('heaven') || /terminal|cli|devtool/.test(h)) return 'terminal';
  if (n === 'bio' || /linux|python|fastapi|backend/.test(h)) return 'linux';
  if (/coffee|cafe/.test(h)) return 'coffee';
  if (n === 'my' || /profile|user|personal/.test(h)) return 'user';
  if (/ascii|shell|bash|command/.test(h)) return 'ascii';
  if (/portfolio|design|ui|ux|website/.test(h)) return 'brand';
  if (['python','rust','go','java','c','c++','c#'].includes((repo.language || '').toLowerCase())) return 'terminal';
  return 'web';
}

function iconDataUrl(key) {
  const d = GLYPHS[key] || GLYPHS.web;
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="32" fill="#111"/><g transform="translate(64 64) scale(3.2) translate(-12 -12)" fill="none" stroke="#e8e8e8" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="' + d + '"/></g></svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

export async function fetchLiveWorks(signal) {
  const repos = [];
  for (let page = 1; page <= 10; page += 1) {
    const response = await fetch('https://api.github.com/users/' + OWNER + '/repos?per_page=100&type=owner&sort=updated&page=' + page, {
      headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store', signal,
    });
    if (!response.ok) throw new Error('GitHub API ' + response.status);
    const batch = await response.json(); repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos
    .filter((r) => !r.private && !r.archived && !r.fork && !EXCLUDED.has(r.name))
    .sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at))
    .map((r) => {
      const title = DISPLAY_NAMES[r.name] || r.name;
      const site = r.homepage && r.homepage.trim() ? r.homepage.trim() : (r.has_pages ? 'https://' + OWNER + '.github.io/' + r.name + '/' : null);
      return { image: iconDataUrl(iconKeyFor(r)), title, description: r.description && r.description.trim() ? r.description.trim() : (r.language || 'GitHub project'), site, repo: r.html_url, link: site || r.html_url };
    });
}