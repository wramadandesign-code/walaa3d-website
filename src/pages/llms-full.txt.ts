import type { APIRoute } from 'astro';
import { buildLlms } from '@/lib/llms';
import { originOf } from '@/config/urls';

export const GET: APIRoute = async ({ site }) =>
  new Response(await buildLlms(originOf(site!), true), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
