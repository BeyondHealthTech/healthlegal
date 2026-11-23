// 数字は /3m2g/ の料金表・アセット件数と一致させる（最短5営業日・40万円＝S1、416項目、文書・設計書70点）
const facts = [
  { value: "416項目", label: "標準回答を整備済み" },
  { value: "最短5営業日", label: "SDS 回答草案の提供" },
  { value: "40万円から", label: "料金表を公開" },
];

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-primary-600 font-semibold text-sm tracking-wide mb-4">
          Legal × Tech × Healthcare
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
          医療情報ガイドライン対応を、
          <br />
          技術で解決する
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
          3省2ガイドラインの標準回答、規程・設計書のひな形、認証と監査ログを実装した土台。
          医療機関のセキュリティ審査への対応を、文書から実装まで一貫して支援します。
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#contact"
            className="inline-block px-8 py-4 bg-accent-500 text-white text-lg font-semibold rounded-lg hover:bg-accent-600 transition-colors shadow-lg shadow-accent-500/25"
          >
            まずは相談する
          </a>
          <a
            href="./3m2g/"
            className="inline-block px-6 py-4 border border-primary-300 bg-white text-primary-700 text-base font-semibold rounded-lg hover:bg-primary-50 transition-colors"
          >
            対応パッケージと料金を見る
          </a>
        </div>
        <dl className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {facts.map((f) => (
            <div key={f.label} className="bg-white rounded-xl border border-slate-200 px-5 py-4">
              <dd className="text-2xl font-bold text-primary-700">{f.value}</dd>
              <dt className="text-sm text-slate-600 mt-1">{f.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
