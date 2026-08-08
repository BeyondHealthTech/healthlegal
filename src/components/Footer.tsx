export default function Footer() {
  return (
    <footer className="py-8 px-6 bg-slate-950">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-slate-400 text-sm mb-3">
          解説記事:{" "}
          <a
            href="./articles/guideline-7-0-summary/"
            className="text-slate-300 underline hover:text-white"
          >
            医療情報システム安全管理ガイドライン第7.0版（2026年6月）改訂まとめ
          </a>
        </p>
        <p className="text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Beyond HealthTech合同会社
        </p>
      </div>
    </footer>
  );
}
