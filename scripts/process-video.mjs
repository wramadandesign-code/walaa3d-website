// Turns a source render into every file the site needs.
//
//   node scripts/process-video.mjs <input.mp4> <name> [posterSec=3] [loopStartSec=0] [loopDurSec=15]
//
// Writes to public/media:
//   video/<name>.mp4             full video (H.264, audio kept, web-optimized)
//   video/<name>-loop.webm|.mp4  muted preview loop, max 960px wide
//   posters/<name>.webp|.jpg     poster frame (webp for the page, jpg for OG/schema)
//
// Needs ffmpeg on PATH, or set FFMPEG=/full/path/to/ffmpeg.
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const [input, name, posterSec = '3', loopStart = '0', loopDur = '15'] = process.argv.slice(2);
if (!input || !name) {
  console.error('Usage: node scripts/process-video.mjs <input.mp4> <name> [posterSec] [loopStartSec] [loopDurSec]');
  process.exit(1);
}

const ff = process.env.FFMPEG || 'ffmpeg';
const V = 'public/media/video';
const P = 'public/media/posters';
mkdirSync(V, { recursive: true });
mkdirSync(P, { recursive: true });

const run = (label, args) => {
  console.log(`→ ${label}`);
  const r = spawnSync(ff, ['-v', 'error', '-y', ...args], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(r.status ?? 1);
};

const loopIn = ['-ss', loopStart, '-t', loopDur, '-i', input, '-an', '-vf', "scale='min(iw,960)':-2"];

run('full mp4', ['-i', input, '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-vf', "scale='min(iw,1920)':-2", '-c:a', 'aac', '-b:a', '128k', `${V}/${name}.mp4`]);
run('loop mp4', [...loopIn, '-c:v', 'libx264', '-preset', 'slow', '-crf', '26', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${V}/${name}-loop.mp4`]);
run('loop webm', [...loopIn, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '36', '-row-mt', '1', `${V}/${name}-loop.webm`]);
run('poster webp', ['-ss', posterSec, '-i', input, '-frames:v', '1', '-vf', "scale='min(iw,1600)':-2", '-c:v', 'libwebp', '-quality', '82', `${P}/${name}.webp`]);
run('poster jpg', ['-ss', posterSec, '-i', input, '-frames:v', '1', '-vf', "scale='min(iw,1600)':-2", '-q:v', '3', `${P}/${name}.jpg`]);

console.log(`\nDone. Reference it in src/data/projects.ts as media name "${name}" (update width/height/duration).`);
