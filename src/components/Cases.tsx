// 支援実績（固有名は出さない。事実の出所: bht-ops docs/3m2g-lp-claims-evidence.md・university-startup-dev-partner.md）
const cases = [
  {
    tag: "医用画像 AI の SaaS",
    origin: "大学病院との共同研究から事業化",
    body: "3省2ガイドライン対応パッケージを適用し、416項目を10営業日で判定。JAHIS SDS Ver.5.0（160問）の開示書と規程類を整備しました。",
    role: "ガイドライン対応・設計",
  },
  {
    tag: "研究データ基盤",
    origin: "国立医科大学発スタートアップ",
    body: "医療機関・研究機関が利用する Web アプリを AWS 上に開発し、本番運用まで担当。認証と利用者管理を備えた構成で提供しています。",
    role: "開発・運用",
  },
  {
    tag: "医療技術の事業化",
    origin: "NEDO MPM 関連の支援",
    body: "アカデミア発の医療技術の事業化に向け、規制対応・知財・開発計画を助言しました。",
    role: "事業化アドバイザリー",
  },
];

export default function Cases() {
  return (
    <section id="cases" className="scroll-mt-20 py-24 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">支援実績</h2>
        <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
          医療・ヘルスケア領域で10件以上のプロダクトローンチに携わってきました。主な実績です。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((c) => (
            <div key={c.tag} className="flex flex-col bg-white rounded-xl p-7 border border-slate-200 shadow-sm">
              <p className="text-xs font-bold text-primary-700 mb-2">{c.origin}</p>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{c.tag}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">{c.body}</p>
              <p className="mt-auto pt-4 border-t border-slate-100 text-sm">
                <span className="text-slate-500 mr-2">役割</span>
                <span className="font-semibold text-slate-800">{c.role}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
