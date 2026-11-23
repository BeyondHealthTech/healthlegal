// 状況別の入口（一般論の課題提示に代えて、来訪のきっかけ別に行き先を示す）。
// 価格・納期は /3m2g/ の料金表（S1）と一致させる。
const entries = [
  {
    tag: "提出を求められている",
    title: "医療機関から SDS・チェックシートの提出を求められた",
    body: "貴社構成での回答草案とギャップ一覧を、最短5営業日で提供します。40万円から。",
    href: "./3m2g/#pricing",
    link: "SDS 回答パックを見る",
  },
  {
    tag: "これから開発する",
    title: "医療機関向けの製品を新たに開発する",
    body: "認証・権限・監査ログを実装した基盤と設計書一式を提供。業務機能の開発に専念できます。",
    href: "./3m2g/#feature-map",
    link: "基盤の機能構成を見る",
  },
  {
    tag: "研究成果を事業化する",
    title: "大学・研究機関の成果を医療サービスにする",
    body: "医療機器該当性の整理から、ガイドライン対応を前提にした開発までを支援します。",
    href: "./articles/academic-seed-regulatory/",
    link: "事業化の規制対応を読む",
  },
];

export default function Problem() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">
          状況に応じた入口
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {entries.map((e) => (
            <a
              key={e.title}
              href={e.href}
              className="group flex flex-col bg-slate-50 rounded-xl p-7 border border-slate-200 hover:border-primary-400 hover:shadow-md transition-all"
            >
              <p className="self-start text-xs font-bold text-primary-700 bg-primary-100 px-2.5 py-1 rounded-full mb-4">{e.tag}</p>
              <h3 className="text-lg font-bold text-slate-900 leading-snug mb-3">{e.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">{e.body}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary-700 group-hover:gap-2 transition-all">
                {e.link}
                <span aria-hidden="true">→</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
