// プライバシーポリシー（個人情報の取扱い）ページ。
// 問い合わせフォーム・リードマグネット診断フォームからリンクする共通ポリシーページ。
// 記事ページ（ArticleGl70Page）と同じ「器」のスタイルを流用している。

const h2Class = "text-xl sm:text-2xl font-bold text-slate-900 mt-12 mb-4 leading-snug";
const pClass = "text-slate-700 leading-relaxed mb-4";
const liClass = "text-slate-700 leading-relaxed";

const LAST_UPDATED = "2026年8月21日";

export default function PrivacyPage() {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="../" className="text-xl font-bold text-primary-700">
            HealthLegal
          </a>
          <a
            href="../#contact"
            className="px-5 py-2 bg-accent-500 text-white text-sm font-semibold rounded-lg hover:bg-accent-600 transition-colors"
          >
            お問い合わせ
          </a>
        </div>
      </header>

      <main className="bg-white">
        <article className="max-w-3xl mx-auto px-6 py-14">
          <p className="text-sm text-primary-700 font-semibold mb-3">HealthLegal</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-4">
            プライバシーポリシー
          </h1>
          <p className="text-sm text-slate-500 mb-2">最終更新日: {LAST_UPDATED}</p>
          <p className={pClass}>
            Beyond HealthTech合同会社（以下「当社」といいます）は、当社が運営するウェブサイト HealthLegal
            （以下「本サイト」といいます）における個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます）を定めます。
          </p>

          <h2 className={h2Class}>1. 取得する情報</h2>
          <p className={pClass}>
            当社は、本サイトの問い合わせフォームおよびセルフチェック診断フォームを通じて、以下の情報を取得することがあります。
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li className={liClass}>メールアドレス</li>
            <li className={liClass}>お名前・会社名／組織名（任意でご入力いただいた場合）</li>
            <li className={liClass}>
              お問い合わせ内容、およびセルフチェック診断フォームでご回答いただいた自社の対応状況に関する自己申告情報
            </li>
          </ul>
          <p className={pClass}>
            当社は、患者・利用者ご本人の医療情報など、要配慮個人情報を本サイトのフォームで取得することはありません。診断フォームで取得するのは、あくまで回答者の連絡先と、御社自身のセキュリティ対応状況の自己申告のみです。
          </p>

          <h2 className={h2Class}>2. 利用目的</h2>
          <p className={pClass}>取得した情報は、以下の目的の範囲内で利用します。</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li className={liClass}>お問い合わせへの回答・ご連絡のため</li>
            <li className={liClass}>セルフチェック診断の結果および関連資料の送付のため</li>
            <li className={liClass}>当社が提供するサービス（ガイドライン対応支援・セキュリティ設計・開発支援等）のご案内のため</li>
            <li className={liClass}>本サイトおよび当社サービスの改善のため</li>
          </ul>
          <p className={pClass}>
            上記の目的を超えて情報を利用する場合は、あらかじめご本人の同意を得るものとします。
          </p>

          <h2 className={h2Class}>3. 第三者提供</h2>
          <p className={pClass}>
            当社は、法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。
          </p>

          <h2 className={h2Class}>4. 外部サービスの利用</h2>
          <p className={pClass}>
            当社は、本サイトの運営にあたり以下の外部サービスを利用しています。これらのサービスにおける情報の取扱いは、各提供者の定めるポリシーに従います。
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li className={liClass}>
              <span className="font-semibold">Google フォーム／Google Workspace</span>
              （お問い合わせ・診断フォームの受付および回答の保管）
            </li>
            <li className={liClass}>
              <span className="font-semibold">Google Analytics</span>
              （アクセス状況の把握）。本サービスは Cookie を利用してアクセス情報を収集しますが、これらは個人を特定するものではありません。Cookie
              の利用はブラウザの設定で無効化できます。
            </li>
          </ul>

          <h2 className={h2Class}>5. 安全管理</h2>
          <p className={pClass}>
            当社は、取得した個人情報の漏えい・滅失・毀損の防止その他の安全管理のために必要かつ適切な措置を講じます。
          </p>

          <h2 className={h2Class}>6. 開示・訂正・削除等の請求</h2>
          <p className={pClass}>
            ご本人から、当社が保有する個人情報の開示・訂正・利用停止・削除等のご請求があった場合は、ご本人であることを確認のうえ、法令に従い合理的な範囲で速やかに対応します。ご請求は、下記のお問い合わせ窓口までご連絡ください。
          </p>

          <h2 className={h2Class}>7. 本ポリシーの変更</h2>
          <p className={pClass}>
            当社は、必要に応じて本ポリシーを変更することがあります。変更後の本ポリシーは、本サイトに掲載した時点から効力を生じるものとします。
          </p>

          <h2 className={h2Class}>8. お問い合わせ窓口</h2>
          <p className={pClass}>
            本ポリシーおよび個人情報の取扱いに関するお問い合わせは、本サイトの
            <a href="../#contact" className="text-primary-600 hover:text-primary-700 underline">
              お問い合わせフォーム
            </a>
            よりご連絡ください。
          </p>
          <div className="mt-8 rounded-lg bg-slate-50 border border-slate-200 px-5 py-4">
            <p className="text-slate-800 font-semibold">Beyond HealthTech合同会社</p>
            <p className="text-sm text-slate-500">Beyond HealthTech LLC</p>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-200">
            <a href="../" className="text-primary-600 hover:text-primary-700 underline text-sm">
              ← HealthLegal トップへ戻る
            </a>
          </div>
        </article>
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
