export default function Footer() {
  return (
    <footer className="py-8 px-6 bg-slate-950">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Beyond HealthTech合同会社
        </p>
      </div>
    </footer>
  );
}
