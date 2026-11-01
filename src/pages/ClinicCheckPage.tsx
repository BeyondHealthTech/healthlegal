import { useEffect, useMemo, useRef, useState } from "react";
import {
  ANSWER_NA,
  ANSWER_NO,
  ANSWER_UNKNOWN,
  ANSWER_YES,
  CLINIC_ITEMS,
  CLINIC_SECTIONS,
  PHYSICAL_ITEMS,
  decodeClinicAnswers,
  encodeClinicAnswers,
  evaluateClinic,
  optionsFor,
  type ClinicAnswers,
  type ClinicSection,
} from "../content/clinic-checklist";

// 医療機関・薬局向け サイバーセキュリティ自己点検（/clinic-check/）。bht-ops Issue #264。
// 設問は厚労省 令和8年度版チェックリスト（医療機関・薬局確認用）の19項目そのまま。
// 判定はブラウザ内のみで、回答は送信しない（GA4 には件数だけを送る）。
// 「はい」になっていない項目について、マニュアルの考え方・「はい」にする具体策・GL第7.0版の参照を出す。

const FORM_URL = "https://docs.google.com/forms/d/1qQRrWDUPCOeXklfna912YEs1b2DqPHap3zZ0lpoyjZI/viewform";
// 結果をメールで受け取る導線（Googleフォーム）。末尾に点検コードを付けて開くと事前入力される。
// 空文字のときはボタンを出さない。フォーム作成後に URL を入れる（bht-ops Issue #264）。
const LEAD_FORM_URL: string =
  "https://docs.google.com/forms/d/e/1FAIpQLScFeD8wn0tjV4peM1iRg61P4f_7HDpmKh1v7JVLLoHgVWupEg/viewform?usp=pp_url&entry.1129110655=";

const SECTION_ORDER: ClinicSection[] = [1, 2, 3, 4];
const TOTAL = CLINIC_ITEMS.length;

type Gtag = (cmd: "event", name: string, params?: Record<string, unknown>) => void;
function track(name: string, params?: Record<string, unknown>) {
  const g = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof g === "function") g("event", name, params);
}

function labelFor(id: string) {
  const [sec, no] = id.split("-");
  return `${sec}-${"①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭"[Number(no) - 1] ?? no}`;
}

export default function ClinicCheckPage() {
  const [answers, setAnswers] = useState<ClinicAnswers>({});
  const [step, setStep] = useState(0); // 0..3 = 章, 4 = 結果
  const [facilityName, setFacilityName] = useState("");
  const [copied, setCopied] = useState(false);
  const started = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);

  // ?code= から結果を復元（メール・相談フォームに貼られた点検コードの確認用）
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) return;
    const restored = decodeClinicAnswers(code);
    if (restored && CLINIC_ITEMS.every((i) => restored[i.id])) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- URL からの一度きりの復元
      setAnswers(restored);
      setStep(SECTION_ORDER.length);
    }
  }, []);

  const sectionItems = useMemo(
    () => SECTION_ORDER.map((s) => CLINIC_ITEMS.filter((i) => i.section === s)),
    [],
  );
  const isResult = step >= SECTION_ORDER.length;
  const result = useMemo(() => (isResult ? evaluateClinic(answers) : null), [isResult, answers]);
  const code = useMemo(() => encodeClinicAnswers(answers), [answers]);

  useEffect(() => {
    if (result) track("clinic_check_complete", { yes_count: result.yes, gap_count: result.gaps.length, na_count: result.na });
  }, [result]);

  const answer = (id: string, value: string) => {
    if (!started.current) {
      started.current = true;
      track("clinic_check_start");
    }
    setAnswers((a) => ({ ...a, [id]: value }));
  };

  const go = (next: number) => {
    setStep(next);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const currentItems = isResult ? [] : sectionItems[step];
  const stepComplete = currentItems.every((i) => answers[i.id]);
  const today = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });

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
              医療機関・薬局向け／無料・登録不要・約5分
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-5">
              サイバーセキュリティ対策チェックリスト
              <span className="block text-xl sm:text-2xl mt-2 text-primary-700">令和8年度版 19項目 自己点検</span>
            </h1>
            <p className="text-slate-600 leading-relaxed">
              厚生労働省「医療機関・薬局におけるサイバーセキュリティ対策チェックリスト（令和8年6月）」の19項目に答えると、
              「はい」になっていない項目ごとに、立入検査での見られ方・「はい」にするための具体策・ガイドライン第7.0版の参照箇所をまとめて表示します。
              回答はブラウザ内で判定し、送信されません。
            </p>
          </div>
        </section>

        <div ref={topRef} className="scroll-mt-20" />

        {!isResult && (
          <section className="px-4 sm:px-6 pb-20">
            <div className="max-w-3xl mx-auto">
              <ol className="flex gap-1.5 mb-8" aria-label="進捗">
                {SECTION_ORDER.map((s, i) => (
                  <li key={s} className="flex-1">
                    <div className={`h-1.5 rounded-full ${i <= step ? "bg-primary-600" : "bg-slate-200"}`} />
                    <p className={`mt-2 text-xs ${i === step ? "font-bold text-primary-700" : "text-slate-400"} hidden sm:block`}>
                      {s} {CLINIC_SECTIONS[s]}
                    </p>
                  </li>
                ))}
              </ol>
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                {SECTION_ORDER[step]}. {CLINIC_SECTIONS[SECTION_ORDER[step]]}
                <span className="ml-3 text-sm font-normal text-slate-500">{currentItems.length}項目</span>
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                チェックリスト原文のまま並べています。現状を「はい／いいえ」で、確認できていなければ「未確認」を選んでください。
              </p>

              {step === 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 mb-5">
                  <label className="block font-semibold text-slate-900 mb-2" htmlFor="facility">
                    施設名（任意・結果の表示と印刷にのみ使用）
                  </label>
                  <input
                    id="facility"
                    type="text"
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="例: ○○クリニック"
                    autoComplete="off"
                  />
                </div>
              )}

              <div className="space-y-5">
                {currentItems.map((item) => (
                  <fieldset key={item.id} className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
                    <legend className="sr-only">項目{item.id}</legend>
                    <div className="flex items-start gap-3 mb-2">
                      <span className="shrink-0 text-xs font-mono font-semibold text-primary-700 bg-primary-50 border border-primary-100 rounded px-2 py-1">
                        {labelFor(item.id)}
                      </span>
                      <p className="font-semibold text-slate-900 leading-relaxed">{item.text}</p>
                    </div>
                    <p className="text-xs text-slate-500 mb-4 ml-1">
                      {item.scope && <span className="mr-3">対象: {item.scope}</span>}
                      {item.physical && <span className="text-amber-700 font-semibold">立入検査で現物確認（{item.physical}）</span>}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {optionsFor(item).map((opt) => {
                        const selected = answers[item.id] === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => answer(item.id, opt)}
                            aria-pressed={selected}
                            className={`text-left px-4 py-3 rounded-lg border text-sm leading-snug transition-colors ${
                              opt === ANSWER_NA ? "sm:col-span-3" : ""
                            } ${
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
                  {stepComplete ? "" : "すべての項目に回答してください（分からない場合は「未確認」）"}
                </p>
                <button
                  type="button"
                  onClick={() => go(step + 1)}
                  disabled={!stepComplete}
                  className="px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:bg-slate-300"
                >
                  {step === SECTION_ORDER.length - 1 ? "結果を見る" : "次へ"}
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
                  {facilityName ? `${facilityName} の` : ""}自己点検結果（令和8年度版チェックリスト・医療機関・薬局確認用）
                  <span className="hidden print:inline">（点検日 {today}）</span>
                </p>
                <p className="text-slate-900 text-lg sm:text-xl leading-relaxed">
                  {TOTAL}項目中 <span className="text-4xl sm:text-5xl font-bold text-primary-600 mx-1">{result.yes}</span>
                  項目が「はい」です
                </p>
                {result.gaps.length > 0 ? (
                  <p className="mt-4 text-slate-700">
                    令和8年度中に全項目「はい」にするまで、あと
                    <span className="text-2xl font-bold text-accent-600 mx-1">{result.gaps.length}</span>項目
                  </p>
                ) : (
                  <p className="mt-4 text-slate-700">全項目が「はい」です。確認日を記入したチェックリストと、現物4点を立入検査までに揃えておきましょう。</p>
                )}
                <p className="mt-2 text-xs text-slate-500">
                  内訳: いいえ {result.no} 項目／未確認 {result.unknown} 項目
                  {result.na > 0 && `／該当なし ${result.na} 項目（事業者と保守契約がない場合。その機器の保守責任は医療機関側にあります）`}
                </p>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-3">立入検査で現物を確認される4点</h2>
              <p className="text-sm text-slate-600 mb-4">
                マニュアルは、2-①の台帳・3-①の連絡体制図・3-③のBCP・4-①の規程類について、立入検査で現物を確認すると明記しています。
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {PHYSICAL_ITEMS.map((item) => {
                  const ok = answers[item.id] === ANSWER_YES;
                  return (
                    <li
                      key={item.id}
                      className={`rounded-xl border p-4 flex items-start gap-3 ${
                        ok ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"
                      }`}
                    >
                      <span className={`text-lg font-bold ${ok ? "text-emerald-700" : "text-amber-700"}`}>{ok ? "✓" : "！"}</span>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {labelFor(item.id)} {item.physical}
                        </p>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {ok ? "用意できています。確認日と改定日を記入しておきましょう。" : `現在の回答: ${answers[item.id] ?? "未回答"}。立入検査までに作成が必要です。`}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {result.gaps.length > 0 && (
                <>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">「はい」になっていない {result.gaps.length} 項目と、「はい」にする手順</h2>
                  <p className="text-sm text-slate-600 mb-5">
                    考え方はチェックリストマニュアル（令和8年6月）の該当節の要約、参照はガイドライン第7.0版の編・章です。
                  </p>
                  <div className="space-y-4 mb-10">
                    {result.gaps.map((item) => (
                      <article key={item.id} className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 break-inside-avoid">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-xs font-mono font-semibold text-primary-700 bg-primary-50 border border-primary-100 rounded px-2 py-1">
                            {labelFor(item.id)}
                          </span>
                          <span
                            className={`text-xs font-semibold rounded-full px-2.5 py-0.5 border ${
                              answers[item.id] === ANSWER_NO
                                ? "bg-rose-50 text-rose-800 border-rose-200"
                                : "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            {answers[item.id] === ANSWER_NO ? ANSWER_NO : ANSWER_UNKNOWN}
                          </span>
                          {item.physical && (
                            <span className="text-xs font-semibold rounded-full px-2.5 py-0.5 border bg-amber-50 text-amber-800 border-amber-200">
                              立入検査で現物確認
                            </span>
                          )}
                        </div>
                        <p className="font-semibold text-slate-900 leading-relaxed mb-3">{item.text}</p>
                        <p className="text-sm text-slate-700 leading-relaxed mb-3">
                          <span className="font-semibold text-slate-900">考え方: </span>
                          {item.why}
                        </p>
                        <p className="text-sm font-semibold text-slate-900 mb-1">「はい」にするには</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700 leading-relaxed mb-3">
                          {item.how.map((h) => (
                            <li key={h}>{h}</li>
                          ))}
                        </ul>
                        <p className="text-xs text-slate-500">
                          参照: ガイドライン第7.0版 {item.gl.join("／")} ／ チェックリストマニュアル p.{item.manualPage}
                        </p>
                      </article>
                    ))}
                  </div>
                </>
              )}

              <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 mb-8">
                <h2 className="font-bold text-slate-900 mb-2">次にやること</h2>
                <ol className="list-decimal pl-5 space-y-1.5 text-sm text-slate-700 leading-relaxed">
                  <li>
                    この結果を印刷またはPDF保存し、「いいえ」の項目には<strong>令和8年度中の対応目標日</strong>を決めて厚労省の様式（Excel）に転記する。
                  </li>
                  <li>
                    システムを提供している事業者ごとに<strong>「事業者確認用」チェックリスト</strong>を送り、回答と MDS/SDS を回収する。
                    「対象外」と回答された項目は医療機関側の責任になるので、認識が合っているか確認する。
                  </li>
                  <li>現物4点（台帳・連絡体制図・BCP・運用管理規程）を揃え、年1回この点検を繰り返す。</li>
                </ol>
              </div>

              <div className="bg-primary-950 text-white rounded-2xl p-6 sm:p-10 mb-8 print:hidden">
                <h2 className="text-xl sm:text-2xl font-bold mb-3">結果を手元に残す</h2>
                <p className="text-primary-100 leading-relaxed mb-6">
                  印刷すると、点検日・「はい」の数・現物4点の状態・残り項目ごとの手順が A4 数ページにまとまります。
                  事業者への依頼や院内の打ち合わせにそのまま使えます。
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      track("clinic_check_cta", { cta: "print" });
                      window.print();
                    }}
                    className="inline-flex justify-center items-center px-6 py-3.5 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600"
                  >
                    結果を印刷 / PDF保存
                  </button>
                  {LEAD_FORM_URL && (
                    <a
                      href={`${LEAD_FORM_URL}${code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track("clinic_check_cta", { cta: "mail" })}
                      className="inline-flex justify-center items-center px-6 py-3.5 rounded-lg border border-primary-300 text-white font-semibold hover:bg-primary-900"
                    >
                      結果をメールで受け取る
                    </a>
                  )}
                  <a
                    href={FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("clinic_check_cta", { cta: "consult" })}
                    className="inline-flex justify-center items-center px-6 py-3.5 rounded-lg border border-primary-300 text-white font-semibold hover:bg-primary-900"
                  >
                    進め方を相談する（無料）
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 mb-8 flex flex-col sm:flex-row sm:items-center gap-3">
                <p className="text-sm text-slate-600 shrink-0">点検コード</p>
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

              <div className="rounded-xl border border-slate-200 bg-slate-100 p-5 mb-8 print:hidden">
                <p className="text-sm font-semibold text-slate-900 mb-1">システムを提供している事業者の方へ</p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  医療機関から「事業者確認用」チェックリストと MDS/SDS の提出を求められたら、
                  <a href="../sds-check/" className="text-primary-700 underline font-semibold">SDS ギャップ診断（99項目・無料）</a>
                  で、現在の構成でどこまで「はい／対象外」と答えられるかを確認できます。
                </p>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-500 leading-relaxed">
                <li>※ 回答から機械的に整理した自己点検の補助です。立入検査の結果や、ガイドラインへの準拠を保証するものではありません。</li>
                <li>
                  ※ 出所: 厚生労働省「医療機関・薬局におけるサイバーセキュリティ対策チェックリスト」および同マニュアル（令和8年6月）、
                  「医療情報システムの安全管理に関するガイドライン 第7.0版」。設問文は原文のままです。
                </li>
                <li>※ 二要素認証（2-⑪・2-⑫）は「令和9年度以降の初回システム更改時に実装予定」でも「はい」にできます。</li>
                <li>※ 事業者と保守契約がない機器については、2-②・2-③の確認は求められません（その機器の保守責任は医療機関側にあります）。</li>
              </ul>

              <div className="mt-8 flex flex-wrap gap-3 print:hidden">
                <button
                  type="button"
                  onClick={() => go(0)}
                  className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold"
                >
                  回答を見直す
                </button>
                <a href="../articles/clinic-cyber-checklist-r8/" className="px-5 py-2.5 rounded-lg text-primary-700 text-sm font-semibold hover:underline">
                  令和8年度版チェックリストの解説記事を読む
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
