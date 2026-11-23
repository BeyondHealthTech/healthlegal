import { articlesIndex } from "../generated/articles-index";

// 解説記事の新着3本（articles/content/*.md から生成される一覧の先頭）
export default function Articles() {
  const latest = articlesIndex.slice(0, 3);
  return (
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">解説記事</h2>
        <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
          法令・ガイドラインの一次情報に基づく解説を公開しています。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latest.map((a) => (
            <a
              key={a.slug}
              href={`./articles/${a.slug}/`}
              className="flex flex-col bg-white rounded-xl p-7 border border-slate-200 hover:border-primary-400 hover:shadow-md transition-all"
            >
              <p className="text-xs font-semibold text-primary-700 mb-3">{a.category}</p>
              <h3 className="font-bold text-slate-900 leading-snug mb-3">{a.title}</h3>
              <p className="mt-auto text-xs text-slate-500">{a.dateLabel}</p>
            </a>
          ))}
        </div>
        <p className="mt-8 text-center">
          <a href="./articles/" className="text-sm font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-800">
            記事一覧（全{articlesIndex.length}本）
          </a>
        </p>
      </div>
    </section>
  );
}
