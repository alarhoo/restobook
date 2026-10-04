import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const required = [
  'README.md', 'AGENTS.md', 'docs/README.md',
  'docs/product/product-brief.md', 'docs/product/fdd.md',
  'docs/product/state-machines.md', 'docs/product/screens.md',
  'docs/product/ux-rules.md', 'docs/architecture/system-design.md',
  'docs/architecture/data-model.md', 'docs/architecture/security.md',
  'docs/architecture/api-contracts.md', 'docs/engineering/standards.md',
  'docs/engineering/delivery.md', 'docs/delivery/implementation-plan.md',
  'docs/delivery/backlog.md', 'docs/delivery/acceptance.md',
  'docs/delivery/status.md', 'docs/adr/README.md',
  'docs/adr/0001-tenancy-and-boundaries.md',
  'docs/adr/0002-stack-and-deployment.md',
  'docs/adr/0003-guest-and-payment-scope.md',
  '.github/pull_request_template.md', '.github/workflows/foundation-check.yml',
];
const errors = [];
for (const path of required) {
  const full = resolve(root, path);
  if (!existsSync(full) || !statSync(full).isFile()) errors.push(`Missing: ${path}`);
  else if (!readFileSync(full, 'utf8').trim()) errors.push(`Empty: ${path}`);
}
function collect(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (['.git', 'node_modules', '.nx', 'dist'].includes(entry.name)) return [];
    const full = resolve(dir, entry.name);
    return entry.isDirectory() ? collect(full) : entry.name.endsWith('.md') ? [full] : [];
  });
}
const markdown = collect(root);
for (const file of markdown) {
  const raw = readFileSync(file, 'utf8');
  if (!raw.endsWith('\n')) errors.push(`Missing final newline: ${relative(root, file)}`);
  const fences = raw.match(/^```/gm) ?? [];
  if (fences.length % 2) errors.push(`Unbalanced code fences: ${relative(root, file)}`);
  const prose = raw.replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, '');
  for (const match of prose.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1].split('#')[0];
    if (!target || /^[a-z]+:/i.test(target)) continue;
    const full = resolve(dirname(file), target);
    if (!full.startsWith(`${root}/`) || !existsSync(full)) {
      errors.push(`Broken local link: ${relative(root, file)} -> ${target}`);
    }
  }
}
function content(path) {
  return existsSync(resolve(root, path)) ? readFileSync(resolve(root, path), 'utf8') : '';
}
const screens = content('docs/product/screens.md');
const screenIds = [...screens.matchAll(/^\| ([GRAP]\d{2}) \|/gm)].map(match => match[1]);
const expectedScreens = [
  ...Array.from({length: 9}, (_, i) => `G${String(i + 1).padStart(2, '0')}`),
  ...Array.from({length: 12}, (_, i) => `R${String(i + 1).padStart(2, '0')}`),
  ...Array.from({length: 15}, (_, i) => `A${String(i + 1).padStart(2, '0')}`),
  ...Array.from({length: 5}, (_, i) => `P${String(i + 1).padStart(2, '0')}`),
];
if (screenIds.length !== new Set(screenIds).size) errors.push('Duplicate screen IDs');
for (const id of expectedScreens) if (!screenIds.includes(id)) errors.push(`Missing screen: ${id}`);
const acceptance = content('docs/delivery/acceptance.md');
const backlog = content('docs/delivery/backlog.md');
const acceptanceIds = new Set([...acceptance.matchAll(/^\| (AC-\d{2}) \|/gm)].map(match => match[1]));
for (const match of backlog.matchAll(/AC-\d{2}/g)) {
  if (!acceptanceIds.has(match[0])) errors.push(`Undefined acceptance reference: ${match[0]}`);
}
for (let n = 1; n <= 15; n++) {
  const id = `AC-${String(n).padStart(2, '0')}`;
  if (!acceptanceIds.has(id)) errors.push(`Missing acceptance scenario: ${id}`);
}
for (let n = 0; n <= 8; n++) {
  if (!content('docs/delivery/implementation-plan.md').includes(`M${n} —`)) errors.push(`Missing milestone: M${n}`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Foundation checks passed: ${markdown.length} Markdown files, ${screenIds.length} screens, ${acceptanceIds.size} acceptance scenarios, M0–M8.`);
  console.log('Checks cover presence, local links, fences, and catalogue references; application behavior and Mermaid rendering are not validated.');
}
