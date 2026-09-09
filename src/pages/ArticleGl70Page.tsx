const FORM_URL = "https://docs.google.com/forms/d/1qQRrWDUPCOeXklfna912YEs1b2DqPHap3zZ0lpoyjZI/viewform";
const CHECKLIST_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfRcNrFAcwA-hmd_8t5xSIGtELD30m6USsmDf33HDyMgP79WQ/viewform";

// 見出し・本文のスタイルを1箇所に集約（記事ページ共通の器として流用できるようにする）
const h2Class = "text-2xl sm:text-3xl font-bold text-slate-900 mt-14 mb-5 leading-snug";
const h3Class = "text-xl font-bold text-slate-900 mt-10 mb-4 leading-snug";
const pClass = "text-slate-700 leading-relaxed mb-5";
const quoteClass = "border-l-4 border-primary-300 bg-primary-50/60 px-5 py-4 rounded-r-lg text-slate-700 leading-relaxed mb-5 text-[15px]";

const editions = [
  { name: "概説編", audience: "全読者", status: "継続" },
  { name: "経営管理編", audience: "経営層", status: "継続" },
  { name: "企画管理編", audience: "システムの安全管理者", status: "継続" },
  { name: "システム運用編", audience: "システム運用担当者", status: "継続" },
  { name: "保守委託機関編", audience: "保守を委託している医療機関の管理者・担当者", status: "新設", isNew: true },
];

const selfChecks = [
  "契約書・約款・SLAに「セキュリティアップデート責任は事業者が負う」旨の記載があるか（なければ、顧客は保守委託機関編を使えません）",
  "自社サービスがクライアント端末およびサーバのログインで二要素認証に対応しているか。未対応なら、いつ対応するかのロードマップを顧客に示せるか",
  "MDS/SDSを整備しているか。保守委託機関編【別紙】の99項目で「いいえ」になる項目がいくつあるか",
  "BCP手順書・非常時アカウント管理手順・保守作業記録を、顧客に提供できる形で用意しているか",
  "顧客向けのセキュリティ説明資料で、ガイドラインの版数が「第6.0版」のままになっていないか。パスワード定期変更を根拠として説明していないか",
  "再委託先がある場合、同等の個人情報保護対策を契約で義務付けているか",
];

const sourceLinks = [
  {
    title: "「医療情報システムの安全管理に関するガイドライン第7.0版」の策定について（産情発0629第1号・令和8年6月29日）",
    url: "https://www.mhlw.go.jp/content/10808000/001716656.pdf",
  },
  {
    title: "第7.0版 保守委託機関編（全27ページ・【別紙】MDS/SDSにおけるセキュリティ確認事項を含む）",
    url: "https://www.mhlw.go.jp/content/10808000/001716297.pdf",
  },
  {
    title: "概要及び主な改定内容（検討会資料・令和8年5月29日）",
    url: "https://www.mhlw.go.jp/content/10808000/001102596.pdf",
  },
  {
    title: "ガイドライン掲載ページ（全5編のPDFリンク）",
    url: "https://www.mhlw.go.jp/stf/shingi/0000516275_00006.html",
  },
];

export default function ArticleGl70Page() {
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
            <p className="text-sm font-semibold text-primary-700 mb-4">解説記事 ｜ 3省2ガイドライン</p>
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 leading-snug sm:leading-snug mb-6">
              医療情報システム安全管理ガイドライン第7.0版（2026年6月）改訂まとめ
              <span className="block text-lg sm:text-2xl text-slate-700 mt-3">
                — 医療機関にシステムを提供する事業者が今すぐ確認すべき3点
              </span>
            </h1>
            <p className="text-sm text-slate-500">
              公開: 2026年8月 ｜ 執筆: Beyond HealthTech合同会社 ｜ 一次資料（厚生労働省 策定通知・保守委託機関編）に基づき作成
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
                    <strong>保守委託機関編が新設</strong>されました。小規模医療機関が「セキュリティアップデート責任をすべて事業者に委託している」場合、この編の遵守だけで他編も遵守とみなされます。<strong>その前提となるのは、あなたの会社の契約書・約款・SLAの記載</strong>です。
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold shrink-0">2.</span>
                  <span>
                    <strong>二要素認証の対象が「クライアント端末およびサーバ」と明確化</strong>され、<strong>令和9年4月1日</strong>という時点が示されました。対応が困難な医療機関には次期システム改修までの猶予がありますが、その場合は「<strong>次期更新時に対応可能な事業者を選定する</strong>」ことが求められます。つまり期限は、医療機関の課題であると同時に<strong>ベンダ選定の要件</strong>として降ってきます。
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold shrink-0">3.</span>
                  <span>
                    <strong>パスワードの「定期的な変更」要件は削除</strong>されました。代わりに使い回しの禁止とアカウントロックが追記されています。自社サービスの仕様やお客様向け説明資料が旧要件のままになっていないか、確認どころです。
                  </span>
                </li>
              </ul>
            </div>

            {/* 1. 何が起きたのか */}
            <h2 className={h2Class}>1. 何が起きたのか</h2>
            <p className={pClass}>
              2026年6月29日、厚生労働省が「医療情報システムの安全管理に関するガイドライン 第7.0版」を策定しました（産情発0629第1号）。前版の第6.0版は令和5年5月策定なので、約3年ぶりの改定です。
            </p>
            <p className={pClass}>改定の背景として、策定通知は次の3点を挙げています。</p>
            <ol className="list-decimal pl-6 space-y-2 text-slate-700 leading-relaxed mb-5">
              <li>第6.0版の公表以降も<strong>医療機関等を対象としたサイバー攻撃事案の発生が継続</strong>していること</li>
              <li><strong>サイバー対処能力強化法</strong>（重要電子計算機に対する不正な行為による被害の防止に関する法律・令和7年法律第42号）の成立を背景に、社会的関心と重要性が高まっていること</li>
              <li>内閣官房国家サイバー統括室（NCO）による「重要インフラのサイバーセキュリティに係る安全基準等策定指針」の改定、および経産省・総務省の<strong>2省ガイドラインが第2.0版に改定</strong>されたこと</li>
            </ol>
            <p className={pClass}>
              つまり今回の改定は「新しい脅威が出たから」というより、<strong>周辺の法制度と他のガイドラインが動いたことへの整合合わせ</strong>という性格が強いものです。事業者側にとっては、後述する保守委託機関編を除けば、要求事項そのものが大きく増えたわけではありません。
            </p>
            <p className={pClass}><strong>構成は4編から5編になりました。</strong></p>
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-100 text-slate-900">
                    <th className="text-left font-semibold px-4 py-3 border-b border-slate-200">編</th>
                    <th className="text-left font-semibold px-4 py-3 border-b border-slate-200">対象読者</th>
                    <th className="text-left font-semibold px-4 py-3 border-b border-slate-200">7.0版での扱い</th>
                  </tr>
                </thead>
                <tbody>
                  {editions.map((e) => (
                    <tr key={e.name} className={e.isNew ? "bg-primary-50/60" : "bg-white"}>
                      <td className={`px-4 py-3 border-b border-slate-100 ${e.isNew ? "font-bold text-primary-800" : "text-slate-700"}`}>{e.name}</td>
                      <td className={`px-4 py-3 border-b border-slate-100 ${e.isNew ? "font-bold text-primary-800" : "text-slate-700"}`}>{e.audience}</td>
                      <td className={`px-4 py-3 border-b border-slate-100 ${e.isNew ? "font-bold text-primary-800" : "text-slate-700"}`}>{e.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 2. 事業者に直接効く3つの変更 */}
            <h2 className={h2Class}>2. 事業者に直接効く3つの変更</h2>

            <h3 className={h3Class}>2-1. 保守委託機関編の新設 —— 効いてくるのは「契約書の1行」です</h3>
            <p className={pClass}>
              新設された保守委託機関編は、<strong>専任のシステム担当者が不在で、セキュリティアップデートを含む保守を事業者に十分に委託している小規模医療機関等</strong>を対象としています。同編の対象となる医療機関等を、ガイドラインは「<strong>保守委託機関</strong>」と呼びます。
            </p>
            <p className={pClass}>ここは用語を取り違えやすいところなので、先に整理しておきます。</p>
            <blockquote className={quoteClass}>
              <strong>「保守委託機関」＝保守を委託している側（医療機関）</strong>です。保守を受託する事業者のことではありません。
            </blockquote>
            <p className={pClass}>
              この編が画期的なのは、<strong>みなし遵守</strong>を導入した点です。すべてのサーバのセキュリティアップデートを事業者に委託している医療機関等は、<strong>保守委託機関編を遵守することで、その他の編の項目も遵守できているものとみなされます</strong>。専門人材がいない小規模医療機関にとっては、対応すべき項目が大幅に絞り込まれることになります。
            </p>
            <p className={pClass}>
              <strong>では事業者側は何を確認すればよいのか。</strong>判断フローチャートの注記が、そのまま答えになっています。
            </p>
            <blockquote className={quoteClass}>
              「事業者がセキュリティアップデート責任を負うこと」が、<strong>契約書や約款、サービスレベル合意書等に記載されている場合にのみ「YES」を選択可能</strong>となる。記載がない場合や不明確な場合には医療機関側の責任となっている可能性がある。
              <span className="block text-xs text-slate-500 mt-2">（保守委託機関編 図1 注記※2）</span>
            </blockquote>
            <p className={pClass}>
              つまり、<strong>顧客である医療機関が「みなし遵守」の恩恵を受けられるかどうかは、あなたの会社の契約書・約款・SLAに「セキュリティアップデート責任は事業者が負う」と書いてあるかどうかで決まります</strong>。
            </p>
            <p className={pClass}>これは実務上、次の2つを意味します。</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 leading-relaxed mb-5">
              <li>
                <strong>リスク</strong>: 記載がなければ、顧客は保守委託機関編を使えません。結果として顧客はシステム運用編まで含めた全編対応を自力で求められることになり、その負担は「このベンダを使うと大変」という評価に直結します。
              </li>
              <li>
                <strong>機会</strong>: 逆に言えば、契約書・約款・SLAにこの1行を明記し、「当社をご利用の場合、貴院は保守委託機関編の対象となります」と説明できる事業者は、<strong>小規模医療機関に対する明確な差別化要因を持てます</strong>。SaaS型の電子カルテ・部門システム・AIサービスを提供している事業者にとっては、そのまま提案書の1ページになります。
              </li>
            </ul>
            <p className={pClass}>
              なお、ここでいう「サーバ」には注意が必要です。医療情報の保存や主要な処理を担う機器を指し、原則としてPCやタブレット等のクライアント端末は含みませんが、<strong>電子カルテアプリ等を端末にインストールし、その機器上で処理が完結する場合はPC等の端末も「サーバ」に含まれます</strong>。オンプレ端末で完結する構成が1台でも残っていると「すべてのサーバ」の条件を満たさない可能性がある、という点は顧客への説明時に押さえておくべきところです。
            </p>

            <h3 className={h3Class}>2-2. 二要素認証 —— 「令和9年4月1日」はベンダ選定の要件として降ってくる</h3>
            <p className={pClass}>
              7.0版では、二要素認証の導入について<strong>医療情報システムのうちクライアント端末およびサーバにおいて対応すること</strong>が明確化されました。あわせて、これまで対象が明確でなかった経緯を踏まえ、<strong>令和9年4月1日時点での対応が困難な医療機関等については、次期システム改修での対応を許容する緩和措置</strong>が設定されています。
            </p>
            <p className={pClass}>
              事業者にとっての勘所は、<strong>緩和措置の書きぶり</strong>です。保守委託機関編の遵守項目は、猶予を使う場合の条件をこう書いています。
            </p>
            <blockquote className={quoteClass}>
              クライアント端末のアプリケーションログイン時には、令和9年度までに二要素認証を採用すること。<strong>対応が困難な場合には、令和9年度以降のシステム更新時に対応可能な事業者を選定すること。</strong>
              <span className="block text-xs text-slate-500 mt-2">（保守委託機関編 9章 ④。オンプレミスのサーバがある場合はOSログイン時についても同様の規定が⑤にあります）</span>
            </blockquote>
            <p className={pClass}>
              猶予は「対応しなくてよい」ではなく、「<strong>次の更新のときに対応できる事業者を選べ</strong>」という形で設計されています。医療機関が今すぐ二要素認証に対応できなくても、<strong>次期更新の候補に残るには事業者側の対応が前提</strong>になる、ということです。
            </p>
            <p className={pClass}>
              自社サービスが二要素認証に未対応の場合、令和9年（2027年）度の更新サイクルで候補から外れるリスクがあります。逆に対応済みであれば、これは提案時に明示すべき要件です。
            </p>
            <p className={pClass}>
              なお、MDS/SDSの様式（後述）では、この点について「<strong>二要素認証に対応済、もしくは医療機関等の次期システム更改までに二要素認証とみなすことが可能な措置に対応予定の場合は「はい」を選択してください</strong>」と注記されています。ロードマップとして対応予定が示せるかどうかが、書類上の分岐点になります。
            </p>

            <h3 className={h3Class}>2-3. MDS/SDS —— 99項目が「選定基準」として明文化されました</h3>
            <p className={pClass}>
              保守委託機関編には【別紙】として「MDS/SDS におけるセキュリティ確認事項」が付いており、<strong>MDS 41項目・SDS 58項目（計99項目）</strong>が具体的に列挙されています。
            </p>
            <p className={pClass}>そして本文には、こう書かれています。</p>
            <blockquote className={quoteClass}>
              医療情報システムを事業者から導入し、運用などを委託している場合には、可能な限りMDS/SDSを事業者から入手すること。このうち、本編末尾の【別紙】で示すMDS/SDSの項目について十分に対応できている必要がある。<strong>【別紙】のすべてにおいて「はい」または「対象外」となっている事業者を選定すること。</strong>
              <br />
              「いいえ」が選択されているMDS/SDSを含む事業者を選定する場合や、約款に十分な記載がない場合は、各項目について十分なリスク評価、リスク対応を実施し、立入検査や監査等の際に適切な説明が可能な状態とすること。
              <span className="block text-xs text-slate-500 mt-2">（保守委託機関編 10章解説）</span>
            </blockquote>
            <p className={pClass}>これは事業者にとって、<strong>事実上の合格ラインが公開された</strong>ことを意味します。</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 leading-relaxed mb-5">
              <li>
                別紙の項目に1つでも「いいえ」があると、顧客側に<strong>追加のリスク評価と、立入検査・監査での説明責任</strong>が発生します。多くの小規模医療機関にとって、これは現実的なハードルです。
              </li>
              <li>
                裏返せば、<strong>別紙の99項目をすべて「はい」または「対象外」で回答できる状態を作っておけば、その事業者は「選定してよい事業者」として書類上クリアになります</strong>。
              </li>
            </ul>
            <p className={pClass}>
              別紙でカバーされている領域は、SDS側で言えば、システム設計・運用に必要な規程類（BCP手順書・非常時アカウント管理手順の提供可否）、責任分界（契約への安全管理条項、管理責任範囲の文書提示）、リスクアセスメント、標準化対応（データの標準形式での出力入力）、情報管理（持出時の暗号化、機器廃棄時の確認）、事業者による保守対応（作業後のデータ消去、保守アカウントの専用運用、リモート保守時のアクセスログ）、システム運用管理（非常時アカウント、複数世代・複数方式のバックアップ、復元手段）、物理的安全管理、ネットワーク（通信方式は専用線／IP-VPN／IPsec-VPN+IKE／TLS1.2高セキュリティ型以上のクライアント認証のいずれか）、認証・認可、電子署名・タイムスタンプ、証跡のレビュー・システム監査、外部からの攻撃 —— と広範です。
            </p>
            <p className={pClass}>
              <strong>新規参入の事業者ほど、「BCP手順書を医療機関に提供できるか」「保守作業の記録を提供できるか」といった、機能ではなく書類・運用体制を問う項目でつまずきます。</strong>開発を止めずに準備できる項目が多いので、営業が本格化する前に着手しておく価値があります。
            </p>

            {/* 3. その他の改定点 */}
            <h2 className={h2Class}>3. その他の改定点（押さえておくべきもの）</h2>

            <h3 className={h3Class}>パスワードの「定期的な変更」要件は削除されました</h3>
            <p className={pClass}>
              7.0版では、パスワードルールについて<strong>使い回しの禁止</strong>と<strong>アカウントロックの導入</strong>が追記された一方、「<strong>定期的な変更</strong>」の要件は、セキュリティ面の強化につながらないとされ<strong>削除</strong>されました。
            </p>
            <p className={pClass}>
              自社サービスの仕様や、顧客向けのセキュリティ説明資料に「ガイドラインに基づき90日ごとのパスワード変更を強制しています」といった記述が残っている場合、それは<strong>もう根拠を失った説明</strong>です。強制変更の実装自体が直ちに違反になるわけではありませんが、ガイドラインを根拠として説明することはできなくなりました。地味ですが、資料の鮮度が見られるポイントです。
            </p>

            <h3 className={h3Class}>サプライチェーンリスク・役割分担・リスクコミュニケーション</h3>
            <p className={pClass}>
              関連法令に<strong>サイバーセキュリティ基本法</strong>が追加され、<strong>サプライチェーンリスク</strong>について追記されました。また2省ガイドライン第2.0版への改定を受け、<strong>医療機関等と事業者との役割分担</strong>、および<strong>医療機関とのリスクコミュニケーション</strong>が追記されています。
            </p>
            <p className={pClass}>
              事業者側で言えば、再委託先を含めた体制の説明資料、責任分界の文書、インシデント時の連絡フローが、契約や監査の場で問われる頻度が上がるということです。前述のSDS項目にも「外部委託先にも同等の個人情報保護対策を契約で義務付けているか」「標的型攻撃発生時の連絡手段を準備しているか」が含まれています。
            </p>

            <h3 className={h3Class}>クラウドサービスの積極的な活用を推進する旨が追記されました</h3>
            <p className={pClass}>
              7.0版は、クラウドサービスの積極的な活用を推進する旨を明記しています。保守委託機関編そのものが「SaaSへの移行が容易な小規模医療機関等」を主な対象として設計されていることと合わせて読むと、<strong>クラウド／SaaSは「認められている」段階から「推奨される」段階に進んだ</strong>と読めます。オンプレミス前提の商慣行に対して、SaaS事業者が正面から提案しやすくなる改定です。
            </p>

            {/* 4. 誤解しやすい点 */}
            <h2 className={h2Class}>4. 誤解しやすい点</h2>
            <p className={pClass}>
              <strong>「パスワードの定期変更が削除された＝要件が緩和された」ではありません。</strong>削除の理由は「セキュリティ面の強化につながらない」という有効性の評価であって、代わりに使い回しの禁止とアカウントロックが入っています。求められる水準はむしろ上がっています。
            </p>
            <p className={pClass}>
              <strong>「みなし遵守があるから顧客は何もしなくてよい」ではありません。</strong>条件は「<strong>すべての</strong>サーバのセキュリティアップデート責任を事業者に委託している」ことです。1台でも自院管理のサーバ（前述のとおり、処理が完結するPC端末を含む）が残っていれば、フローチャートは「NO」になり、通常どおり全編が対象になります。「うちのSaaSを入れればみなし遵守になります」という説明は、顧客の環境全体を確認しないまま行うと不正確です。
            </p>
            <p className={pClass}>
              <strong>「令和9年4月1日までに二要素認証が必須」と単純化するのも不正確です。</strong>対応が困難な医療機関等には次期システム改修までの猶予があります。ただしその条件は「次期更新時に対応可能な事業者を選定すること」であり、事業者側から見れば結局、<strong>その時点までに対応していなければ選定候補から外れる</strong>という構造です。
            </p>
            <p className={pClass}>
              <strong>「保守委託機関」は事業者ではなく医療機関を指します。</strong>資料や提案書で用語を取り違えると、この改定を読んでいないことがすぐ伝わってしまいます。
            </p>

            {/* 5. 今すぐできる確認 */}
            <h2 className={h2Class}>5. 今すぐできる確認（事業者向けチェック）</h2>
            <ul className="space-y-3 mb-5">
              {selfChecks.map((item) => (
                <li key={item} className="flex gap-3 text-slate-700 leading-relaxed">
                  <svg className="w-5 h-5 text-primary-600 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* 6. まとめ */}
            <h2 className={h2Class}>6. まとめ</h2>
            <p className={pClass}>
              第7.0版は、事業者にとって「新しい技術要件が大量に増えた改定」ではありません。むしろ<strong>すでに求められていたことが、契約書の記載・MDS/SDSの回答・ベンダ選定の条件という形で、より具体的な書類レベルに落とし込まれた改定</strong>です。
            </p>
            <p className={pClass}>
              そのぶん、対応の可否が<strong>目に見える形で比較されやすくなりました</strong>。保守委託機関編の【別紙】99項目は、顧客が事業者を選ぶときのチェックリストとして、そのまま使えるものだからです。
            </p>
            <p className={pClass}>
              医療機関への提供を始めたばかりの事業者や、これから医療分野に参入する事業者にとっては、<strong>製品開発と並行して、契約書・MDS/SDS・運用文書を揃えておくこと</strong>が、そのまま商談を前に進める準備になります。
            </p>

            {/* 出典 */}
            <h2 className={h2Class}>出典（一次資料）</h2>
            <ul className="space-y-2 mb-5 text-sm">
              {sourceLinks.map((s) => (
                <li key={s.url} className="text-slate-600 leading-relaxed">
                  {s.title}
                  <br />
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline break-all">
                    {s.url}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-500 mb-2">
              本記事は上記の一次資料に基づいて作成していますが、個別の対応判断にあたっては必ず原文をご確認ください。
            </p>

            {/* 関連記事 */}
            <h2 className={h2Class}>関連記事（シリーズ: 規制の一次情報を読む）</h2>
            <ul className="space-y-2 mb-5">
              <li className="text-slate-700 leading-relaxed">
                <a href="../samd-boundary/" className="text-primary-600 hover:text-primary-700 underline">
                  「診断を代替しない」と書けば医療機器ではなくなるのか — ヘルスケアサービスの該当性の線引きを厚労省ガイドラインで読み解く
                </a>
              </li>
              <li className="text-slate-700 leading-relaxed">
                <a href="../academic-seed-regulatory/" className="text-primary-600 hover:text-primary-700 underline">
                  大学発シーズが最初につまずく3つの規制論点 — 研究成果を医療系プロダクトにする前に確認すること
                </a>
              </li>
            </ul>
          </div>
        </article>

        {/* CTA */}
        <section id="contact" className="py-20 px-6 bg-slate-900">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              自社の状況に当てはめて確認したい方へ
            </h2>
            <p className="text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
              「うちの契約書の書きぶりで保守委託機関編の対象になるか」「MDS/SDSの99項目にどこまで対応できているか」など、
              個別の状況についてのご相談を承っています。初回のご相談は無料です。
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
