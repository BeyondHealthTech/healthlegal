const FORM_URL = "https://docs.google.com/forms/d/1qQRrWDUPCOeXklfna912YEs1b2DqPHap3zZ0lpoyjZI/viewform";

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 bg-slate-900">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          お問い合わせ
        </h2>
        <p className="text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
          ガイドライン対応・セキュリティ設計・開発支援に関するご相談は、
          お気軽にお問い合わせください。初回のご相談は無料です。
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
      </div>
    </section>
  );
}
