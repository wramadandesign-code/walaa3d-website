import type { APIRoute } from 'astro';
import { abs } from '@/config/urls';

// Search engines AND AI assistants are explicitly welcome: being quoted by ChatGPT, Claude,
// Perplexity, Gemini & co. is part of the visibility strategy. Only /thank-you/ is excluded.
const aiAgents = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', // OpenAI
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User', // Anthropic
  'PerplexityBot', 'Perplexity-User', // Perplexity
  'Google-Extended', 'Applebot', 'Applebot-Extended', 'Bingbot', 'DuckAssistBot', 'meta-externalagent', 'CCBot',
];

export const GET: APIRoute = ({ site }) => {
  const lines = [
    '# Walaa 3D Animation — https://walaa3d.studio',
    `# AI summary of this site: ${abs(site!, '/llms.txt')}`,
    '',
    'User-agent: *',
    'Allow: /',
    'Disallow: /thank-you/',
    '',
    ...aiAgents.flatMap((a) => [`User-agent: ${a}`, 'Allow: /', 'Disallow: /thank-you/', '']),
    `Sitemap: ${abs(site!, '/sitemap-index.xml')}`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
