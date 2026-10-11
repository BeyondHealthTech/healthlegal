import type { ArticleData } from "../lib/article-types";
import { articlesIndex } from "../generated/articles-index";

const FORM_URL = "https://docs.google.com/forms/d/1qQRrWDUPCOeXklfna912YEs1b2DqPHap3zZ0lpoyjZI/viewform";
const CHECKLIST_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfRcNrFAcwA-hmd_8t5xSIGtELD30m6USsmDf33HDyMgP79WQ/viewform";
const BOARD_URL = "https://bht-recruitment.vercel.app/";

// 記事ページ共通の器（旧 Article*Page.tsx を1コンポーネントに集約。
// タイトル・3行まとめ・本文・出典・関連記事・CTA文言は articles/content/<slug>.md から供給される）
const h2Class = "text-2xl sm:text-3xl font-bold text-slate-900 mt-14 mb-5 leading-snug";

export default function ArticlePage({ article }: { article: ArticleData }) {
  const related = article.related
    .map((slug) => articlesIndex.find((a) => a.slug === slug))
    .filter((a) => a !== undefined);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="../../" className="text-xl font-bold text-primary-700">HealthLegal</a>
          <div className="flex items-center gap-5">
            <a href="../" className="text-sm font-semibold text-slate-600 hover:text-primary-700 transition-colors">
              記事一覧
            </a>
            <a
              href="#contact"
              className="px-5 py-2 bg-accent-500 text-white text-sm font-semibold rounded-lg hover:bg-accent-600 transition-colors"
            >
              お問い合わせ
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* タイトル */}
        <section className="pt-16 pb-10 px-6 bg-gradient-to-b from-primary-50 to-white">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm font-semibold text-primary-700 mb-4">{article.category}</p>
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 leading-snug sm:leading-snug mb-6">
              {article.title}
              <span className="block text-lg sm:text-2xl text-slate-700 mt-3">{article.subtitle}</span>
            </h1>
            <p className="text-sm text-slate-500">
              公開: {article.dateLabel} ｜ 執筆: Beyond HealthTech合同会社 ｜ {article.bylineNote}
            </p>
          </div>
        </section>

        <article className="py-12 px-6">
          <div className="max-w-3xl mx-auto">
            {/* 3行まとめ */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10">
              <h2 className="text-lg font-bold text-slate-900 mb-4">3行まとめ</h2>
              <ul className="space-y-3 text-slate-700 leading-relaxed text-[15px]">
                {article.summaryHtml.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-primary-600 font-bold shrink-0">{`${i + 1}.`}</span>
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            </div>

            {/* 本文（Markdownから生成） */}
            <div dangerouslySetInnerHTML={{ __html: article.bodyHtml }} />

            {/* 出典 */}
            <h2 className={h2Class}>出典（一次資料）</h2>
            <ul className="space-y-2 mb-5 text-sm">
              {article.sources.map((s) => (
                <li key={s.title} className="text-slate-600 leading-relaxed">
                  {s.title}
                  {s.url && (
                    <>
                      <br />
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline break-all">
                        {s.url}
                      </a>
                    </>
                  )}
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-500 mb-2">{article.sourcesNote}</p>

            {/* 関連記事 */}
            {related.length > 0 && (
              <>
                <h2 className={h2Class}>関連記事（シリーズ: 規制の一次情報を読む）</h2>
                <ul className="space-y-2 mb-5">
                  {related.map((a) => (
                    <li key={a.slug} className="text-slate-700 leading-relaxed">
                      <a href={`../${a.slug}/`} className="text-primary-600 hover:text-primary-700 underline">
                        {a.shortLabel}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </article>

        {/* CTA */}
        <section id="contact" className="py-20 px-6 bg-slate-900">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{article.cta.heading}</h2>
            <p className="text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">{article.cta.body}</p>
            <a
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 text-white text-lg font-semibold rounded-lg hover:bg-accent-600 transition-colors shadow-lg shadow-accent-500/25"
            >
              お問い合わせフォームを開く
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>

            <div className="mt-10 rounded-xl border border-slate-700 bg-slate-800/60 px-6 py-6 text-left max-w-xl mx-auto">
              <p className="text-accent-400 text-sm font-semibold mb-1">無料セルフチェック</p>
              <p className="text-white font-bold mb-2">3省2ガイドライン セルフチェック（27問・約8分）</p>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                到達率と重点項目を自動判定し、全27問のワンポイント解説つきPDF（A4・12ページ）を診断結果メールでお送りします。
              </p>
              <a
                href={CHECKLIST_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-accent-400 font-semibold hover:text-accent-300 transition-colors"
              >
                セルフチェックを始める
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
            {article.cta.showBoard && (
              <p className="text-slate-400 text-sm mt-8">
                事業化を進める人材（薬事・開発・事業開発）をお探しの場合は、医療・ヘルスケア領域特化のマッチングボード{" "}
                <a href={BOARD_URL} target="_blank" rel="noopener noreferrer" className="text-slate-200 underline hover:text-white">
                  Healthcare Startup Board
                </a>{" "}
                をご利用いただけます。法人化前のシーズ段階からご相談いただけます。
              </p>
            )}
            <p className={`text-slate-400 text-sm ${article.cta.showBoard ? "mt-4" : "mt-8"}`}>
              3省2ガイドライン対応を体系的に進めたい方は{" "}
              <a href="../../3m2g/" className="text-slate-200 underline hover:text-white">
                3省2ガイドライン対応パッケージ
              </a>{" "}
              もご覧ください。
            </p>
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 bg-slate-950">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Beyond HealthTech合同会社
          </p>
        </div>
      </footer>
    </>
  );
}
