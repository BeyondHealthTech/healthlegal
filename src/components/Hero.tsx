export default function Hero() {
  return (
    <section className="pt-32 pb-24 px-6 bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-primary-600 font-semibold text-sm tracking-wide mb-4">
          Beyond HealthTech
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
          医療情報ガイドライン対応を、
          <br />
          技術で解決する
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          3省2ガイドライン対応 × セキュリティ × 開発支援
        </p>
        <a
          href="#contact"
          className="inline-block px-8 py-4 bg-accent-500 text-white text-lg font-semibold rounded-lg hover:bg-accent-600 transition-colors shadow-lg shadow-accent-500/25"
        >
          まずは相談する
        </a>
      </div>
    </section>
  );
}
