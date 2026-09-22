import { articlesIndex } from "../generated/articles-index";

const FORM_URL = "https://docs.google.com/forms/d/1qQRrWDUPCOeXklfna912YEs1b2DqPHap3zZ0lpoyjZI/viewform";

// /articles/ 記事一覧ページ（articles/content/*.md から自動生成された一覧を表示）
export default function ArticlesIndexPage() {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="../" className="text-xl font-bold text-primary-700">HealthLegal</a>
          <a
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 bg-accent-500 text-white text-sm font-semibold rounded-lg hover:bg-accent-600 transition-colors"
          >
            お問い合わせ
          </a>
        </div>
      </header>

      <main>
        <section className="pt-16 pb-10 px-6 bg-gradient-to-b from-primary-50 to-white">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm font-semibold text-primary-700 mb-4">シリーズ: 規制の一次情報を読む</p>
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 leading-snug mb-6">解説記事一覧</h1>
            <p className="text-slate-700 leading-relaxed">
              医療・ヘルスケア事業の規制対応（3省2ガイドライン・医療機器該当性・薬事）について、
              法令・ガイドラインの一次情報を実際に読み込んだうえで解説しています。
            </p>
          </div>
        </section>

        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {articlesIndex.map((a) => (
              <a
                key={a.slug}
                href={`./${a.slug}/`}
                className="block rounded-xl border border-slate-200 bg-white p-6 sm:p-8 hover:border-primary-300 hover:shadow-md transition-all"
              >
                <p className="text-xs font-semibold text-primary-700 mb-2">{a.category}</p>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-3">{a.shortLabel}</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">{a.listDescription}</p>
                <p className="text-xs text-slate-500">公開: {a.dateLabel} ｜ Beyond HealthTech合同会社</p>
              </a>
            ))}
          </div>
        </section>

        <section className="pb-16 px-6">
          <div className="max-w-3xl mx-auto text-center text-sm text-slate-600 leading-relaxed">
            <p>
              3省2ガイドライン対応を体系的に進めたい方は{" "}
              <a href="../3m2g/" className="text-primary-600 underline hover:text-primary-700">
                3省2ガイドライン対応パッケージ
              </a>{" "}
              をご覧ください。
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
