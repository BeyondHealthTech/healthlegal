const CHECKLIST_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfRcNrFAcwA-hmd_8t5xSIGtELD30m6USsmDf33HDyMgP79WQ/viewform";

const points = [
  "設問は厚労省「医療情報システムの安全管理に関するガイドライン 第7.0版」等の要求事項から、実務目線で27問を厳選",
  "回答すると到達率と重点項目を自動判定し、診断結果をその場でメールでお届け",
  "診断結果の自動返信で、全27問のワンポイント解説つきPDF（A4・12ページ）をお送りします",
];

export default function SelfCheck() {
  return (
    <section id="selfcheck" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-2xl border-2 border-accent-500/40 bg-slate-50 px-8 py-12 sm:px-12">
          <p className="text-accent-600 text-sm font-semibold mb-2 text-center">
            無料セルフチェック
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">
            3省2ガイドライン セルフチェック（27問）
          </h2>
          <p className="text-slate-600 text-center mb-8 max-w-2xl mx-auto">
            医療情報を扱うサービスの安全管理体制を、27問・約8分で自己診断できます。
          </p>
          <ul className="space-y-3 max-w-2xl mx-auto mb-10">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-2 text-slate-700">
                <svg className="w-5 h-5 text-accent-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <div className="text-center">
            <a
              href={CHECKLIST_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 text-white text-lg font-semibold rounded-lg hover:bg-accent-600 transition-colors shadow-lg shadow-accent-500/25"
            >
              セルフチェックを始める（無料）
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
            <p className="text-slate-500 text-sm mt-6">
              回答内容の取り扱いについては{" "}
              <a href="./privacy/" className="underline hover:text-slate-700">
                プライバシーポリシー
              </a>{" "}
              をご覧ください。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
