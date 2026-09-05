const FORM_URL = "https://docs.google.com/forms/d/1qQRrWDUPCOeXklfna912YEs1b2DqPHap3zZ0lpoyjZI/viewform";
const CHECKLIST_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfRcNrFAcwA-hmd_8t5xSIGtELD30m6USsmDf33HDyMgP79WQ/viewform";
const BOARD_URL = "https://bht-recruitment.vercel.app/";

// 記事ページ共通のスタイル（ArticleGl70Page と同じ器）
const h2Class = "text-2xl sm:text-3xl font-bold text-slate-900 mt-14 mb-5 leading-snug";
const pClass = "text-slate-700 leading-relaxed mb-5";
const quoteClass = "border-l-4 border-primary-300 bg-primary-50/60 px-5 py-4 rounded-r-lg text-slate-700 leading-relaxed mb-5 text-[15px]";
const thClass = "text-left font-semibold px-4 py-3 border-b border-slate-200";
const tdClass = "px-4 py-3 border-b border-slate-100 text-slate-700";

const licenseRows = [
  { cls: "高度管理医療機器（クラスⅢ・Ⅳ）", license: "第一種医療機器製造販売業許可" },
  { cls: "管理医療機器（クラスⅡ）", license: "第二種医療機器製造販売業許可" },
  { cls: "一般医療機器（クラスⅠ）", license: "第三種医療機器製造販売業許可" },
];

const structureRows = [
  { topic: "① 該当性", research: "倫理審査・研究としての位置づけ", business: "表示・広告から認定される「使用目的」" },
  { topic: "② 主体", research: "研究室・研究代表者", business: "業許可を持つ製造販売業者（体制要件）" },
  { topic: "③ データ", research: "研究計画書と同意の範囲", business: "商用利用の同意・事業者としての個情法対応・3省2ガイドライン" },
];

const sourceLinks = [
  {
    title:
      "医薬品医療機器等法（昭和35年法律第145号）第23条の2（製造販売業の許可・許可種類の表）・第23条の2の2（許可の基準: 品質管理体制・製造販売後安全管理体制の省令基準適合）・医療機器等総括製造販売責任者の規定（e-Gov法令検索）",
    url: "https://laws.e-gov.go.jp/law/335AC0000000145",
  },
  {
    title:
      "厚生労働省医薬・生活衛生局監視指導・麻薬対策課／医療機器審査管理課「プログラムの医療機器該当性に関するガイドライン」（令和3年3月31日、令和5年3月31日一部改正）— PMDA掲載PDF",
    url: "https://www.pmda.go.jp/files/000240233.pdf",
  },
  {
    title:
      "厚生労働省「医療機器プログラムについて」（該当性判断事例〔令和5年3月31日〕・事例データベース〔令和7年7月3日更新〕・医療機器プログラム総合相談の案内）",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000179749_00004.html",
  },
  {
    title:
      "「人を対象とする生命科学・医学系研究に関する倫理指針」（令和3年3月23日制定・令和6年4月1日最新改正）— 厚生労働省「研究に関する指針について」",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/hokabunya/kenkyujigyou/i-kenkyu/index.html",
  },
  {
    title:
      "厚生労働省「医療情報システムの安全管理に関するガイドライン 第7.0版」（2026年6月公表）／総務省・経済産業省「医療情報を取り扱う情報システム・サービスの提供事業者における安全管理ガイドライン 第2.0版」（令和2年8月策定・令和7年3月改定）",
    url: "https://www.mhlw.go.jp/stf/shingi/0000516275_00006.html",
  },
];

const relatedArticles = [
  {
    title: "「診断を代替しない」と書けば医療機器ではなくなるのか — ヘルスケアサービスの該当性の線引きを厚労省ガイドラインで読み解く",
    href: "../samd-boundary/",
  },
  {
    title: "医療情報システム安全管理ガイドライン第7.0版（2026年6月）改訂まとめ — 事業者が今すぐ確認すべき3点",
    href: "../guideline-7-0-summary/",
  },
];

export default function ArticleAcademicSeedPage() {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="../../" className="text-xl font-bold text-primary-700">HealthLegal</a>
          <a
            href="#contact"
            className="px-5 py-2 bg-accent-500 text-white text-sm font-semibold rounded-lg hover:bg-accent-600 transition-colors"
          >
            お問い合わせ
          </a>
        </div>
      </header>

      <main>
        {/* タイトル */}
        <section className="pt-16 pb-10 px-6 bg-gradient-to-b from-primary-50 to-white">
          <div className="max-w-3xl mx-auto">
            <p className="text-sm font-semibold text-primary-700 mb-4">解説記事 ｜ 大学発シーズの事業化</p>
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 leading-snug sm:leading-snug mb-6">
              大学発シーズが最初につまずく3つの規制論点
              <span className="block text-lg sm:text-2xl text-slate-700 mt-3">
                — 研究成果を医療系プロダクトにする前に確認すること
              </span>
            </h1>
            <p className="text-sm text-slate-500">
              公開: 2026年8月 ｜ 執筆: Beyond HealthTech合同会社 ｜ 一次資料（薬機法条文・厚生労働省ガイドライン・倫理指針）に基づき作成
            </p>
          </div>
        </section>

        <article className="py-12 px-6">
          <div className="max-w-3xl mx-auto">
            {/* 3行まとめ */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 mb-10">
              <h2 className="text-lg font-bold text-slate-900 mb-4">3行まとめ</h2>
              <ul className="space-y-3 text-slate-700 leading-relaxed text-[15px]">
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold shrink-0">1.</span>
                  <span>
                    <strong>研究として優れていることと、プロダクトとして規制を通ることは、別の土俵で判定されます</strong>。医療機器該当性は技術の中身ではなく「使用目的」——それも上市時の表示・広告・説明資料から認定されるため、研究段階の位置づけのままでは判断できません。
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold shrink-0">2.</span>
                  <span>
                    医療機器を「業として」製造販売できるのは、クラスに応じた<strong>製造販売業許可</strong>を受けた者だけです（薬機法第23条の2）。許可は総括製造販売責任者の設置や品質・安全管理体制といった<strong>事業体制の要件</strong>であり、研究室がそのまま担う建付けにはなっていません。<strong>「誰が製造販売業者になるのか」は、事業計画の前提として最初に決める論点</strong>です。
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold shrink-0">3.</span>
                  <span>
                    <strong>研究で集めたデータ・書いた同意文書は、事業利用まで自動的にはカバーしていません</strong>。倫理指針の同意の範囲、大学と営利法人での個人情報の取扱いの違い、そして医療機関のデータを預かるサービスに求められる3省2ガイドライン対応——データまわりは「後で直す」が最も高くつく論点です。
                  </span>
                </li>
              </ul>
            </div>

            {/* 1 */}
            <h2 className={h2Class}>1. なぜ「技術の次」ではなく「技術と同時」なのか</h2>
            <p className={pClass}>
              ギャップファンドやJST START等の支援を受け、大学の研究成果——画像解析AI、バイオマーカー、センシング技術、デジタル療法——を事業化する動きが増えています。この段階のチームの多くは、研究代表者＋数名で、薬事や法規制の担当者はまだいません。
            </p>
            <p className={pClass}>
              事業化の相談で最初に出てくるのは資金調達やチームづくりですが、医療・ヘルスケア領域では、<strong>規制の3つの論点が事業計画そのものの前提</strong>になります。どの論点も「プロダクトができてから考える」では手戻りが大きく、逆に<strong>構想段階なら選択肢が最も多い</strong>という共通の性質があります。順に見ていきます。
            </p>

            {/* 2 */}
            <h2 className={h2Class}>2. 論点① 医療機器該当性 — 研究プロトタイプの位置づけのままでは判断できない</h2>
            <p className={pClass}>
              最初の分岐は、そのプロダクトが<strong>医療機器プログラム（SaMD）を含む医療機器に該当するか</strong>です。該当すれば、承認・認証、業許可、QMS体制といった医薬品医療機器等法の規制が一式かかり、開発費・期間・体制の桁が変わります。
            </p>
            <p className={pClass}>ここで大学発シーズに特有の落とし穴が2つあります。</p>
            <p className={pClass}>
              <strong>第一に、該当性は「機能」ではなく「使用目的」で判断されます</strong>。公式の物差しである厚生労働省「プログラムの医療機器該当性に関するガイドライン」（令和3年3月31日、令和5年3月31日一部改正）は、該当性を<strong>製品の表示・説明資料・広告等から認定される使用目的とリスクの程度</strong>で判断すると定めています。研究論文で「◯◯病の検出精度△%」と報告した技術でも、プロダクトとしてどう訴求するかで結論が変わります。逆に言えば、<strong>研究段階で倫理審査を通っていることや、研究として非該当扱いだったことは、上市後の該当性判断を保証しません</strong>。
            </p>
            <p className={pClass}>
              <strong>第二に、AI・機械学習モデルは該当性の整理上「独自アルゴリズム」に当たります</strong>。同ガイドラインの整理では、非該当が成立する主要な型のひとつに「根拠が検証可能な公知情報の提供」がありますが、学会ガイドライン等を土台にしていても独自の指標・アルゴリズムを組み込んで判定するものはこの型を使えません。<strong>個人を特定した疾病リスク・疾病候補の表示を独自アルゴリズムで行う構成は、該当側に振れる典型</strong>です。大学発シーズの多くはまさに「独自アルゴリズムであること」が新規性なので、この論点を避けて通れません。
            </p>
            <blockquote className={quoteClass}>
              この線引きの詳細（非該当が成立する4つの型・一線を越える2大シグナル）は、別記事
              <a href="../samd-boundary/" className="text-primary-600 hover:text-primary-700 underline mx-1">
                「診断を代替しない」と書けば医療機器ではなくなるのか
              </a>
              で公式フローチャートと掲載事例に基づいて整理しています。
            </blockquote>
            <p className={pClass}>
              <strong>構想段階でやるべきこと</strong>: 使用目的（誰が・何のために・何を入力し・何が出るか）を文章で確定し、厚労省の該当性判断事例・事例データベース（令和7年7月3日更新）に当てること。グレーならPMDAの<strong>医療機器プログラム総合相談</strong>（SaMDの一元的相談窓口）に構想段階で相談できます。該当を前提にするのか、非該当の範囲に納めるのかで、次の論点②の答えも変わります。
            </p>

            {/* 3 */}
            <h2 className={h2Class}>3. 論点② 誰が「製造販売業者」になるのか — 許可は技術ではなく事業体制の要件</h2>
            <p className={pClass}>
              医療機器に該当する場合、次に決めるべきは<strong>上市の主体</strong>です。医薬品医療機器等法第23条の2は、医療機器を業として製造販売できる者を、クラスに応じた許可を受けた者に限定しています。
            </p>
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-100 text-slate-900">
                    <th className={thClass}>医療機器の種類（クラス）</th>
                    <th className={thClass}>必要な許可</th>
                  </tr>
                </thead>
                <tbody>
                  {licenseRows.map((r) => (
                    <tr key={r.cls} className="bg-white">
                      <td className={tdClass}>{r.cls}</td>
                      <td className={tdClass}>{r.license}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={pClass}>
              ※医療機器プログラムは、クラスⅠ相当が医療機器の範囲から除かれるため、実務上は<strong>クラスⅡ以上（＝第二種または第一種の許可）</strong>が対象になります。
            </p>
            <p className={pClass}>
              重要なのは、この許可が<strong>技術審査ではなく体制要件</strong>だということです。許可申請には<strong>医療機器等総括製造販売責任者</strong>の設置が必要で、<strong>製造管理・品質管理の体制</strong>（QMS体制省令）と<strong>製造販売後安全管理の体制</strong>（GVP省令）が省令基準に適合しなければ許可されません（同法第23条の2の2）。品目ごとの承認・認証とは別に、<strong>会社としての継続的な品質・安全管理の運営</strong>が求められる、ということです。
            </p>
            <p className={pClass}>
              研究室はこの体制を担う建付けになっていないため、大学発シーズでは<strong>「誰が製造販売業者になるのか」を最初に選ぶ</strong>ことになります。選択肢は大きく3つです。
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-slate-700 leading-relaxed mb-5">
              <li>
                <strong>スタートアップを設立し、自社で業許可・承認を取る</strong> — 事業価値を最も取り込める一方、総括製造販売責任者（資格要件あり）の確保とQMS/GVP体制の構築・維持が自社コストになります。
              </li>
              <li>
                <strong>既存の医療機器企業へライセンスアウトする</strong> — 体制は相手に任せられる一方、事業の主導権と収益配分はライセンス条件次第。相手探しと交渉が律速になります。
              </li>
              <li>
                <strong>共同開発（薬事は企業側・技術は大学/スタートアップ側）</strong> — 中間形。承認申請の主体・特許とデータの帰属・改良版の権利を契約で厳密に決めておかないと、後で最も揉める形でもあります。
              </li>
            </ol>
            <p className={pClass}>
              <strong>構想段階でやるべきこと</strong>: どの形を目指すかの仮決めです。この選択は、治験・臨床評価を誰の名義でやるか、特許・データを誰に帰属させるか、ギャップファンド後の資本政策をどう組むかの前提になり、<strong>後から変えるほど移転コスト（契約・データ・体制）が積み上がります</strong>。決め切れなくても、「どの選択肢を残すか」を意識して特許出願とデータの権利関係を整理しておくだけで、後の自由度が大きく変わります。
            </p>

            {/* 4 */}
            <h2 className={h2Class}>4. 論点③ 研究データは事業にそのまま使えるか — 同意・指針・医療情報ガイドライン</h2>
            <p className={pClass}>
              3つ目は、最も見落とされやすい論点です。研究段階で蓄積した患者データ・臨床データは、シーズの価値の核心ですが、<strong>「研究に使ってよいデータ」と「事業に使ってよいデータ」は範囲が異なります</strong>。
            </p>
            <p className={pClass}>確認すべき層が3つあります。</p>
            <p className={pClass}>
              <strong>（1）同意の範囲</strong>。大学での研究データの取得は「人を対象とする生命科学・医学系研究に関する倫理指針」（令和3年3月23日制定、令和6年4月1日最新改正）の下で、研究計画書と同意（インフォームド・コンセント）に基づいて行われています。その同意文書が<strong>営利目的の製品開発・商用サービスでの利用まで含んでいるか</strong>は、文書ごとに確認するしかありません。含んでいない場合、再同意の取得や、利用できるデータの切り分けが必要になります。<strong>モデルの学習に使った検証用データが事業では使えない</strong>と後から判明するのは、大学発AIシーズの典型的な手戻りです。
            </p>
            <p className={pClass}>
              <strong>（2）主体が変わることの影響</strong>。個人情報保護法上、大学等の学術研究機関には学術研究目的に係る適用の特例がありますが、これは<strong>機関と目的に紐づく特例</strong>です。データがスタートアップ（営利法人）に移り、目的が製品開発・サービス提供になれば、同じデータでも通常の事業者としての義務を前提に取扱いを組み直すことになります。大学から会社へのデータの移転・利用許諾そのものにも、同意の範囲（第三者提供・共同利用の整理）が関わります。<strong>「大学時代はこの運用で通っていた」は、会社では前提から成り立たない</strong>——ここを法人化前に点検しておくと、後の契約・監査で慌てません。
            </p>
            <p className={pClass}>
              <strong>（3）事業として医療情報を扱う場合のガイドライン対応</strong>。プロダクトが医療機関のデータを預かる・処理するサービス（SaMDのクラウド側、PHR、研究支援サービス等）になるなら、提供事業者には<strong>いわゆる3省2ガイドライン</strong>への対応が求められます——厚生労働省「医療情報システムの安全管理に関するガイドライン」（<strong>第7.0版・2026年6月公表</strong>）と、経済産業省・総務省「医療情報を取り扱う情報システム・サービスの提供事業者における安全管理ガイドライン」（<strong>第2.0版・令和7年3月改定</strong>）です。第7.0版では、医療機関が事業者を選定する際の確認事項（MDS/SDS・計99項目）が明文化されており、<strong>医療機関側から対応状況の提示を求められるのが標準</strong>になりつつあります。つまりこれは「怒られないための対応」ではなく、<strong>医療機関に採用してもらうための営業要件</strong>です。体制の小さい大学発スタートアップこそ、アーキテクチャ設計の段階（クラウド構成・認証方式・ログの持ち方）で織り込むのが、結果的に最も安上がりです。
            </p>

            {/* 5 */}
            <h2 className={h2Class}>5. 3つの論点に共通する構造 — 「研究では問われなかったことが、事業になった瞬間に問われる」</h2>
            <p className={pClass}>並べてみると、3つの論点は同じ構造をしています。</p>
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-100 text-slate-900">
                    <th className={thClass}>論点</th>
                    <th className={thClass}>研究段階</th>
                    <th className={thClass}>事業段階</th>
                  </tr>
                </thead>
                <tbody>
                  {structureRows.map((r) => (
                    <tr key={r.topic} className="bg-white">
                      <td className={`${tdClass} font-semibold`}>{r.topic}</td>
                      <td className={tdClass}>{r.research}</td>
                      <td className={tdClass}>{r.business}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={pClass}>
              どれも、<strong>研究の作法では正しくやってきたのに、事業の作法では前提が変わる</strong>論点です。だからこそ研究者の能力の問題ではなく、そして技術ができてから直すのでは遅い——<strong>法人化・資金調達・プロダクト設計の前に、この3点を1枚に整理しておく</strong>ことが、大学発シーズの事業化で最初にやる価値のある作業です。
            </p>

            {/* 6 */}
            <h2 className={h2Class}>6. まとめ — 法人化前にやるべき3つの整理</h2>
            <ol className="list-decimal pl-6 space-y-3 text-slate-700 leading-relaxed mb-5">
              <li>
                <strong>使用目的を文章で確定し、該当性の当たりをつける</strong>（該当性ガイドライン・事例データベース・PMDA総合相談）。該当前提か非該当設計かで事業計画の骨格が決まります。
              </li>
              <li>
                <strong>上市主体の仮説を持つ</strong>（自社で業許可／ライセンスアウト／共同開発）。特許・データの帰属整理はこの仮説に沿って。
              </li>
              <li>
                <strong>データの棚卸し</strong>（同意文書の範囲・大学から会社への移転整理・3省2ガイドライン対応の要否）。とくに同意の範囲は、後からの修正コストが最も大きい項目です。
              </li>
            </ol>

            {/* 出典 */}
            <h2 className={h2Class}>出典（一次資料）</h2>
            <ul className="space-y-2 mb-5 text-sm">
              {sourceLinks.map((s) => (
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
            <p className="text-xs text-slate-500 mb-2">
              本記事は上記の一次資料に基づいて作成していますが、個別の対応判断にあたっては必ず原文をご確認ください。本記事は特定の大学・企業のシーズの該当性を評価するものではありません。
            </p>

            {/* 関連記事 */}
            <h2 className={h2Class}>関連記事（シリーズ: 規制の一次情報を読む）</h2>
            <ul className="space-y-2 mb-5">
              {relatedArticles.map((a) => (
                <li key={a.href} className="text-slate-700 leading-relaxed">
                  <a href={a.href} className="text-primary-600 hover:text-primary-700 underline">
                    {a.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </article>

        {/* CTA */}
        <section id="contact" className="py-20 px-6 bg-slate-900">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              研究成果の事業化を検討している方へ
            </h2>
            <p className="text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
              HealthLegalは、医療・ヘルスケア領域のプロダクトの薬事・法令対応を支援しています。
              「研究成果を製品にするなら何が必要か」の地図を、構想段階・法人化前から一緒に描けます。
              医療機器該当性の整理から3省2ガイドライン対応まで、初回のご相談は無料です。
            </p>
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
            <p className="text-slate-400 text-sm mt-8">
              事業化を進める人材（薬事・開発・事業開発）をお探しの場合は、医療・ヘルスケア領域特化のマッチングボード{" "}
              <a href={BOARD_URL} target="_blank" rel="noopener noreferrer" className="text-slate-200 underline hover:text-white">
                Healthcare Startup Board
              </a>{" "}
              をご利用いただけます。法人化前のシーズ段階からご相談いただけます。
            </p>
            <p className="text-slate-400 text-sm mt-4">
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
