// 機能構成図（bht-saas-kit compliance/feature_map.py の生成物の写し。/3m2g/ と同じファイルを使う）
export default function FeatureMap() {
  return (
    <section className="py-20 px-4 sm:px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-sm font-bold tracking-wider text-primary-700 mb-3">高水準のセキュリティ</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">
          医療機関の審査で問われる機能を、あらかじめ搭載
        </h2>
        <p className="text-slate-600 text-center leading-relaxed max-w-3xl mx-auto mb-10">
          二要素認証、改ざんできない監査ログ、医療機関ごとのデータ分離など、SDS で確認されるセキュリティ機能を基盤に組み込んでいます。
          貴社は業務機能の開発に専念できます。
        </p>
        <a href="./3m2g/#feature-map" className="hidden md:block">
          <img
            src="./img/feature-map.svg"
            alt="機能構成図: 利用者、Webアプリの画面、貴社の業務機能が載る位置、AWS上の各機能、文書パック"
            width={1600}
            height={900}
            loading="lazy"
            className="w-full h-auto rounded-xl border border-slate-200 bg-white shadow-sm"
          />
        </a>
        <a href="./3m2g/#feature-map" className="md:hidden relative block rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden max-h-[30rem]">
          <img
            src="./img/feature-map-mobile.svg"
            alt="機能構成図（縦長版）: Webアプリの画面、貴社の業務機能が載る位置、AWS上の各機能、文書パック"
            width={720}
            height={3894}
            loading="lazy"
            className="w-full h-auto"
          />
          <span className="absolute inset-x-0 bottom-0 pt-16 pb-4 bg-gradient-to-t from-white via-white/95 to-transparent text-center text-sm font-semibold text-primary-700">
            機能構成の全体を見る →
          </span>
        </a>
        <p className="mt-6 text-center">
          <a href="./3m2g/" className="text-sm font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-800">
            対応パッケージの内容と料金を見る
          </a>
        </p>
      </div>
    </section>
  );
}
