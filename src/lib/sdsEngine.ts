// SDSギャップ診断の判定エンジン。bht-ops assets/sds-generator/check_rules.py の evaluate_row / run を忠実に移植したもの。
// 判定はブラウザ内だけで行い、回答はどこにも送信しない。
// 結果が Python 版と一致することは scripts/verify-sds-engine.mjs で検査する。
import type { SdsQuestion } from '../content/sds-questions'

export const UNKNOWN = 'わからない'
const RAISED = '対象外解除→要対応' // 出力上は「いいえ」に集計する

export type Bucket = 'はい' | 'はい（要件付き）' | '対象外' | 'いいえ' | '要確認'
export const BUCKETS: Bucket[] = ['はい', 'はい（要件付き）', '対象外', 'いいえ', '要確認']

export type SdsRule = {
  様式: string
  No: string
  設問要旨: string
  標準回答: string
  依存入力: string
  条件: string
  不成立時回答: string
  埋まる商品: string
}

export type Answers = Record<string, string | undefined>

export type ItemResult = {
  様式: string
  No: string
  設問要旨: string
  回答: string
  集計: Bucket
  埋まる商品: string
}

export type SdsResult = {
  counts: Record<Bucket, number>
  remaining: number
  items: ItemResult[]
  gaps: ItemResult[]
}

const PUBLIC_COLS = ['様式', 'No', '設問要旨', '標準回答', '依存入力', '条件', '不成立時回答', '埋まる商品'] as const

/** 検査スクリプト用: TSV（全列）から公開列だけの SdsRule[] を作る。ページは src/generated/sds-rules.json を使う */
export function parseRules(tsv: string): SdsRule[] {
  const lines = tsv.replace(/\r\n/g, '\n').split('\n').filter((l) => l.length > 0)
  const head = lines[0].split('\t')
  for (const c of PUBLIC_COLS) if (!head.includes(c)) throw new Error(`sds-rules.tsv に列「${c}」がありません`)
  return lines.slice(1).map((l) => {
    const cells = l.split('\t')
    return Object.fromEntries(PUBLIC_COLS.map((c) => [c, cells[head.indexOf(c)] ?? ''])) as SdsRule
  })
}

type Term = { qno: number; op: '=' | '≠' | '∈' | '∉'; vals: string[] }

function parseTerm(raw: string): Term {
  const term = raw.trim()
  if (!term.startsWith('#')) throw new Error(`term must start with #: ${term}`)
  for (const op of ['∈{', '∉{', '≠', '='] as const) {
    const idx = term.indexOf(op)
    if (idx >= 0) {
      const qno = parseInt(term.slice(1, idx), 10)
      const rest = term.slice(idx + op.length)
      if (op.endsWith('{')) {
        if (!rest.endsWith('}')) throw new Error(`unclosed set: ${term}`)
        return { qno, op: op[0] as '∈' | '∉', vals: rest.slice(0, -1).split(',').map((v) => v.trim()) }
      }
      return { qno, op: op as '=' | '≠', vals: [rest.trim()] }
    }
  }
  throw new Error(`no operator in term: ${term}`)
}

export function parseCond(cond: string): { conn: 'and' | 'or'; terms: Term[] } {
  const c = cond.trim()
  if (c.includes(' かつ ') && c.includes(' または ')) throw new Error(`かつ と または の混在: ${c}`)
  if (c.includes(' または ')) return { conn: 'or', terms: c.split(' または ').map(parseTerm) }
  return { conn: 'and', terms: c.split(' かつ ').map(parseTerm) }
}

function termTrue(t: Term, answers: Answers): boolean | null {
  const a = answers[String(t.qno)]
  if (a === undefined || a === UNKNOWN) return null
  if (t.op === '=' || t.op === '∈') return t.vals.includes(a)
  return !t.vals.includes(a)
}

function condTrue(cond: string, answers: Answers): boolean | null {
  const { conn, terms } = parseCond(cond)
  const rs = terms.map((t) => termTrue(t, answers))
  if (conn === 'and') {
    if (rs.some((r) => r === false)) return false
    return rs.every((r) => r === true) ? true : null
  }
  if (rs.some((r) => r === true)) return true
  return rs.every((r) => r === false) ? false : null
}

export function parseFail(fail: string): { clauses: [string, string][]; def: string } {
  const clauses: [string, string][] = []
  let def: string | null = null
  for (const raw of fail.split('／')) {
    const part = raw.trim()
    if (part.startsWith('#')) {
      const i = part.indexOf('→')
      clauses.push([part.slice(0, i).trim(), part.slice(i + 1).trim()])
    } else {
      if (def !== null) throw new Error(`既定値が2つ: ${fail}`)
      def = part
    }
  }
  if (def === null) throw new Error(`既定値なし: ${fail}`)
  return { clauses, def }
}

function evaluateRow(r: SdsRule, answers: Answers): string {
  const dep = r.依存入力.trim()
  if (dep === '-') return r.標準回答
  const deps = dep.split(',').map((x) => parseInt(x, 10))
  if (condTrue(r.条件, answers) === true) return r.標準回答
  const { clauses, def } = parseFail(r.不成立時回答)
  for (const [c, a] of clauses) {
    if (condTrue(c, answers) === true) return a
  }
  if (deps.some((d) => answers[String(d)] === undefined || answers[String(d)] === UNKNOWN)) return '要確認'
  return def
}

const bucket = (a: string): Bucket => (a === RAISED ? 'いいえ' : (a as Bucket))

export function evaluate(rules: SdsRule[], answers: Answers): SdsResult {
  const items: ItemResult[] = rules.map((r) => {
    const ans = evaluateRow(r, answers)
    return { 様式: r.様式, No: r.No, 設問要旨: r.設問要旨, 回答: ans, 集計: bucket(ans), 埋まる商品: r.埋まる商品 }
  })
  const counts = Object.fromEntries(BUCKETS.map((b) => [b, 0])) as Record<Bucket, number>
  for (const it of items) counts[it.集計] += 1
  const gaps = items.filter((x) => x.集計 === 'いいえ' || x.集計 === '要確認')
  return { counts, remaining: counts['いいえ'] + counts['要確認'], items, gaps }
}

/** 条件式で使われる選択肢ラベルを列挙する（設問データとの整合検査用） */
export function referencedLabels(rules: SdsRule[]): { qno: number; label: string; where: string }[] {
  const out: { qno: number; label: string; where: string }[] = []
  for (const r of rules) {
    if (r.依存入力.trim() === '-') continue
    const conds = [r.条件, ...parseFail(r.不成立時回答).clauses.map(([c]) => c)]
    for (const c of conds) {
      for (const t of parseCond(c).terms) for (const v of t.vals) out.push({ qno: t.qno, label: v, where: `${r.様式} ${r.No}` })
    }
  }
  return out
}

// ---- 診断コード: 26問の選択肢インデックスを1文字ずつ（'0'〜'4'、未回答は'x'）

export function encodeAnswers(questions: SdsQuestion[], answers: Answers): string {
  return questions
    .map((q) => {
      const i = q.options.indexOf(answers[String(q.id)] ?? '')
      return i >= 0 ? i.toString(36) : 'x'
    })
    .join('')
}

export function decodeAnswers(questions: SdsQuestion[], code: string): Answers | null {
  if (code.length !== questions.length) return null
  const out: Answers = {}
  for (let k = 0; k < questions.length; k++) {
    const ch = code[k]
    if (ch === 'x') continue
    const i = parseInt(ch, 36)
    const q = questions[k]
    if (Number.isNaN(i) || i >= q.options.length) return null
    out[String(q.id)] = q.options[i]
  }
  return out
}
