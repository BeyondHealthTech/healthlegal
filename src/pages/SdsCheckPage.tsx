import { useEffect, useMemo, useRef, useState } from "react";
import rulesData from "../generated/sds-rules.json";
import { SDS_GROUPS, SDS_QUESTIONS, type SdsGroup } from "../content/sds-questions";
import { decodeAnswers, encodeAnswers, evaluate, type Answers, type SdsRule } from "../lib/sdsEngine";

// SDSギャップ診断（/sds-check/）。設計: bht-ops docs/sds-generator-design.md 0.5章。
// 無料で見せるのは「件数」と「ギャップ項目の一覧＋埋まる手段のカテゴリ」まで。
// 項目ごとの回答・根拠・埋め方は S1 SDS回答パックの納品物なので、このページには出さない（ルール表からも除外済み）。
// 判定はブラウザ内のみ。回答は送信しない（GA4 には件数だけを送る）。

const FORM_URL = "https://docs.google.com/forms/d/1qQRrWDUPCOeXklfna912YEs1b2DqPHap3zZ0lpoyjZI/viewform";
// 結果をメールで受け取る導線（Googleフォーム）。URL が決まったら設定する。空のあいだはボタンを出さない。
const LEAD_FORM_URL: string = "";

const rules = rulesData as SdsRule[];
const GROUP_ORDER: SdsGroup[] = ["A", "B", "C", "D", "E"];

const CATEGORY: Record<string, { label: string; tone: string }> = {
  S2: { label: "規程・手順の整備で埋まる", tone: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  S3: { label: "設計判断で埋まる", tone: "bg-sky-50 text-sky-800 border-sky-200" },
  S4: { label: "実装で埋まる", tone: "bg-violet-50 text-violet-800 border-violet-200" },
  厳密版: { label: "個別設計が必要（閉域・証明書・実装強化）", tone: "bg-amber-50 text-amber-800 border-amber-200" },
  S1: { label: "個別確認が必要", tone: "bg-slate-100 text-slate-700 border-slate-200" },
};
const categoryOf = (product: string) => CATEGORY[product] ?? CATEGORY.S1;
const CATEGORY_ORDER = ["S2", "S3", "S4", "厳密版", "S1"];

type Gtag = (cmd: "event", name: string, params?: Record<string, unknown>) => void;
function track(name: string, params?: Record<string, unknown>) {
  const g = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof g === "function") g("event", name, params);
}

export default function SdsCheckPage() {
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0); // 0..4 = 設問グループ, 5 = 結果
  const [serviceName, setServiceName] = useState("");
  const [copied, setCopied] = useState(false);
  const started = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);

  // ?code= から結果を復元（相談フォームに貼られた診断コードの確認用）
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) return;
    const restored = decodeAnswers(SDS_QUESTIONS, code);
    if (restored && SDS_QUESTIONS.every((q) => restored[String(q.id)])) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- URL からの一度きりの復元
      setAnswers(restored);
      setStep(GROUP_ORDER.length);
    }
  }, []);

  const groupQs = useMemo(
    () => GROUP_ORDER.map((g) => SDS_QUESTIONS.filter((q) => q.group === g)),
    [],
  );
  const isResult = step >= GROUP_ORDER.length;
  const result = useMemo(() => (isResult ? evaluate(rules, answers) : null), [isResult, answers]);
  const code = useMemo(() => encodeAnswers(SDS_QUESTIONS, answers), [answers]);

  useEffect(() => {
    if (result) track("sds_check_complete", { yes_count: 99 - result.remaining, gap_count: result.remaining });
  }, [result]);

  const answer = (qid: number, value: string) => {
    if (!started.current) {
      started.current = true;
      track("sds_check_start");
    }
    setAnswers((a) => ({ ...a, [String(qid)]: value }));
  };

  const go = (next: number) => {
    setStep(next);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const currentQs = isResult ? [] : groupQs[step];
  const stepComplete = currentQs.every((q) => answers[String(q.id)]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200 print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <a href="../" className="text-xl font-bold text-primary-700">HealthLegal</a>
          <a
            href={FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            無料相談
          </a>
        </div>
      </header>

      <main className="bg-slate-50 min-h-screen">
        <section className="py-14 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-primary-50 to-slate-50 print:hidden">
          <div className="max-w-3xl mx-auto text-center">
            <p className="inline-block px-4 py-1.5 bg-primary-100 border border-primary-200 text-primary-800 rounded-full text-sm font-bold mb-6">
              無料・登録不要・約3分
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-5">SDS ギャップ診断</h1>
            <p className="text-slate-600 leading-relaxed">
              医療機関から求められる MDS/SDS（第7.0版 別紙 99項目）に、貴社の構成でどこまで「はい／対象外」と答えられるかを
              3 分で診断します。入力は構成の事実だけ。回答はブラウザ内で判定し、送信されません。
            </p>
          </div>
        </section>

        <div ref={topRef} className="scroll-mt-20" />

        {!isResult && (
          <section className="px-4 sm:px-6 pb-20">
            <div className="max-w-3xl mx-auto">
              <ol className="flex gap-1.5 mb-8" aria-label="進捗">
                {GROUP_ORDER.map((g, i) => (
                  <li key={g} className="flex-1">
                    <div className={`h-1.5 rounded-full ${i <= step ? "bg-primary-600" : "bg-slate-200"}`} />
                    <p className={`mt-2 text-xs ${i === step ? "font-bold text-primary-700" : "text-slate-400"} hidden sm:block`}>
                      {SDS_GROUPS[g]}
                    </p>
                  </li>
                ))}
              </ol>
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                {step + 1}/{GROUP_ORDER.length}{" "}{SDS_GROUPS[GROUP_ORDER[step]]}
              </h2>

              {step === 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 mb-5">
                  <label className="block font-semibold text-slate-900 mb-2" htmlFor="svc">
                    サービス名（任意・結果の表示にのみ使用）
                  </label>
                  <input
                    id="svc"
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="例: ○○クラウド"
                    autoComplete="off"
                  />
                </div>
              )}

              <div className="space-y-5">
                {currentQs.map((q) => (
                  <fieldset key={q.id} className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
                    <legend className="sr-only">設問{q.id}</legend>
                    <p className="font-semibold text-slate-900 leading-relaxed mb-2">{q.text}</p>
                    {q.help && <p className="text-sm text-slate-500 leading-relaxed mb-4">{q.help}</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt) => {
                        const selected = answers[String(q.id)] === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => answer(q.id, opt)}
                            aria-pressed={selected}
                            className={`text-left px-4 py-3.5 rounded-lg border text-sm leading-snug transition-colors ${
                              selected
                                ? "border-primary-600 bg-primary-50 text-primary-900 font-semibold ring-1 ring-primary-600"
                                : "border-slate-300 bg-white text-slate-700 hover:border-primary-400"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => go(step - 1)}
                  disabled={step === 0}
                  className="px-5 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold disabled:opacity-30"
                >
                  戻る
                </button>
                <p className="text-xs text-slate-500 text-center">
                  {stepComplete ? "" : "すべての設問に回答してください（分からない場合は「わからない」）"}
                </p>
                <button
                  type="button"
                  onClick={() => go(step + 1)}
                  disabled={!stepComplete}
                  className="px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:bg-slate-300"
                >
                  {step === GROUP_ORDER.length - 1 ? "結果を見る" : "次へ"}
                </button>
              </div>
            </div>
          </section>
        )}

        {result && (
          <section className="px-4 sm:px-6 pb-20" id="result">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 text-center mb-8">
                <p className="text-sm font-semibold text-primary-700 mb-3">
                  {serviceName ? `${serviceName} の` : ""}診断結果（第7.0版 別紙 MDS 41・SDS 58）
                </p>
                <p className="text-slate-900 text-lg sm:text-xl leading-relaxed">
                  99項目中 <span className="text-4xl sm:text-5xl font-bold text-primary-600 mx-1">{99 - result.remaining}</span>
                  件は「はい／対象外」で回答できます
                </p>
                <p className="mt-4 text-slate-700">
                  選定基準（全項目が はい／対象外）まで、あと
                  <span className="text-2xl font-bold text-accent-600 mx-1">{result.remaining}</span>件
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  内訳: いいえ {result.counts["いいえ"]} 件／要確認 {result.counts["要確認"]} 件（「わからない」と答えた設問に関わる項目は要確認になります）
                </p>
              </div>

              {result.remaining > 0 && (
                <>
                  <h2 className="text-xl font-bold text-slate-900 mb-4">残りの {result.remaining} 件は、何で埋まるか</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
                    {CATEGORY_ORDER.map((k) => {
                      const n = result.gaps.filter((g) => categoryOf(g.埋まる商品) === CATEGORY[k]).length;
                      return (
                        <div key={k} className={`rounded-xl border p-4 ${CATEGORY[k].tone} ${n === 0 ? "opacity-40" : ""}`}>
                          <p className="text-3xl font-bold">{n}</p>
                          <p className="text-xs font-semibold leading-snug mt-1">{CATEGORY[k].label}</p>
                        </div>
                      );
                    })}
                  </div>

                  <h3 className="font-bold text-slate-900 mb-3">ギャップ項目の一覧</h3>
                  <ul className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 mb-10">
                    {result.gaps.map((g) => {
                      const c = categoryOf(g.埋まる商品);
                      return (
                        <li key={`${g.様式}-${g.No}-${g.設問要旨}`} className="px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                          <span className="text-xs font-mono text-slate-500 shrink-0 sm:w-36">
                            {g.様式} {g.No}
                          </span>
                          <span className="text-sm text-slate-800 flex-1">{g.設問要旨}</span>
                          <span className={`self-start sm:self-auto text-xs font-semibold border rounded-full px-2.5 py-0.5 ${c.tone}`}>
                            {c.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}

              <div className="bg-primary-950 text-white rounded-2xl p-6 sm:p-10 mb-8 print:hidden">
                <h2 className="text-xl sm:text-2xl font-bold mb-3">この結果をもとに、SDS 回答草案を作りませんか</h2>
                <p className="text-primary-100 leading-relaxed mb-2">
                  <strong className="text-white">SDS回答パック 30万円（税別）・5営業日。</strong>
                  ヒアリング1回で「要確認」を確定し、99項目すべての回答草案と根拠、
                  ギャップ項目ごとの埋め方（どの規程・設計・実装で「はい」にするか）を納品します。
                </p>
                <p className="text-primary-200 text-sm mb-6">相談フォームに下の「診断コード」を貼っていただくと、診断結果を前提にお話しできます。</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("sds_check_cta", { cta: "request" })}
                    className="inline-flex justify-center items-center px-6 py-3.5 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600"
                  >
                    この結果をもとに SDS 回答草案を依頼する
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      track("sds_check_cta", { cta: "print" });
                      window.print();
                    }}
                    className="px-6 py-3.5 rounded-lg border border-primary-300 text-white font-semibold hover:bg-primary-900"
                  >
                    結果を印刷 / PDF保存
                  </button>
                  {LEAD_FORM_URL && (
                    <a
                      href={`${LEAD_FORM_URL}${LEAD_FORM_URL.includes("?") ? "&" : "?"}code=${code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track("sds_check_cta", { cta: "mail" })}
                      className="inline-flex justify-center items-center px-6 py-3.5 rounded-lg border border-primary-300 text-white font-semibold hover:bg-primary-900"
                    >
                      結果をメールで受け取る
                    </a>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 mb-8 flex flex-col sm:flex-row sm:items-center gap-3">
                <p className="text-sm text-slate-600 shrink-0">診断コード</p>
                <code className="font-mono text-base tracking-wider text-slate-900 break-all flex-1">{code}</code>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(code);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    } catch {
                      /* クリップボード不可の環境では手で選択してもらう */
                    }
                  }}
                  className="self-start px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-700 font-semibold print:hidden"
                >
                  {copied ? "コピーしました" : "コピー"}
                </button>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-500 leading-relaxed">
                <li>※ 入力された事実から機械的に導いた目安です。3省2ガイドラインへの準拠を保証するものではありません。</li>
                <li>※ 医療機関に提出する前に、人による確認を推奨します。</li>
                <li>※ 対象: 医療情報システムの安全管理に関するガイドライン 第7.0版 保守委託機関編 別紙（MDS 41項目・SDS 58項目）。</li>
                <li>※ 価格は税別です。</li>
              </ul>

              <div className="mt-8 flex flex-wrap gap-3 print:hidden">
                <button
                  type="button"
                  onClick={() => go(0)}
                  className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold"
                >
                  回答を見直す
                </button>
                <a href="../3m2g/#pricing" className="px-5 py-2.5 rounded-lg text-primary-700 text-sm font-semibold hover:underline">
                  料金と提供内容を見る
                </a>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="py-8 px-6 bg-slate-950 print:hidden">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} Beyond HealthTech合同会社</p>
        </div>
      </footer>
    </>
  );
}
