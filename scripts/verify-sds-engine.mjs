// SDSギャップ診断: TS エンジンの判定が bht-ops の Python 版（check_rules.py）と一致するかを検査する（手動実行用）。
//   node scripts/verify-sds-engine.mjs [path/to/check_rules.py]
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { loadSdsModules } from './check-sds-rules.mjs'

const py = process.argv[2] ?? '../ops/assets/sds-generator/check_rules.py'
const m = await loadSdsModules()
const rules = m.parseRules(readFileSync('data/sds-rules.tsv', 'utf8'))
const qs = m.SDS_QUESTIONS

function rng(seed) {
  let s = seed
  return () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648)
}
const cases = [
  ['all-yes', Object.fromEntries(qs.map((q) => [String(q.id), q.options[0]])), ['--all-yes']],
  ['all-unknown', Object.fromEntries(qs.map((q) => [String(q.id), 'わからない'])), ['--all-unknown']],
]
const dir = mkdtempSync(join(tmpdir(), 'sdsv-'))
for (const seed of [1, 7, 42, 2026, 31337]) {
  const r = rng(seed)
  const ans = Object.fromEntries(qs.map((q) => [String(q.id), q.options[Math.floor(r() * q.options.length)]]))
  const f = join(dir, `in-${seed}.json`)
  writeFileSync(f, JSON.stringify(ans))
  cases.push([`random-${seed}`, ans, ['--input', f]])
}
let ok = true
for (const [name, ans, args] of cases) {
  const raw = execFileSync('python3', ['-I', py, ...args, '--json'], { encoding: 'utf8' })
  const pyOut = JSON.parse(raw.slice(raw.indexOf('{')))
  const ts = m.evaluate(rules, ans)
  const mism = pyOut.results.filter((p, i) => p['回答'] !== ts.items[i].回答)
  const same = JSON.stringify(pyOut.counts) === JSON.stringify(ts.counts) && mism.length === 0
  ok &&= same
  console.log(`${same ? 'MATCH   ' : 'MISMATCH'} ${name}: ${JSON.stringify(ts.counts)}${mism.length ? ` 不一致${mism.length}件` : ''}`)
}
process.exit(ok ? 0 : 1)
