// SDSギャップ診断: ルール表（data/sds-rules.tsv）と設問データ（src/content/sds-questions.ts）の整合検査。
// 条件式が参照する選択肢ラベルが設問の選択肢に実在しない／行数・様式数が違う場合はビルドを止める。
import { build } from 'esbuild'
import { readFileSync, rmSync, mkdtempSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'

export async function loadSdsModules() {
  const dir = mkdtempSync(join(tmpdir(), 'sds-'))
  const out = join(dir, 'bundle.mjs')
  await build({
    stdin: {
      contents: `export * from './src/lib/sdsEngine.ts'; export * from './src/content/sds-questions.ts'`,
      resolveDir: process.cwd(),
      loader: 'ts',
    },
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile: out,
    logLevel: 'error',
  })
  const mod = await import(pathToFileURL(out).href)
  rmSync(dir, { recursive: true, force: true })
  return mod
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const m = await loadSdsModules()
  const rules = m.parseRules(readFileSync('data/sds-rules.tsv', 'utf8'))
  const errors = []
  if (rules.length !== 99) errors.push(`行数 ${rules.length}（99 必要）`)
  const mds = rules.filter((r) => r.様式 === 'MDS').length
  const sds = rules.filter((r) => r.様式 === 'SDS').length
  if (mds !== 41 || sds !== 58) errors.push(`MDS ${mds} / SDS ${sds}（41 / 58 必要）`)
  const byId = Object.fromEntries(m.SDS_QUESTIONS.map((q) => [q.id, q]))
  for (const { qno, label, where } of m.referencedLabels(rules)) {
    const q = byId[qno]
    if (!q) errors.push(`${where}: 設問 #${qno} が存在しない`)
    else if (!q.options.includes(label)) errors.push(`${where}: #${qno} の選択肢に「${label}」がない`)
  }
  if (errors.length) {
    console.error('SDSルール表の整合検査NG:\n' + errors.map((e) => '  - ' + e).join('\n'))
    process.exit(1)
  }
  console.log(`SDSルール表の整合検査OK: ${rules.length}行・設問${m.SDS_QUESTIONS.length}問`)
}
