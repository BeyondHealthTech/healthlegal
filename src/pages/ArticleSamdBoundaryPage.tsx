const FORM_URL = "https://docs.google.com/forms/d/1qQRrWDUPCOeXklfna912YEs1b2DqPHap3zZ0lpoyjZI/viewform";

// 記事ページ共通のスタイル（ArticleGl70Page と同じ器）
const h2Class = "text-2xl sm:text-3xl font-bold text-slate-900 mt-14 mb-5 leading-snug";
const h3Class = "text-xl font-bold text-slate-900 mt-10 mb-4 leading-snug";
const pClass = "text-slate-700 leading-relaxed mb-5";
const quoteClass = "border-l-4 border-primary-300 bg-primary-50/60 px-5 py-4 rounded-r-lg text-slate-700 leading-relaxed mb-5 text-[15px]";

const preLaunchChecks = [
  "使用目的を文章で確定する（誰が・何のために・何を入力し・何が出るか）。該当性ガイドライン5章の整理項目（使用者／使用目的／処理方法／アルゴリズムの根拠と検証可能性）をそのまま埋めるのが早道です",
  "LP・プレスリリース・営業資料の文言を「使用目的の証拠」として点検する。開発ドキュメントより先に、訴求文言が判断材料になります",
  "一般的名称を検索する。相当する「◯◯プログラム」の一般的名称（令和5年1月時点で186種類）が既にあれば、原則その医療機器に該当します",
  "公式の事例集・データベースに当てる。厚労省は該当性判断事例（令和5年3月31日）に加え、事例データベース（令和7年7月3日更新）を公表しており、直近の判断傾向まで確認できます",
  "迷ったら公式窓口へ。該当性相談は「医療機器プログラム総合相談」に一元化されています。判断がグレーなまま市場に出すことが最大のリスクです",
];

const sourceLinks = [
  {
    title:
      "厚生労働省医薬・生活衛生局監視指導・麻薬対策課／医療機器審査管理課「プログラムの医療機器該当性に関するガイドライン」（令和3年3月31日、令和5年3月31日一部改正）本文・別紙1・別紙2・掲載事例1〜3（PMDA掲載PDF・全24ページ）",
    url: "https://www.pmda.go.jp/files/000240233.pdf",
  },
  {
    title:
      "厚生労働省「医療機器プログラムについて」（該当性判断事例〔令和5年3月31日〕・事例データベース〔令和7年7月3日更新〕・医療機器プログラム総合相談の案内）",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000179749_00004.html",
  },
  {
    title: "「プログラムの医療機器への該当性に関する基本的な考え方について」（平成26年11月14日付け薬食監麻発1114第5号）※ガイドライン内の参照として確認",
    url: "",
  },
  {
    title:
      "「人工知能（AI）を用いた診断、治療等の支援を行うプログラムの利用と医師法第17条の規定との関係について」（平成30年12月19日付け医政医発1219第1号）※ガイドライン内の参照として確認",
    url: "",
  },
];

const relatedArticles = [
  {
    title: "医療情報システム安全管理ガイドライン第7.0版（2026年6月）改訂まとめ — 事業者が今すぐ確認すべき3点",
    href: "../guideline-7-0-summary/",
  },
  {
    title: "大学発シーズが最初につまずく3つの規制論点 — 研究成果を医療系プロダクトにする前に確認すること",
    href: "../academic-seed-regulatory/",
  },
];

export default function ArticleSamdBoundaryPage() {
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
            <p className="text-sm font-semibold text-primary-700 mb-4">解説記事 ｜ 医療機器該当性（SaMD）</p>
            <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 leading-snug sm:leading-snug mb-6">
              「診断を代替しない」と書けば医療機器ではなくなるのか
              <span className="block text-lg sm:text-2xl text-slate-700 mt-3">
                — ヘルスケアサービスの該当性の線引きを厚労省ガイドラインで読み解く
              </span>
            </h1>
            <p className="text-sm text-slate-500">
              公開: 2026年8月 ｜ 執筆: Beyond HealthTech合同会社 ｜ 一次資料（厚生労働省「プログラムの医療機器該当性に関するガイドライン」令和5年改正）に基づき作成
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
                    医療機器該当性は<strong>プログラムの機能ではなく「使用目的」で判断</strong>されます。そしてその使用目的は、<strong>あなたの会社の表示・説明資料・広告（LP・プレスリリース・営業トークまで）から認定</strong>されます。同じ機能でも、見せ方が変われば結論が変わります。
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold shrink-0">2.</span>
                  <span>
                    <strong>「本プログラムは医療機器ではない」「診断を代替しない」という記載自体には、該当性を否定する効力はありません</strong>。ガイドラインは「そのような記載があっても、疾病の疑いを判断できるなどと認識を与える標ぼうをする製品は医療機器に該当する」と明記しています。
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary-600 font-bold shrink-0">3.</span>
                  <span>
                    非医療機器ポジショニングが成立する余地は主に4つ——<strong>①記録・閲覧・転送のみ ②根拠が検証可能な公知情報の提供のみ ③統計データとの比較のみ ④医療・健康以外の目的</strong>。逆に、<strong>個人を特定した疾病候補・重症度の表示</strong>と<strong>独自アルゴリズム（ブラックボックス）</strong>は、この一線を越える典型です。
                  </span>
                </li>
              </ul>
            </div>

            {/* 1 */}
            <h2 className={h2Class}>1. なぜいま「診断を代替しない」が増えているのか</h2>
            <p className={pClass}>
              ヘルスケア領域の新サービスのリリースやLPで、「診断を代替するものではありません」「医療機器ではありません」という但し書きを見ることが増えました。背景はシンプルで、プログラム（ソフトウェア）が医療機器＝<strong>医療機器プログラム（いわゆるSaMD）</strong>に該当すると、医薬品医療機器等法に基づく承認・認証、製造販売業許可、QMS体制などの規制が一式かかってくるからです。異業種から参入する事業者にとって、これは事業計画を左右する最初の分岐点です。
            </p>
            <p className={pClass}>
              この分岐を判断する公式の物差しが、厚生労働省の<strong>「プログラムの医療機器該当性に関するガイドライン」</strong>（令和3年3月31日、<strong>令和5年3月31日一部改正</strong>。医療機器審査管理課・監視指導・麻薬対策課）です。本稿ではこのガイドライン（以下「該当性ガイドライン」）を一次資料として、「診断を代替しない」型のポジショニングが<strong>どこまで成立し、どこで崩れるのか</strong>を整理します。
            </p>

            {/* 2 */}
            <h2 className={h2Class}>2. 大前提: 該当性は「機能」ではなく「使用目的」で決まる</h2>
            <p className={pClass}>該当性ガイドライン3章は、判断の枠組みをこう定めています。</p>
            <blockquote className={quoteClass}>
              特定のプログラムが、医薬品医療機器等法の医療機器に該当するか否かは、<strong>製造販売業者等による当該製品の表示、説明資料、広告等に基づき</strong>、当該プログラムの<strong>使用目的及びリスクの程度</strong>が医療機器の定義に該当するかにより判断される。<strong>同じ機能を有するプログラムであっても、使用目的が異なれば、医療機器該当性の判断は異なる可能性がある。</strong>
              <span className="block text-xs text-slate-500 mt-2">（該当性ガイドライン 3章）</span>
            </blockquote>
            <p className={pClass}>ここから実務上の重要な帰結が3つ出ます。</p>
            <ol className="list-decimal pl-6 space-y-2 text-slate-700 leading-relaxed mb-5">
              <li>
                <strong>判断材料はコードではなく、コミュニケーションです。</strong>LPの見出し、機能紹介、導入事例、プレスリリース、営業資料、（フローチャート解説では）口頭の説明まで含めて「使用目的」が認定されます。つまり該当性リスクの管理は開発チームだけの仕事ではなく、<strong>マーケティングと営業の仕事</strong>でもあります。
              </li>
              <li>
                <strong>企画段階で決めるべきものです。</strong>ガイドラインも「開発の初期、企画段階においても、どのような表示等を行うかを含め、プログラムの使用目的を十分に検討することが望ましい」としています。作ってから考えると、機能と訴求の間で身動きが取れなくなります。
              </li>
              <li>
                <strong>複数機能のうち1つでも該当すれば、全体が規制対象になります</strong>（同時に流通する不可分なプログラムの場合）。「便利機能のひとつとして疾病リスク表示も入れる」が、プロダクト全体を医療機器にし得ます。
              </li>
            </ol>

            {/* 3 */}
            <h2 className={h2Class}>3. 「診断を代替しない」という表示の効力 — 公式見解は明確です</h2>
            <p className={pClass}>
              では、「本プログラムは診断を代替しません／医療機器ではありません」と明記すればどうなるか。該当性ガイドライン8章（1）は、むしろ<strong>この記載を推奨</strong>しています——医療機器でないプログラムには、誤認を防ぐためにその旨を表示することが<strong>望ましい</strong>、と。
            </p>
            <p className={pClass}>ただし、続く注記が本稿の核心です。</p>
            <blockquote className={quoteClass}>
              「当該プログラムは、疾病の診断、治療又は予防に使用されることを目的としていない」又は「当該プログラムは医療機器ではない」旨の記載、表示があることをもって、<strong>当該プログラムが医療機器ではないことの根拠とはならない</strong>。そのような記載があっても、<strong>疾病の疑いを判断できるなどと医療機器との認識を与える広告・標ぼうをする製品は医療機器に該当する。</strong>
              <span className="block text-xs text-slate-500 mt-2">（該当性ガイドライン 8章（1）注記）</span>
            </blockquote>
            <p className={pClass}>
              つまり但し書きは、<strong>実体が非該当であるものの誤認防止表示</strong>としては推奨される一方、<strong>実体が該当するものの免罪符</strong>にはなりません。「診断を代替しない」と書きながら「あなたの◯◯病リスクを判定」と訴求すれば、判断されるのは後者です。
            </p>

            {/* 4 */}
            <h2 className={h2Class}>4. 非医療機器ポジショニングが成立する4つの型</h2>
            <p className={pClass}>
              該当性ガイドライン4章（医療機器に該当しない典型例）と、個人向けプログラムのフローチャート（別紙1・③）、疾病リスク表示のフローチャート（別紙2）から、非該当が成立する主要パターンを事業者目線で並べ直すと、次の4つです。
            </p>

            <h3 className={h3Class}>型① 記録・閲覧・転送のみ（PHR型）</h3>
            <p className={pClass}>
              血圧・血糖値・体重・服薬履歴など、使用者自身の医療・健康情報を<strong>記録・閲覧・共有するだけ</strong>のプログラムは非該当です。時系列表示やグラフ化など「閲覧のための単純な加工」も許容されます。
            </p>
            <p className={pClass}>
              <strong>境界線</strong>: センサの生信号を処理して計測値そのものを算出するプログラムは「表示・保管・転送のみ」には当たりません（例: 血中酸素飽和度・血圧・体温の算出）。「記録アプリのつもりが、実は計測器だった」は典型的な踏み外しです。
            </p>

            <h3 className={h3Class}>型② 根拠が検証可能な「公知情報」の提供のみ</h3>
            <p className={pClass}>
              医学教科書や国内学会の診療ガイドラインなど、<strong>信頼性の高い公知情報</strong>に従った情報提供・チェック表の単純な電子化は非該当側に整理されます（別紙2 (1)B-1/B-2）。
            </p>
            <p className={pClass}><strong>境界線が3つあります</strong>:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-700 leading-relaxed mb-5">
              <li><strong>公表されているだけでは「公知」ではない</strong>——単発の公表論文ベースは要注意。</li>
              <li><strong>単純な電子化を超えると崩れる</strong>——書籍記載の重回帰式で疾病リスクを算出するものはNO、検算に関数電卓以上を要する自動計算もNO。</li>
              <li>
                <strong>根拠の透明性が要件</strong>——引用元を明記し、使用者が根拠を検証できる状態が求められます。<strong>「独自アルゴリズム」「ブラックボックス化した算出過程」はこの型を使えません</strong>。学会ガイドラインを土台にしていても、一部に独自の指標・アルゴリズムを組み込んで判定するものはNOと明記されています。
              </li>
            </ul>

            <h3 className={h3Class}>型③ 統計データとの比較のみ（集団リスク型）</h3>
            <p className={pClass}>
              入力された検査値等を特定の集団のデータと比較し、<strong>「類似した検査結果を持つ集団における」発症リスク</strong>を提示するものは、診断との誤認を与えない限り非該当です（別紙2 (2)D。消費者向け遺伝子検査ビジネスの整理が下敷き）。ガイドライン掲載の事例3（糖尿病の発症リスク提示）がまさにこの型で、非該当とされた理由は「<strong>集団における発症リスクであり、特定の個人を対象としていない</strong>」ことでした。
            </p>
            <p className={pClass}>
              <strong>境界線</strong>: 「あなたの発症リスクは◯%」と<strong>個人を特定して予測・判断</strong>した瞬間に、この型から外れます。
            </p>

            <h3 className={h3Class}>型④ そもそも医療・健康以外の目的</h3>
            <p className={pClass}>
              競技力向上・運動強度管理などトレーニング目的のプログラムは、診断等に使える情報を扱っていても非該当です。
            </p>
            <p className={pClass}>
              <strong>境界線</strong>: 同じ活動量データでも、心筋梗塞や熱中症の<strong>兆候検知・受診判断</strong>を意図した途端に「疾病の診断・予防」目的になります。
            </p>

            {/* 5 */}
            <h2 className={h2Class}>5. 一線を越える2大シグナル</h2>
            <p className={pClass}>逆方向から見ると、該当側に振れる典型シグナルは2つに集約されます。</p>
            <p className={pClass}>
              <strong>シグナル1: 個人を特定した疾病候補・重症度の表示。</strong>フローチャート上、個人使用・医療者使用のどちらの経路でも「入力情報を基に疾病候補を表示するか？」がYESになると医療機器側に進みます。ガイドライン掲載の事例1（皮膚病変の画像を解析し「＊＊病である可能性は＊%」と表示）は該当。<strong>現時点の状態の判定</strong>（疾病候補・重症度）は使用者を問わず該当性が強く、<strong>健常者への将来リスク提示</strong>だけが型②③の余地を残します。なお、疾病の早期発見目的で個人に疾病名と罹患可能性を表示するものは「使用者によらず、診断に用いられるものとしてリスクを判定する」とされており、<strong>「ユーザーは一般消費者だから」は防御になりません</strong>。
            </p>
            <p className={pClass}>
              <strong>シグナル2: 独自アルゴリズム（ブラックボックス）。</strong>事例2（動画等から独自アルゴリズムで認知症の将来発症リスクを提示）は、<strong>健康な人向け・将来リスクのみ</strong>でも該当とされました。理由は「医学上公知ではない独自のアルゴリズム」で「個人を特定して疾患リスクを予測・判断している」こと。<strong>AI・機械学習モデルはほぼ定義上「独自アルゴリズム」です</strong>。AIで個人のリスクを予測するサービスは、型②（公知情報）に載せることが構造的にできない——ここが、AIヘルスケアの新規参入で最も見落とされる点です。
            </p>

            {/* 6 */}
            <h2 className={h2Class}>6. よくある誤解3つ</h2>
            <ul className="list-disc pl-6 space-y-3 text-slate-700 leading-relaxed mb-5">
              <li>
                <strong>「最終判断は医師がするから医療機器ではない」→ 誤り。</strong>医師の診断補助・追加検査の推奨は「診断」を意図するものとしてクラスⅡ以上に整理されます（GHTFクラス分類ルール10）。「医師が最終判断する」は医師法上の整理（AI診断支援に関する平成30年医政局医事課長通知）の話であって、該当性を消す論理ではありません。
              </li>
              <li>
                <strong>「無償提供・研究名目なら大丈夫」→ 条件つき。</strong>医師主導の妥当な臨床研究で用いる場合には法が適用されない場合がありますが、専用の通知に沿った取扱いが必要で、一般向け提供の免罪符ではありません。
              </li>
              <li>
                <strong>「クラスⅠ相当だから対象外」→ 半分だけ正しい。</strong>クラスⅠ（一般医療機器）相当のプログラムは医療機器の範囲から除かれ、その旨の性能標ぼうも事実の範囲で可能ですが、クラスⅡ以上と認識させる標ぼうをすれば広告規制（医薬品医療機器等法68条等）に抵触し得ます。
              </li>
            </ul>

            {/* 7 */}
            <h2 className={h2Class}>7. 参入前チェック — 企画段階でやるべき5つ</h2>
            <ul className="space-y-3 mb-5">
              {preLaunchChecks.map((item) => (
                <li key={item} className="flex gap-3 text-slate-700 leading-relaxed">
                  <svg className="w-5 h-5 text-primary-600 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* 8 */}
            <h2 className={h2Class}>8. まとめ</h2>
            <p className={pClass}>
              「診断を代替しない」は、<strong>実体が非該当であることを前提にした誤認防止表示としては推奨</strong>され、<strong>実体を変える魔法の一文としては無効</strong>です。成立条件は突き詰めると「<strong>個人を特定した判定をしない</strong>」「<strong>根拠が検証可能な公知情報か、統計比較の範囲に留める</strong>」の2点であり、AIによる個人リスク予測はその外側にあります。機能仕様と訴求文言を企画段階でセットで設計すること——それが、後から承認取得か訴求全面改稿かの二択を迫られないための、最も安い保険です。
            </p>

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
              本記事は上記の一次資料に基づいて作成していますが、個別の対応判断にあたっては必ず原文をご確認ください。本記事は特定の製品・サービスの該当性を評価するものではありません。
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
              自社サービスの該当性を整理したい方へ
            </h2>
            <p className="text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
              HealthLegalは、医療・ヘルスケア領域のプロダクトの薬事・法令対応を支援しています。
              「自社のサービスは医療機器に該当するのか」「非医療機器のまま成立する訴求設計にしたい」——構想段階のご相談から対応します。初回のご相談は無料です。
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
