// 記事データの型定義。
// articles/content/<slug>.md の frontmatter + 本文から
// scripts/generate-articles.mjs が src/generated/ 配下のモジュールを生成する。

export interface ArticleSource {
  title: string
  url?: string
}

export interface ArticleCta {
  /** CTAセクションの見出し */
  heading: string
  /** CTAセクションのリード文 */
  body: string
  /** Healthcare Startup Board への導線段落を出すか */
  showBoard?: boolean
}

export interface ArticleMeta {
  slug: string
  /** タイトル上のカテゴリ表示（例: 解説記事 ｜ 3省2ガイドライン） */
  category: string
  /** h1 のメインタイトル */
  title: string
  /** h1 のサブタイトル（「— 」始まり） */
  subtitle: string
  /** 関連記事リスト・一覧ページで使う表示ラベル */
  shortLabel: string
  /** 公開表示（例: 2026年8月） */
  dateLabel: string
  /** タイトル下のバイライン注記（例: 一次資料（…）に基づき作成） */
  bylineNote: string
  /** 一覧ページのカードに出す説明文 */
  listDescription: string
  /** JSON-LD の datePublished */
  datePublished: string
  /** JSON-LD の dateModified */
  dateModified: string
}

export interface ArticleData extends ArticleMeta {
  /** 3行まとめ（各項目はインラインHTML） */
  summaryHtml: string[]
  /** 記事本文（Markdownから生成したHTML） */
  bodyHtml: string
  sources: ArticleSource[]
  /** 出典セクション末尾の注意書き */
  sourcesNote: string
  /** 関連記事のslugリスト */
  related: string[]
  cta: ArticleCta
}
