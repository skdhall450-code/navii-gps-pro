import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const s=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('continuous hero motion includes pause and reduced-motion protection',()=>{
 const css=s('components/home/premium-home.module.css');
 assert.match(css,/feature-float 4s ease-in-out infinite/);
 assert.match(css,/hero-glow-drift 10s/);
 assert.match(css,/data-motion-paused="true"/);
 assert.match(css,/prefers-reduced-motion: reduce/);
 assert.match(s('components/home/HeroV2.tsx'),/Pause hero animation/);
});
test('running reviews preserve originals, hide duplicate accessibility content and offer pause',()=>{
 const jsx=s('components/home/Testimonials/Testimonials.tsx');
 assert.match(jsx,/aria-hidden="true" inert/);
 assert.match(jsx,/role="listitem"/);
 assert.match(jsx,/Pause reviews/);
 const css=s('components/home/Testimonials/testimonials-motion.module.css');
 for(const token of ['prefers-reduced-motion:reduce','animation:none','data-review-paused','animation-play-state:paused','reviews-run 36s linear infinite'])assert.ok(css.includes(token));
});
