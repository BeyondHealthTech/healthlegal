// SDSギャップ診断: data/sds-rules.tsv（bht-ops assets/sds-generator/sds-rules.tsv の写し）から、
// ブラウザに同梱してよい列だけを抜いた src/generated/sds-rules.json を作る。
// 「ギャップ文」（埋め方）と「根拠メモ」は S1 SDS回答パックの納品物なので、ページのソースに載せない。
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const PUBLIC_COLS = ['様式', 'No', '設問要旨', '標準回答', '依存入力', '条件', '不成立時回答', '埋まる商品']
const lines = readFileSync('data/sds-rules.tsv', 'utf8').replace(/\r\n/g, '\n').split('\n').filter(Boolean)
const head = lines[0].split('\t')
const rows = lines.slice(1).map((l) => {
  const cells = l.split('\t')
  return Object.fromEntries(PUBLIC_COLS.map((c) => [c, cells[head.indexOf(c)] ?? '']))
})
mkdirSync('src/generated', { recursive: true })
writeFileSync('src/generated/sds-rules.json', JSON.stringify(rows))
console.log(`generated: src/generated/sds-rules.json (${rows.length} rows, 公開列のみ)`)
