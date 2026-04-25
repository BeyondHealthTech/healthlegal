const problems = [
  {
    title: "複雑なガイドライン体系",
    description:
      "厚労省・総務省・経産省の3省2ガイドラインは、医療情報を扱うすべてのシステムに適用されます。その要件は多岐にわたり、正確な理解と対応が求められます。",
  },
  {
    title: "頻繁な改定への追従",
    description:
      "ガイドラインは定期的に改定され、最新版への対応が常に必要です。改定内容の把握と既存システムへの反映は、開発チームにとって大きな負担となります。",
  },
  {
    title: "技術要件の高度化",
    description:
      "暗号化・アクセス制御・監査ログなど、求められるセキュリティ要件は年々高度化しています。ガイドラインが求める技術水準を満たすには、専門的な知見が不可欠です。",
  },
];

export default function Problem() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">
          医療情報を扱うサービスに立ちはだかる壁
        </h2>
        <p className="text-slate-600 text-center mb-14 max-w-2xl mx-auto">
          医療情報ガイドラインへの対応は、多くの企業にとって大きな課題です
        </p>
        <div className="space-y-6">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="border-l-4 border-primary-500 bg-slate-50 rounded-r-lg p-6"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {problem.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
