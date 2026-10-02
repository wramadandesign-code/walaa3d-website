// Builds the n8n workflow "WALAA3D-01: blog autopost (Mon/Wed/Fri)".
//   node automation/n8n/build-workflow.mjs   → writes automation/n8n/walaa3d-blog-autopost.json
// Import on the server: n8n import:workflow --input=<file>; activation needs publish:workflow + an n8n restart (see CLAUDE.md).
// No secrets in here — credentials are referenced by their n8n IDs only.
import { writeFileSync } from 'node:fs';

// Writer: Google Gemini (existing n8n credential, free tier) → fallback: free OpenRouter models
// (same credential + models the NEXU/ALSAKR social workflows use). The Anthropic key on the
// server had no credit when this was built (Oct 2026); to switch back, add a Claude chain here.
const CRED_GEMINI = { googlePalmApi: { id: 'NIpzrWVAKX3xX7Gs', name: 'Google Gemini(PaLM) Api account' } };
const CRED_OPENROUTER = { httpHeaderAuth: { id: 'HnlWZAZ802Ij2PtX', name: 'OpenRouter API' } };
const GEMINI_MODEL = 'gemini-2.5-flash';
const OR_MODELS = ['nvidia/nemotron-3-super-120b-a12b:free', 'google/gemma-4-31b-it:free', 'z-ai/glm-5.2:free'];
const CRED_TG = { telegramApi: { id: 'b6m3KPwrhfEC7KiL', name: 'Telegram account' } };
const CHAT_ID = '1896671921';
const OUTBOX = '/home/node/.n8n-files/walaa3d/outbox';

// ---------------------------------------------------------------- Code: pick topic + build prompt
const pickTopic = String.raw`
const RAW = 'https://raw.githubusercontent.com/wramadandesign-code/walaa3d-website/main/';
const http = (url) => this.helpers.httpRequest({ url, headers: { 'User-Agent': 'walaa3d-autopost' } });
const text = async (path) => { const r = await http(RAW + path + '?t=' + Date.now()); return typeof r === 'string' ? r : JSON.stringify(r); };

const backlog = JSON.parse(await text('content/backlog.json'));
const files = await http('https://api.github.com/repos/wramadandesign-code/walaa3d-website/contents/src/content/blog?ref=main');
const existing = new Set(files.map((f) => f.name.replace(/\.md$/, '')));
const remaining = backlog.topics.filter((t) => !existing.has(t.slug));
if (!remaining.length) return [{ json: { empty: true } }];
const topic = remaining[0];

const projectsTs = await text('src/data/projects.ts');
const projects = [...projectsTs.matchAll(/slug: '([^']+)',\s*number: '\d+',\s*title: '([^']+)',\s*type: '([^']+)'/g)].map((m) => ({ slug: m[1], title: m[2] + ' — ' + m[3] }));
const servicesTs = await text('src/data/services.ts');
const services = [...servicesTs.matchAll(/slug: '([^']+)',\s*key: '[^']+',\s*icon: '[^']+',\s*title: '([^']+)'/g)].map((m) => ({ slug: m[1], title: m[2] }));
const rss = await http('https://walaa3d.studio/rss.xml?t=' + Date.now());
const posts = [...String(rss).matchAll(/<item><title>([^<]+)<\/title><link>https:\/\/walaa3d\.studio(\/blog\/[^<]+)<\/link>/g)].map((m) => ({ url: m[2], title: m[1] }));

const links = [
  { url: '/', title: 'Homepage' }, { url: '/work/', title: 'Portfolio' }, { url: '/services/', title: 'All services' },
  { url: '/about/', title: 'About Walaa Ramadan' }, { url: '/contact/', title: 'Start a project (contact form)' }, { url: '/blog/', title: 'Blog' },
  ...services.map((s) => ({ url: '/services/' + s.slug + '/', title: 'Service: ' + s.title })),
  ...projects.map((p) => ({ url: '/work/' + p.slug + '/', title: 'Project: ' + p.title })),
  ...posts.map((p) => ({ url: p.url, title: 'Article: ' + p.title })),
];

const covers = {
  'cleaning-robot': 'a white autonomous floor-cleaning robot following glowing navigation path lines on a dark floor (3D render)',
  'cleaning-robot-vertical': 'an autonomous cleaning robot under three spotlights in a dark industrial hall (3D render)',
  'service-robot': 'a glossy black restaurant service robot with a smiling face display and blue light strips (3D render)',
  'reception-robot': 'a grey retail assistant robot kiosk with a curved body and touchscreen in a bright studio (3D render)',
  'handheld-device': 'an exploded view of a compact smart sensor showing its shell, flexible circuit and gold-lit circuit board (3D render)',
  'operating-table': 'a surgical operating table with adjustable padded sections on a white background (3D render)',
  'water-heater': 'a close-up of the temperature gauge on a white electric water heater (3D render)',
};

const reference = (await text('src/content/blog/what-is-3d-product-animation.md')).split(/\n---\n/).slice(1).join('\n---\n');

const system = [
  'You write articles for the blog of Walaa 3D Animation (https://walaa3d.studio): the 3D product animation and product visualization studio of Walaa Ramadan, a 3D product animator with an industrial-design background based in Cairo, Egypt, working remotely with brands, startups and manufacturers worldwide.',
  'Services: 3D product animation (commercials, reveals, feature animations, exploded views, mechanism animations, social-media and launch videos); product visualization (hero, e-commerce, marketing and lifestyle renders); product & industrial design support (concepts, 3D/CAD support).',
  'Process: Brief -> Concept -> Production (3D visualization + AI-assisted animation + compositing) -> Review -> Delivery. Accepts CAD (STEP, IGES, SolidWorks, Rhino, OBJ, FBX) or photos/sketches/drawings; no physical sample needed. Delivers MP4 in 16:9, 9:16, 1:1 and 4:5 up to 4K, plus stills. A typical 15-30 second animation takes about 1-3 weeks.',
  '',
  'Write genuinely useful, expert and specific articles for marketing managers, founders and product teams. Be practical: explain how things work, decisions, steps, trade-offs and common mistakes. Clear international English, short paragraphs, no fluff, no hype.',
  '',
  'HARD RULES - an automatic checker rejects any article that breaks them:',
  '1. Never mention any client or brand name. Refer to past work only through the project pages provided, by their generic product name.',
  '2. Never state prices, price ranges, budgets, currencies or currency symbols.',
  '3. Never use percentages or statistics; never cite studies, surveys, research or data ("according to", "studies show", "a survey"...); never invent facts, numbers, testimonials, awards or client results.',
  '4. No external links at all. Internal links ONLY to URLs from the list provided, as markdown links with the exact path, e.g. [3D product animation](/services/3d-product-animation/). Use 4-8 internal links placed naturally. You must link to /contact/ (in the conclusion), to at least one /work/ project page from the related projects and to the most relevant /services/ page.',
  '5. No H1 heading. Use 5-9 "## " H2 sections (question-style headings where natural) and "### " H3s where useful. The last H2 must be "## Conclusion", inviting readers to explore the relevant service and start a project.',
  '6. Start the body with one bold sentence (or two) that directly answers the main question, then one short paragraph saying what the article covers.',
  '7. Body length 1,300-2,000 words. Use bullet lists; add a markdown table or a "- [ ] " checklist only when genuinely useful.',
  '8. Never write "guarantee", "best in the world", "#1" or "number one", and never refer to yourself as an AI.',
  '9. Only describe services the studio actually offers (listed above). Never mention AR, VR, 3D viewers, configurators or interactive 3D experiences.',
  '',
  'OUTPUT: return ONLY one JSON object (no code fences, nothing before or after) with exactly these keys:',
  '"title" (max 70 characters, contains the main keyword), "seoTitle" (max 40 characters, short version for the browser tab), "description" (meta description, 130-160 characters), "summary" (1-2 sentences, 150-350 characters, a direct quotable answer), "tags" (array of 4-6 short keyword phrases), "coverAlt" (alt text describing the cover image, 40-120 characters), "takeaways" (array of 4-5 complete sentences), "faqs" (array of 4-5 objects {"q": question ending with "?", "a": answer of 2-4 sentences, at least 100 characters}), "body" (the article body in markdown, following the rules above).',
].join('\n');

const user = [
  'Write the next article.',
  '',
  'TOPIC: ' + topic.title,
  'MAIN KEYWORD: ' + topic.keyword,
  'ANGLE: ' + topic.angle,
  'CATEGORY: ' + topic.category,
  'COVER IMAGE (write coverAlt for it): ' + covers[topic.cover],
  'RELATED PROJECTS TO REFERENCE (link at least one): ' + topic.related.map((s) => '/work/' + s + '/').join(', '),
  '',
  'ALLOWED INTERNAL LINKS (url - page):',
  ...links.map((l) => l.url + ' - ' + l.title),
  '',
  'EXISTING ARTICLES (do not repeat them; link to them where relevant): ' + posts.map((p) => p.title).join(' | '),
  '',
  'STYLE REFERENCE - an existing article body from this blog. Match its structure, tone and depth, but write completely new content for the new topic:',
  '<<<',
  reference.trim(),
  '>>>',
].join('\n');

const prompt = { system, messages: [{ role: 'user', content: user }] };
const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Cairo' });
return [{ json: { empty: false, topic, remaining: remaining.length - 1, nextTopic: remaining[1]?.title || null, links: links.map((l) => l.url), projectSlugs: projects.map((p) => p.slug), postTitles: posts.map((p) => p.title), today, prompt } }];
`;

// ---------------------------------------------------------------- Code: validate + assemble (used twice)
const validate = () => String.raw`
const ctx = $('Pick topic').first().json;
const errors = [];
const resp = $input.first().json;
let raw = String(resp.text || '').replace(/^\s*\x60{3}(?:json)?\s*/i, '').replace(/\s*\x60{3}\s*$/, '');
if (resp.error && !raw) errors.push('AI provider error: ' + resp.error);
let d = {};
if (!errors.length) try { d = JSON.parse(raw.slice(raw.indexOf('{'), raw.lastIndexOf('}') + 1)); } catch (e) { errors.push('Output was not one valid JSON object: ' + e.message); }

const t = ctx.topic;
const need = (c, m) => { if (!c) errors.push(m); };
const len = (s) => String(s || '').length;
if (!errors.length) {
  need(len(d.title) >= 20 && len(d.title) <= 70, 'title must be 20-70 characters (is ' + len(d.title) + ')');
  need(len(d.seoTitle) >= 10 && len(d.seoTitle) <= 40, 'seoTitle must be 15-40 characters (is ' + len(d.seoTitle) + ')');
  need(len(d.description) >= 120 && len(d.description) <= 165, 'description must be 120-165 characters (is ' + len(d.description) + ')');
  need(len(d.summary) >= 120 && len(d.summary) <= 420, 'summary must be 120-420 characters (is ' + len(d.summary) + ')');
  need(Array.isArray(d.tags) && d.tags.length >= 3 && d.tags.length <= 8, 'tags must have 3-8 items');
  need(len(d.coverAlt) >= 20, 'coverAlt too short');
  need(Array.isArray(d.takeaways) && d.takeaways.length >= 3 && d.takeaways.length <= 6, 'takeaways must have 3-6 items');
  need(Array.isArray(d.faqs) && d.faqs.length >= 3 && d.faqs.length <= 6, 'faqs must have 3-6 items');
  (d.faqs || []).forEach((f, i) => need(String(f.q || '').trim().endsWith('?') && len(f.a) >= 80, 'faq ' + (i + 1) + ': question must end with "?" and answer be at least 80 characters'));
  const body = String(d.body || '');
  const wc = body.split(/\s+/).filter(Boolean).length;
  need(wc >= 1100 && wc <= 2800, 'body must be 1,100-2,800 words (is ' + wc + ')');
  need(!/^#\s/m.test(body), 'body must not contain an H1 ("# ")');
  need((body.match(/^##\s+\S/gm) || []).length >= 5, 'body needs at least 5 "## " sections');
  need(/\]\(\/contact\/\)/.test(body), 'body must link to /contact/');
  need(/\]\(\/work\//.test(body), 'body must link to at least one project page (/work/...) from the list');
  const nLinks = (body.match(/\]\(\/[^)]*\)/g) || []).length;
  need(nLinks >= 3, 'body needs at least 3 internal links (it has ' + nLinks + ')');
  for (const m of body.matchAll(/\]\(([^)\s]+)\)/g)) {
    const href = m[1];
    if (/^https?:/.test(href)) errors.push('external link not allowed: ' + href);
    else if (href.startsWith('/') && !ctx.links.includes(href.split('#')[0])) errors.push('link to a page that does not exist: ' + href);
  }
  const all = JSON.stringify(d);
  const banned = [
    [/\b(atlantic|ghalioungui|lomi|steatite|gusto)\b/i, 'client brand name'],
    [/\bM[ōO]V\b/, 'client brand name'],
    [/[$€£]\s?\d|\b\d[\d,.]*\s?(usd|egp|eur|dollars?)\b/i, 'price or currency amount'],
    [/\b\d+(\.\d+)?\s?%/, 'percentage statistic'],
    [/\b(according to|studies show|research shows|a survey|statistics show|data shows)\b/i, 'unsourced research claim'],
    [/\b(guarantee[sd]?|best in the world|#1|number one)\b/i, 'over-promise'],
    [/\b(as an ai|language model)\b/i, 'AI artefact'],
    [/(\bAR\s?\/\s?VR\b|\bVR\b|augmented reality|virtual reality|3D viewer|configurator)/i, 'service the studio does not offer (AR/VR/3D viewer/configurator)'],
  ];
  for (const [re, why] of banned) { const h = all.match(re); if (h) errors.push(why + ': "' + h[0] + '" - remove it'); }
  if (ctx.postTitles.map((x) => x.toLowerCase()).includes(String(d.title).toLowerCase())) errors.push('title duplicates an existing article');
}

const q = (s) => "'" + String(s).replace(/\s+/g, ' ').trim().replace(/'/g, "''") + "'";
let markdown = '';
if (!errors.length) {
  markdown = [
    '---',
    'title: ' + q(d.title),
    'seoTitle: ' + q(d.seoTitle),
    'description: ' + q(d.description),
    'summary: ' + q(d.summary),
    'pubDate: ' + ctx.today,
    'category: ' + q(t.category),
    'tags: [' + d.tags.map(q).join(', ') + ']',
    'cover: ' + q(t.cover),
    'coverAlt: ' + q(d.coverAlt),
    'takeaways:',
    ...d.takeaways.map((x) => '  - ' + q(x)),
    'faqs:',
    ...d.faqs.flatMap((f) => ['  - q: ' + q(f.q), '    a: ' + q(f.a)]),
    'related: [' + t.related.map(q).join(', ') + ']',
    '---',
    '',
    String(d.body).trim(),
    '',
  ].join('\n');
}
return [{ json: { ok: errors.length === 0, errors, slug: t.slug, title: d.title || t.title, markdown, rawJson: raw.slice(0, 60000) } }];
`;

const fixRequest = String.raw`
const ctx = $('Pick topic').first().json;
const v = $input.first().json;
const prompt = {
  system: ctx.prompt.system,
  messages: [
    ctx.prompt.messages[0],
    { role: 'assistant', content: v.rawJson || '(no valid output)' },
    { role: 'user', content: 'The automatic checker rejected this article:\n- ' + v.errors.join('\n- ') + '\n\nFix every problem and return the complete corrected JSON object (same keys), nothing else.' },
  ],
};
return [{ json: { prompt } }];
`;

// Normalizers turn each provider's response (or error) into { text, error }.
const normGemini = String.raw`
const r = $input.first().json || {};
const text = ((r.candidates && r.candidates[0] && r.candidates[0].content && r.candidates[0].content.parts) || []).map((p) => p.text || '').join('');
return [{ json: { provider: 'gemini', text, error: text ? undefined : (r.error ? (r.error.message || JSON.stringify(r.error)) : 'Gemini returned no text') } }];
`;
const normOpenRouter = String.raw`
const r = $input.first().json || {};
const text = (r.choices && r.choices[0] && r.choices[0].message && r.choices[0].message.content) || '';
const err = r.error ? (r.error.message || JSON.stringify(r.error)) : (text ? undefined : 'OpenRouter returned no text');
return [{ json: { provider: 'openrouter:' + (r.model || '?'), text, error: err } }];
`;

// ---------------------------------------------------------------- node helpers
let x = 0;
const pos = () => [(x += 260), 300];
const ifTrue = (id, left) => ({
  conditions: {
    options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
    conditions: [{ id, leftValue: left, rightValue: true, operator: { type: 'boolean', operation: 'true', singleValue: true } }],
    combinator: 'and',
  },
  options: {},
});
const tg = (name, text) => ({
  parameters: { resource: 'message', operation: 'sendMessage', chatId: CHAT_ID, text, additionalFields: { parse_mode: 'HTML', disable_web_page_preview: false, appendAttribution: false } },
  name, type: 'n8n-nodes-base.telegram', typeVersion: 1.2, position: pos(), credentials: CRED_TG,
});
const code = (name, jsCode) => ({ parameters: { jsCode }, name, type: 'n8n-nodes-base.code', typeVersion: 2, position: pos() });

// The prompt ({ system, messages[] }) comes from the node named by promptFrom.
const geminiBody = (promptFrom) => `={{ JSON.stringify({
  systemInstruction: { parts: [{ text: $('${promptFrom}').first().json.prompt.system }] },
  contents: $('${promptFrom}').first().json.prompt.messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
  generationConfig: { responseMimeType: 'application/json', temperature: 0.7, maxOutputTokens: 32768 }
}) }}`;
const openRouterBody = (promptFrom) => `={{ JSON.stringify({
  model: '${OR_MODELS[0]}',
  models: ${JSON.stringify(OR_MODELS).replace(/"/g, "'")},
  temperature: 0.7,
  response_format: { type: 'json_object' },
  messages: [{ role: 'system', content: $('${promptFrom}').first().json.prompt.system }].concat($('${promptFrom}').first().json.prompt.messages)
}) }}`;

/** OpenRouter free models → (on error) Gemini, both normalized into { text, error } and sent to `target`. */
function llmChain(prefix, promptFrom, target, conns) {
  const g = `${prefix}: Gemini fallback`, gn = `${prefix}: Gemini result`, o = `${prefix}: OpenRouter`, on = `${prefix}: OpenRouter result`;
  const nodes = [
    {
      parameters: {
        method: 'POST',
        url: `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
        authentication: 'predefinedCredentialType', nodeCredentialType: 'googlePalmApi',
        sendBody: true, specifyBody: 'json', jsonBody: geminiBody(promptFrom), options: { timeout: 300000 },
      },
      name: g, type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: pos(), credentials: CRED_GEMINI,
      retryOnFail: true, maxTries: 2, waitBetweenTries: 10000, onError: 'continueErrorOutput',
    },
    code(gn, normGemini),
    {
      parameters: {
        method: 'POST', url: 'https://openrouter.ai/api/v1/chat/completions',
        authentication: 'genericCredentialType', genericAuthType: 'httpHeaderAuth',
        sendBody: true, specifyBody: 'json', jsonBody: openRouterBody(promptFrom), options: { timeout: 300000 },
      },
      name: o, type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: pos(), credentials: CRED_OPENROUTER,
      retryOnFail: true, maxTries: 2, waitBetweenTries: 10000, onError: 'continueErrorOutput',
    },
    code(on, normOpenRouter),
  ];
  conns[o] = { main: [[{ node: on, type: 'main', index: 0 }], [{ node: g, type: 'main', index: 0 }]] };
  conns[gn] = { main: [[{ node: target, type: 'main', index: 0 }]] };
  conns[g] = { main: [[{ node: gn, type: 'main', index: 0 }], [{ node: gn, type: 'main', index: 0 }]] };
  conns[on] = { main: [[{ node: target, type: 'main', index: 0 }]] };
  return { first: o, nodes };
}

const connections = {};
const write = llmChain('Write', 'Pick topic', 'Validate', connections);
const fix = llmChain('Fix', 'Build fix request', 'Validate (retry)', connections);
const TOPIC = "($('Pick topic').first().json.topic || {})";

const nodes = [
  { parameters: { rule: { interval: [{ field: 'cronExpression', expression: '0 9 * * 1,3,5' }] } }, name: 'Mon/Wed/Fri 09:00', type: 'n8n-nodes-base.scheduleTrigger', typeVersion: 1.2, position: pos() },
  { parameters: {}, name: 'Run now (manual)', type: 'n8n-nodes-base.manualTrigger', typeVersion: 1, position: [0, 500] },
  { ...code('Pick topic', pickTopic), onError: 'continueErrorOutput' },
  { parameters: ifTrue('has-topic', '={{ !$json.empty }}'), name: 'Has topic?', type: 'n8n-nodes-base.if', typeVersion: 2.2, position: pos() },
  tg('TG: queue empty', '⚠️ <b>walaa3d.studio blog</b>\nThe topic list is empty — no article was written today. Add topics to content/backlog.json.'),
  ...write.nodes,
  code('Validate', validate()),
  { parameters: ifTrue('valid-1', '={{ $json.ok }}'), name: 'Valid?', type: 'n8n-nodes-base.if', typeVersion: 2.2, position: pos() },
  code('Build fix request', fixRequest),
  ...fix.nodes,
  code('Validate (retry)', validate()),
  { parameters: ifTrue('valid-2', '={{ $json.ok }}'), name: 'Valid after fix?', type: 'n8n-nodes-base.if', typeVersion: 2.2, position: pos() },
  tg('TG: failed', `=❌ <b>walaa3d.studio blog — article not published</b>\nTopic: {{ ${TOPIC}.title || '(could not load topics)' }}\nReason: {{ ($json.errors || [($json.error && $json.error.message) || $json.message || 'unknown error']).slice(0, 6).join('; ') }}\nThe topic stays in the queue and will be tried again at the next run.`),
  code('Prepare file', 'const v = $input.first().json;\nreturn [{ json: { slug: v.slug, title: v.title, markdown: v.markdown } }];'),
  { parameters: { operation: 'toText', sourceProperty: 'markdown', options: { fileName: '={{ $json.slug }}.md' } }, name: 'To file', type: 'n8n-nodes-base.convertToFile', typeVersion: 1.1, position: pos() },
  { parameters: { operation: 'write', fileName: `=${OUTBOX}/{{ $('Prepare file').first().json.slug }}.md`, options: {} }, name: 'Save to outbox', type: 'n8n-nodes-base.readWriteFile', typeVersion: 1, position: pos() },
  { parameters: { amount: 12, unit: 'minutes' }, name: 'Wait 12 min', type: 'n8n-nodes-base.wait', typeVersion: 1.1, position: pos(), webhookId: 'walaa3d-autopost-wait' },
  { parameters: { url: "=https://walaa3d.studio/blog/{{ $('Prepare file').first().json.slug }}/", options: { response: { response: { fullResponse: true, neverError: true } } } }, name: 'Check live', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: pos() },
  { parameters: ifTrue('is-live', '={{ $json.statusCode === 200 }}'), name: 'Live?', type: 'n8n-nodes-base.if', typeVersion: 2.2, position: pos() },
  tg('TG: published', `=✅ <b>New article published on walaa3d.studio</b>\n\n<b>{{ $('Prepare file').first().json.title }}</b>\nhttps://walaa3d.studio/blog/{{ $('Prepare file').first().json.slug }}/\n\nKeyword: {{ ${TOPIC}.keyword }}\nNext: {{ $('Pick topic').first().json.nextTopic || '— queue empty, add topics' }} ({{ $('Pick topic').first().json.remaining }} left in the queue)`),
  tg('TG: not live', "=⚠️ <b>walaa3d.studio blog</b>\nThe article <b>{{ $('Prepare file').first().json.title }}</b> was written but is not live after 12 minutes (the site checks may have rejected it).\nCheck: https://github.com/wramadandesign-code/walaa3d-website/actions"),
];

Object.assign(connections, {
  'Mon/Wed/Fri 09:00': { main: [[{ node: 'Pick topic', type: 'main', index: 0 }]] },
  'Run now (manual)': { main: [[{ node: 'Pick topic', type: 'main', index: 0 }]] },
  'Pick topic': { main: [[{ node: 'Has topic?', type: 'main', index: 0 }], [{ node: 'TG: failed', type: 'main', index: 0 }]] },
  'Has topic?': { main: [[{ node: write.first, type: 'main', index: 0 }], [{ node: 'TG: queue empty', type: 'main', index: 0 }]] },
  Validate: { main: [[{ node: 'Valid?', type: 'main', index: 0 }]] },
  'Valid?': { main: [[{ node: 'Prepare file', type: 'main', index: 0 }], [{ node: 'Build fix request', type: 'main', index: 0 }]] },
  'Build fix request': { main: [[{ node: fix.first, type: 'main', index: 0 }]] },
  'Validate (retry)': { main: [[{ node: 'Valid after fix?', type: 'main', index: 0 }]] },
  'Valid after fix?': { main: [[{ node: 'Prepare file', type: 'main', index: 0 }], [{ node: 'TG: failed', type: 'main', index: 0 }]] },
  'Prepare file': { main: [[{ node: 'To file', type: 'main', index: 0 }]] },
  'To file': { main: [[{ node: 'Save to outbox', type: 'main', index: 0 }]] },
  'Save to outbox': { main: [[{ node: 'Wait 12 min', type: 'main', index: 0 }]] },
  'Wait 12 min': { main: [[{ node: 'Check live', type: 'main', index: 0 }]] },
  'Check live': { main: [[{ node: 'Live?', type: 'main', index: 0 }]] },
  'Live?': { main: [[{ node: 'TG: published', type: 'main', index: 0 }], [{ node: 'TG: not live', type: 'main', index: 0 }]] },
});

const workflow = {
  id: 'Walaa3dBlogAuto1',
  name: 'WALAA3D-01: blog autopost (Mon/Wed/Fri)',
  nodes: nodes.map((n, i) => ({ id: `w3d-${i}`, ...n })),
  connections,
  settings: { executionOrder: 'v1', timezone: 'Africa/Cairo', saveManualExecutions: true },
  active: false,
  pinData: {},
};

writeFileSync(new URL('./walaa3d-blog-autopost.json', import.meta.url), JSON.stringify([workflow], null, 2));
console.log('written', nodes.length, 'nodes');
