const FORM_URL = "https://docs.google.com/forms/d/1qQRrWDUPCOeXklfna912YEs1b2DqPHap3zZ0lpoyjZI/viewform";

const stats = [
  { number: "416 → 約50", label: "検討項目数", desc: "対象外172件は設計選択で消え、188件は標準回答で即答。個別検討は差分だけ" },
  { number: "41%", label: "設計の工夫で対象外にできる項目", desc: "当社のアーキテクチャ設計ノウハウにより、416項目のうち172件は対応自体を不要にできる" },
  { number: "66", label: "文書ひな形", desc: "規程・計画・SLA・手順31 ＋ セキュリティ設計書35。ゼロから書かない" },
];

const sources = [
  {
    title: "対応しない、を先に設計する",
    body: "全416項目のうち172件（41%）は、アーキテクチャ設計の工夫により対象外にできます。「頑張って対応する」前に「対応が要らない形を選ぶ」——どの設計選択がどの項目を不要にするかの対応表を当社は持っており、構成のご提案とセットで適用します。",
  },
  {
    title: "検討済みの標準回答416項目",
    body: "ガイドライン416項目のすべてに、当社標準のクラウド構成を前提とした対応方針を用意。法解釈だけでなく、CloudTrail・Cognito・WAF・GuardDutyなどAWSの設定レベルまで具体化されており、実装指示書としてそのまま使えます。ゼロからの検討が差分レビューに変わります。",
  },
  {
    title: "文書ひな形66ファイル",
    body: "運用管理規程・アクセス管理規定・DR計画・SLA・リリースフローなどの運用文書31ファイルと、IAM・ログ監査・監視・ネットワーク・ストレージのセキュリティ設計書35ファイル。規程は「ガイドライン要件ID → 要求 → 対応条文」の構造で、どの条文がどの要件を満たすか追えます。",
  },
  {
    title: "監査に耐えるトレーサビリティ",
    body: "ガイドライン要件 → 対応方針 → 規程条文 → AWS設定までが一本の線で繋がります。医療機関からの照会や監査への回答が速く、担当者が変わっても判断根拠が失われません。",
  },
];

const deliverables = [
  "対策項目マスタ（416項目・関連要求事項199件の構造化データ）",
  "標準回答集（当社標準のクラウド構成前提・対象外判断の根拠つき）",
  "対応検討シート（貴社プロダクト向けにカスタマイズ）",
  "運用文書一式（規程・計画・SLA・手順 31ファイル）",
  "セキュリティ設計書一式（IAM・ログ監査・監視・NW・ストレージ 35ファイル）",
  "サービス仕様適合開示書・サービス仕様書のひな形",
];

const steps = [
  { step: "1", title: "ヒアリング", duration: "2〜3日", body: "プロダクト特性・データフロー・提供形態を確認し、標準回答との差分を特定します。" },
  { step: "2", title: "構成提案 ＋ 差分検討", duration: "1〜2週間", body: "当社標準のクラウド構成の設計提案とセットで、個別検討が必要な項目（50件前後）だけをレビューします。" },
  { step: "3", title: "文書一式の納品", duration: "1〜2週間", body: "検討シート・運用文書・設計書を貴社向けにカスタマイズして納品。医療機関への開示文書まで揃います。" },
];

export default function ThreeM2GPage() {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="../" className="text-xl font-bold text-primary-700">HealthLegal</a>
          <a
            href="#contact"
            className="px-5 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            無料相談
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="py-24 px-6 bg-gradient-to-b from-primary-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <p className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-100 border border-primary-200 text-primary-800 rounded-full text-base sm:text-lg font-bold mb-8">
              <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              3省2ガイドライン対応パッケージ
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 leading-tight mb-6">
              数ヶ月規模の対応を、
              <br />
              数週間規模に。
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              医療・ヘルスケアプロダクトの法令対応・セキュリティ構築の実務で磨いた、
              法的・技術的ベストプラクティスの一式。416項目をゼロから検討する代わりに、
              検証済みの標準回答からの差分レビューで、最短・高品質に対応します。
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 text-white text-lg font-semibold rounded-lg hover:bg-accent-600 transition-colors shadow-lg shadow-accent-500/25"
            >
              無料相談を予約する
            </a>
          </div>
        </section>

        {/* 数字 */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="bg-slate-50 rounded-xl p-8 text-center border border-slate-200">
                  <p className="text-3xl font-bold text-primary-600 mb-2">{s.number}</p>
                  <p className="text-sm font-bold text-slate-900 mb-3">{s.label}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
            {/* 紙の対応で終わらない、が典型的コンサルとの差別化。範囲の詳細は商談で扱う */}
            <p className="mt-8 text-center text-slate-700 leading-relaxed">
              <strong className="font-semibold text-slate-900">AWSで構築するプロダクトなら、法令対応文書からセキュリティ設計書・AWS設定まで、実装につながる形でワンセット。</strong>
              <span className="text-slate-500">紙の対応で終わらせません。</span>
            </p>
          </div>
        </section>

        {/* 課題 */}
        <section className="py-24 px-6 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">
              3省2ガイドライン対応が重い理由
            </h2>
            <div className="space-y-4 text-slate-700 leading-relaxed">
              <p>
                医療情報を取り扱うシステム・サービスの提供事業者には、厚労省・経産省・総務省の
                3文書（あわせて数百ページ）への対応が求められ、対策項目は416項目にのぼります。
              </p>
              <p>
                自力で対応する場合、ガイドラインの読解と項目整理だけで数週間、全項目の該当性判断と
                対応方針の検討に数ヶ月、さらに規程・手順・設計書の整備が続きます。医療情報セキュリティに
                知見のある人材の確保も難しく、<strong className="font-semibold text-slate-900">体制を組成して
                対応した場合の総コストは数百万〜1,000万円規模・期間4〜6ヶ月</strong>になるのが実情です
                <span className="text-sm text-slate-500">（自社試算。体制・単価の前提はご相談時にご提示します）</span>。
              </p>
              <p>
                さらに、対象外にできる項目を知らずに全項目対応してしまう過剰投資や、
                判断根拠が担当者の頭にしか残らない属人化が、後の監査・引き継ぎで効いてきます。
              </p>
            </div>
          </div>
        </section>

        {/* 仕組み */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-14">
              なぜ数週間規模にできるのか
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sources.map((s, i) => (
                <div key={s.title} className="bg-slate-50 rounded-xl p-8 border border-slate-200">
                  <p className="text-primary-600 font-bold text-sm mb-2">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{s.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 実績 */}
        <section className="py-24 px-6 bg-primary-950">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">机上のテンプレートではなく、実対応で検証済み</h2>
            <p className="text-primary-200 leading-relaxed max-w-2xl mx-auto">
              本パッケージの標準回答とフレームワークは実際の3省2ガイドライン対応で運用され、
              <strong className="text-white font-semibold">416項目すべての該当性判断・対応方針の記入を、
              担当1名＋レビュー1名の体制・営業日10日で完了</strong>した実績があります。
              医療機器プログラム（SaMD）から非医療機器のヘルスケアサービスまで、
              複数プロダクトの開発・法令対応で蓄積した判断とAWS実装の型を反映しています。
            </p>
          </div>
        </section>

        {/* 提供物 */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">提供物</h2>
            <ul className="space-y-3">
              {deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3 bg-slate-50 rounded-lg px-5 py-4 border border-slate-200">
                  <svg className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span className="text-slate-700 text-sm leading-relaxed">{d}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-500 text-center mt-8">
              ※ 当社が提案するクラウド構成（AWS）の採用が前提です。
              既存構成が異なる場合もヒアリングのうえ適用範囲をご提示します。
            </p>
          </div>
        </section>

        {/* 進め方 */}
        <section className="py-24 px-6 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-14">進め方</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((s) => (
                <div key={s.step} className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold mb-4">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{s.title}</h3>
                  <p className="text-primary-600 text-sm font-semibold mb-3">{s.duration}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500 text-center mt-8">
              費用はプロダクトの規模・状況により異なります。まずは無料相談でお見積りをご提示します。
            </p>
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="py-24 px-6 bg-slate-900">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              まずは対応範囲の目安から
            </h2>
            <p className="text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
              貴社プロダクトの概要をお聞かせいただければ、416項目のうちどこまでが
              設計選択で対象外にでき、個別検討がどの程度残るか、初回相談（無料）で目安をご提示します。
            </p>
            <a
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 text-white text-lg font-semibold rounded-lg hover:bg-accent-600 transition-colors shadow-lg shadow-accent-500/25"
            >
              無料相談を予約する
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
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
