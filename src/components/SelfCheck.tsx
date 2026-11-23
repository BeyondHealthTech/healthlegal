const CHECKLIST_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfRcNrFAcwA-hmd_8t5xSIGtELD30m6USsmDf33HDyMgP79WQ/viewform";

// 無料診断3種（事業者向け2・医療機関向け1）
const checks = [
  {
    target: "事業者向け",
    title: "SDS ギャップ診断",
    time: "約3分",
    body: "医療機関の確認事項99項目に、現状の構成でどこまで「はい／対象外」と回答できるかを判定。入力内容は送信されません。",
    href: "./sds-check/",
    external: false,
    link: "診断を始める",
  },
  {
    target: "事業者向け",
    title: "3省2ガイドライン セルフチェック",
    time: "27問・約8分",
    body: "到達率と重点項目を判定し、全27問の解説つき PDF（A4・12ページ）をメールで送付します。",
    href: CHECKLIST_FORM_URL,
    external: true,
    link: "セルフチェックを始める",
  },
  {
    target: "医療機関・薬局向け",
    title: "厚労省チェックリストの自己点検",
    time: "令和8年度版・19項目",
    body: "「はい」になっていない項目ごとに、立入検査での見られ方と具体策、ガイドラインの参照箇所を表示します。",
    href: "./clinic-check/",
    external: false,
    link: "自己点検を始める",
  },
];

export default function SelfCheck() {
  return (
    <section id="check" className="scroll-mt-20 py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">無料診断</h2>
        <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
          現状把握に使える3種類の診断を公開しています。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {checks.map((c) => (
            <a
              key={c.title}
              href={c.href}
              {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex flex-col bg-white rounded-xl p-7 border border-accent-300 hover:shadow-md transition-shadow"
            >
              <p className="text-xs font-bold text-accent-600 mb-2">{c.target}</p>
              <h3 className="text-lg font-bold text-slate-900 leading-snug mb-1">{c.title}</h3>
              <p className="text-sm font-semibold text-primary-600 mb-3">{c.time}</p>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">{c.body}</p>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary-700 group-hover:gap-2 transition-all">
                {c.link}
                <span aria-hidden="true">→</span>
              </span>
            </a>
          ))}
        </div>
        <p className="mt-6 text-xs text-slate-500 text-center">
          回答内容の取り扱いは{" "}
          <a href="./privacy/" className="underline underline-offset-2 hover:text-slate-700">プライバシーポリシー</a>
          {" "}をご覧ください。
        </p>
      </div>
    </section>
  );
}
