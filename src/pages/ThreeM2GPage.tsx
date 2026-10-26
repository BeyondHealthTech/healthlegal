import { useEffect } from "react";

const FORM_URL = "https://docs.google.com/forms/d/1qQRrWDUPCOeXklfna912YEs1b2DqPHap3zZ0lpoyjZI/viewform";

const stats = [
  { number: "416 → 約50", label: "検討項目数", desc: "対象外167件は設計選択で消え、196件は標準回答で即答。個別検討は差分だけ" },
  { number: "40%", label: "設計の工夫で対象外にできる項目", desc: "当社のアーキテクチャ設計ノウハウにより、416項目のうち167件は対応自体を不要にできる" },
  { number: "70", label: "文書ひな形", desc: "規程・計画・サービス文書・手順35 ＋ AWS詳細設計書35。ゼロから書かない" },
];

const sources = [
  {
    title: "対応しない、を先に設計する",
    body: "全416項目のうち167件（40%）は、アーキテクチャ設計の工夫により対象外にできます。「頑張って対応する」前に「対応が要らない形を選ぶ」——どの設計選択がどの項目を不要にするかの対応表を当社は持っており、構成のご提案とセットで適用します。",
  },
  {
    title: "検討済みの標準回答416項目",
    body: "ガイドライン416項目のすべてに、当社標準のクラウド構成を前提とした対応方針を用意。法解釈だけでなく、CloudTrail・Cognito・WAF・GuardDutyなどAWSの設定レベルまで具体化されており、実装指示書としてそのまま使えます。ゼロからの検討が差分レビューに変わります。",
  },
  {
    title: "文書ひな形70ファイル",
    body: "運用管理規程・アクセス管理規定・DR計画・SLA・リリースフローなどの規程・計画・サービス文書・手順35ファイルと、IAM・ログ監査・監視・ネットワーク・ストレージの詳細設計書35ファイル（AWSの設定値レベルまで記述）。規程は「ガイドライン要件ID → 要求 → 対応条文」の構造で、どの条文がどの要件を満たすか追えます。",
  },
  {
    title: "監査に耐えるトレーサビリティ",
    body: "ガイドライン要件 → 対応方針 → 規程条文 → AWS設定までが一本の線で繋がります。医療機関からの照会や監査への回答が速く、担当者が変わっても判断根拠が失われません。",
  },
];

const deliverables = [
  "対策項目マスタ（416項目・厚労省ガイドラインへの条文参照371件の構造化データ。経産省・総務省ガイドライン第2.0版 別紙2 と項目単位で一致を機械確認済み）",
  "標準回答集（当社標準のクラウド構成前提・対象外判断の根拠つき）",
  "対応検討シート（貴社プロダクト向けにカスタマイズ）",
  "運用文書一式（規程・計画・サービス文書・手順 35ファイル）",
  "セキュリティ詳細設計書一式（IAM・ログ監査・監視・NW・ストレージ 35ファイル、AWS設定値レベル）",
  "サービス仕様適合開示書・サービス仕様書のひな形",
  "利用者認証方式規程のひな形（二要素認証の対応ロードマップ・代替手段・医療機関等との合意事項）",
];

// ボリュームの階段（正本: bht-ops docs/3m2g-volume-framing.md 1章。数字を変えるときは正本から写す）
const volumeHeadline = [
  { number: "416", label: "対策項目", desc: "経産省・総務省ガイドライン 別紙2。事業者が対応する管理単位" },
  { number: "99", label: "医療機関の確認事項", desc: "厚労省ガイドライン第7.0版 MDS 41＋SDS 58。医療機関はこれで事業者を選定する" },
  { number: "いいえ 0", label: "当社標準回答の見込み", desc: "99項目のうち94項目が「はい」または「対象外」、5項目は製品ごとに判断" },
];
const volumeLadder = [
  { number: "416", label: "対策項目（経産省・総務省ガイドライン 別紙2）", desc: "遵守事項◎384・推奨〇32。管理単位として数えるとこの数" },
  { number: "371", label: "厚労省ガイドラインの条文参照", desc: "416項目のうち343項目に、企画管理編149・システム運用編222の条文が結線されている" },
  { number: "99", label: "医療機関からの確認事項（MDS 41＋SDS 58）", desc: "厚労省ガイドライン第7.0版 保守委託機関編【別紙】。医療機関はこれで事業者を選定する" },
  { number: "160", label: "JAHIS SDS Ver.5.0 の設問", desc: "商談で実際に提出を求められる開示書の様式" },
  { number: "約90", label: "落とし込む文書（当社が用意済み）", desc: "規程・計画・手順35＋AWS詳細設計書35＋案件別文書パック19。貴社が埋めるのは差し込み欄110箇所で、導入先に合わせた書き換えも当社が行います" },
];

// GA4: ブロックの表示とフォーム到達の比率を見るためのイベント（2週間で効果判断）。gtag は 3m2g/index.html で定義。
function sendEvent(name: string, params?: Record<string, unknown>) {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  w.gtag?.("event", name, { page: "3m2g", ...params });
}
function useViewEvents(ids: Record<string, string>) {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const seen = new Set<string>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const id = (e.target as HTMLElement).id;
        if (e.isIntersecting && !seen.has(id)) {
          seen.add(id);
          sendEvent(ids[id]);
        }
      }
    }, { threshold: 0.4 });
    Object.keys(ids).forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [ids]);
}
const VIEW_EVENTS: Record<string, string> = { "volume-ladder": "view_volume_ladder", pricing: "view_pricing", contact: "view_contact" };

// 提供アセットの全体像（数字カード4枚＋折りたたみ詳細）。
// 数字の出所は bht-ops docs/asset-catalog-external.md 1章＝リポジトリ実物から検証した件数のみ（キット側は bht-saas-kit main 1deeda6・2026-10-11 で再検証）。
// 「99項目カバー」等のNG表現（bht-ops docs/3m2g-lp-claims-evidence.md 4章）は使わない。
const assetOverview = [
  {
    number: "416",
    unit: "項目",
    label: "標準回答データベース",
    summary: "3省2ガイドラインの対策項目416件すべてに、判定と対応方針を用意済み。「対応中・未対応」は0件です。",
    details: [
      "対応済み 192件 — 標準的なAWSの設定・実装でカバーできる項目",
      "設計選択により対象外 171件 — 12の設計パターンに帰着（物理基盤を自社で持たない80件／院内ネットワークに接続しない11件ほか）。「この構成を採ればこれらは検討不要」を索引で示せます",
      "製品化段階で対応 52件／要判断（製品機能に依存）1件",
      "対策項目マスタは3章・44中項目に構造化（人的・組織的153／物理的41／技術的222）",
      "納品前の通し点検スクリプト付き（内部整合・条文の実在・版数・固有情報の残存を機械判定）",
    ],
  },
  {
    number: "94 / 99",
    unit: "項目",
    label: "医療機関の確認事項への回答素材",
    summary: "MDS/SDS 99項目のうち94項目（95%）が「はい」または「対象外」で回答できる見込みです（「いいえ」0件）。",
    details: [
      "MDS 41項目・SDS 58項目を構造化し、99項目 × 対策項目416件の対応表を全件紐づけ",
      "内訳: はい61／はい（要件付き）14／対象外19／要判断5／いいえ 0",
      "要件付き14件は成立要件を文書化済み（どの規程のどの章を埋めれば「はい」になるかまで特定）",
      "要判断5件は、なぜ個別検討になるのかを項目単位で開示します（次章）",
      "別様式の JAHIS SDS Ver.5.0（160問）にも開示書を用意: 標準構成で はい72／いいえ1／対象外72／非該当15（いいえ1件はパスワードの有効期限。定期変更を求めない設計のため）。案件で再判定する72問は区別して管理",
    ],
  },
  {
    number: "70",
    unit: "点",
    label: "規程・手順・設計書のひな形",
    summary: "規程・計画・サービス文書・手順35文書と、詳細設計書35ファイル。ゼロから書き起こしません。",
    details: [
      "規程8: 運用管理／アクセス管理／利用者認証方式（二要素認証・代替手段）／ISMS実施・運用／情報資産管理／要配慮個人情報の取り扱い／スマートフォン使用ルール／就業規則",
      "計画2: DR計画／リスクアセスメント　サービス文書4: SLA／サービス仕様書／サービス仕様適合開示書／非機能要件定義書",
      "手順21: リリースフロー一式14（FE/BE × Stg/Prod・品質保証・リリース後・出荷判定・社内QA・薬機対応・法定表示・デザインレビュー）＋特権アクセスログ定期レビュー／サポート終了影響評価／分析削除依頼／苦情対応／教育訓練（理解度テスト20問つき）／作業手順書",
      "詳細設計書35: セキュリティ運用設計13（IAM・WAF・CloudTrail・GuardDuty・AWS Config）／データストレージ6／アーキテクチャ4／インフラ・ネットワーク2／モバイル差分3／共通章7",
      "規程は「ガイドライン要件ID → 要求 → 対応条文」の構造。どの条文がどの要件を満たすか追えます",
    ],
  },
  {
    number: "実装",
    unit: "一式",
    label: "文書だけで終わらせない実装の型",
    summary: "管理基盤の画面9枚・API 14経路・AWSのIaC（CDK 67リソース）まで、文書と紐づけた実装の型があります。",
    details: [
      "管理基盤フロントエンド 9画面: ログイン／初期パスワード変更／MFA登録／MFAコード入力／パスワード再発行（2段階）／パスワード変更／ユーザー管理／監査ログ閲覧／セキュリティ開示（SDS Ver.5.0 の回答を利用者に表示）",
      "バックエンド 14経路: 認証10＋ユーザー管理3＋監査ログ1。パスワード履歴照合・類推しやすいパスワードの拒否（画面と API の両方）・アカウント列挙防止・全パスワード操作の監査ログ記録・実行ログに個人情報を出さないテストを実装",
      "AWS（CDK 67リソース）: Cognito（12文字＋複雑性・履歴5世代・MFA 3モード切替）／DynamoDB／監査ログのS3 Object Lock保全／HTTP API＋JWT認可／CloudWatch アラーム3本→SNS通知／CloudTrail（任意）",
      "無操作自動ログオフ（既定15分→警告→強制サインアウト）・テナント別テーマ（ブランド1色から配色を自動導出）",
      "案件別の文書パック自動生成（19文書: 規程・SLA・基本設計書・設計書セキュリティ章・復旧/BCP手順書・各種台帳と記録・組織対応チェックリスト・SDS開示書・医療機関向け説明スライド）: 差し込み欄110欄を5分類で管理し、検査ゲート6種を通らないと生成されません。基本設計書の画面・API・データの表は実装から生成し、納品マニフェストに生成日・コミット・設定・416件の区分別集計が残ります",
      "依存パッケージの悪性混入を毎週検査（OSV-Scanner）し、更新は Dependabot で追う",
    ],
  },
];

// MDS/SDS 99項目（GL第7.0版 保守委託機関編【別紙】）への回答状況の開示。
// 文言はbht-ops docs/3m2g-lp-claims-evidence.md のL1〜L3（B1判断材料）に準拠。
// 「99項目カバー」等のNG表現（同ドキュメント4章）は使わない。
const mdsSdsPoints = [
  {
    title: "99項目すべてを項目単位で分類済み",
    body: "MDS/SDS 99項目すべてを項目単位で分類済みです。94件（95%）は「はい」「対象外」または「文書の整備により はい」で回答できる見込みです。",
  },
  {
    title: "個別検討になるのは5件だけ",
    body: "個別検討になるのは5件だけです。どの項目が、なぜ個別検討になるのかを項目単位で開示します。",
  },
  {
    title: "対応表は検証してから出す",
    body: "「対象外」の除外理由が要求に当たっていない項目（誤除外）を4件、自分たちで検出して是正しました。対応表は作って終わりにせず、要求の原文と突き合わせて検証しています。",
  },
  {
    title: "二要素認証は規程ひな形を同梱",
    body: "二要素認証（令和9年4月1日期限）は、対応ロードマップの規程ひな形をアセットに同梱しています。方式の比較・認証手段が使えない場合の代替手順・医療機関等との合意事項までを1本の規程で扱います。",
  },
];

// 料金（税別）。正本は bht-ops docs/pricing-2026-10.md（v2・2026-10-13 Junya決定・2027-03末まで据え置き）。
// ここに載せるのはアセット費（Sライン）だけ。設計・開発費は提案書側で「アセット費＋開発費」の2行見積り。数値を変えるときは正本を先に更新する。
const pricingTiers = [
  {
    id: "S1",
    name: "SDS回答パック",
    price: "40万円",
    lead: "5営業日（特急3営業日）",
    scope: "標準回答DB 416項目 ＋ MDS/SDS対応表",
    summary: "医療機関から求められたSDS・MDSに、貴社構成での回答草案とギャップ一覧をお返しします。まず「出せる状態」にする入口の商品です。",
    includes: [
      "ヒアリング1回（60分）",
      "GL第7.0版 別紙 99項目 または JAHIS SDS Ver.5.0（160問）の回答草案",
      "「はい」にするための要件メモ（ロードマップ回答の書き方を含む）とギャップ一覧",
      "提出期限が迫っている場合は特急（3営業日）＋20万円",
    ],
    highlight: false,
  },
  {
    id: "S2",
    name: "文書パック",
    price: "80万円",
    lead: "2〜3週間",
    scope: "S1 ＋ 規程・計画・サービス文書・手順 35文書",
    summary: "回答草案に加え、根拠になる規程・手順一式を貴社向けに仕上げます。SDSの「はい」に条文の裏付けが付きます。",
    includes: [
      "S1のすべて",
      "運用管理規程・アクセス管理規程・利用者認証方式規程・DR計画・SLA など35文書の貴社向け差し込み",
      "対応検討シート（個別検討が必要な項目の整理）",
    ],
    highlight: false,
  },
  {
    id: "S3",
    name: "設計・文書フルパッケージ",
    price: "180万円",
    lead: "4〜6週間",
    scope: "S2 ＋ AWS詳細設計書 35ファイル ＋ 構成提案",
    summary: "「対応しない、を先に設計する」まで含めた全部入り。設計選択で対象外にできる項目を構成提案で確定し、設計書と文書を一本の線で繋ぎます。",
    includes: [
      "S2のすべて",
      "当社標準クラウド構成の設計提案と、個別検討50件前後の差分レビュー",
      "IAM・ログ監査・監視・ネットワーク・ストレージの詳細設計書（AWS設定値レベル）の貴社向け化",
    ],
    highlight: true,
  },
  {
    id: "S4",
    name: "実装キット ソースライセンス",
    price: "100万円",
    lead: "契約後すぐ",
    scope: "管理基盤（画面9・API 14・AWS IaC）＋ 文書パック自動生成",
    summary: "文書だけで終わらせないための実装の型。認証・ユーザー管理・監査ログの管理基盤と、案件別の文書パック生成をソースごとお渡しします。",
    includes: [
      "ソース一式（改変可・再頒布不可・1運営者1ライセンス）の買い切り",
      "初回デプロイ支援（2時間）",
      "S3との同時契約は260万円",
    ],
    highlight: false,
  },
];

const pricingNotes = [
  "上記はアセットとその貴社向け仕上げの価格です。設計・実装まで当社に任せたい場合は、アセット費に貴社固有の開発分を加えた2行でお見積りします。",
  "年間更新（S2以上が対象）: 20万円／年。ガイドラインは厚労省と経産省・総務省が別周期で改定され、直近の改定では416項目のうち300項目超で参照条文が動きました。改定時の再判定と文書の差し替え版、依存更新を含みます。",
  "厳密対応版（二要素認証の実装、記録確定などの製品機能、閉域網・クライアント証明書・PKI署名への拡張）は差分表をもとに個別にお見積りします。",
  "価格はすべて税別・2026年10月時点の標準価格です。当社標準のクラウド構成（AWS）の採用が前提で、既存構成が異なる場合はヒアリング後に適用範囲と費用をご提示します。",
  "本パッケージは3省2ガイドラインへの準拠を保証するものではありません。",
];

const steps = [
  { step: "1", title: "ヒアリング", duration: "2〜3日", body: "プロダクト特性・データフロー・提供形態を確認し、標準回答との差分を特定します。" },
  { step: "2", title: "構成提案 ＋ 差分検討", duration: "1〜2週間", body: "当社標準のクラウド構成の設計提案とセットで、個別検討が必要な項目（50件前後）だけをレビューします。" },
  { step: "3", title: "文書一式の納品", duration: "1〜2週間", body: "検討シート・運用文書・詳細設計書を貴社向けにカスタマイズして納品。医療機関への開示文書まで揃います。" },
];

export default function ThreeM2GPage() {
  useViewEvents(VIEW_EVENTS);
  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="../" className="text-xl font-bold text-primary-700">HealthLegal</a>
          <a
            href="#contact"
            className="px-5 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            無料相談
          </a>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="py-24 px-6 bg-gradient-to-b from-primary-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <p className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-100 border border-primary-200 text-primary-800 rounded-full text-base sm:text-lg font-bold mb-8">
              <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              3省2ガイドライン対応パッケージ
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold text-slate-900 leading-tight mb-6">
              数ヶ月規模の対応を、
              <br />
              数週間規模に。
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
              医療・ヘルスケアプロダクトの法令対応・セキュリティ構築の実務で磨いた、
              法的・技術的ベストプラクティスの一式。416項目をゼロから検討する代わりに、
              検証済みの標準回答からの差分レビューで、最短・高品質に対応します。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 text-white text-lg font-semibold rounded-lg hover:bg-accent-600 transition-colors shadow-lg shadow-accent-500/25"
              >
                無料相談を予約する
              </a>
              <a
                href="../sds-check/"
                className="inline-flex items-center gap-2 px-6 py-4 border border-primary-300 bg-white text-primary-700 text-base font-semibold rounded-lg hover:bg-primary-50 transition-colors"
              >
                まずは無料の SDS ギャップ診断（3 分）
              </a>
            </div>
          </div>
        </section>

        {/* 数字 */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="bg-slate-50 rounded-xl p-8 text-center border border-slate-200">
                  <p className="text-3xl font-bold text-primary-600 mb-2">{s.number}</p>
                  <p className="text-sm font-bold text-slate-900 mb-3">{s.label}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
            {/* 紙の対応で終わらない、が典型的コンサルとの差別化。範囲の詳細は商談で扱う */}
            <p className="mt-8 text-center text-slate-700 leading-relaxed">
              <strong className="font-semibold text-slate-900">AWSで構築するプロダクトなら、法令対応文書から詳細設計書・AWSの設定値まで、実装につながる形でワンセット。</strong>
              <span className="text-slate-500">紙の対応で終わらせません。</span>
            </p>
          </div>
        </section>

        {/* 課題 */}
        <section className="py-24 px-6 bg-slate-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">
              3省2ガイドライン対応が重い理由
            </h2>
            <div className="space-y-4 text-slate-700 leading-relaxed">
              <p>
                医療情報を取り扱うシステム・サービスの提供事業者には、厚労省・経産省・総務省の
                3文書（あわせて数百ページ）への対応が求められ、対策項目は416項目にのぼります。
              </p>
              <p>
                自力で対応する場合、ガイドラインの読解と項目整理だけで数週間、全項目の該当性判断と
                対応方針の検討に数ヶ月、さらに規程・手順・設計書の整備が続きます。医療情報セキュリティに
                知見のある人材の確保も難しく、<strong className="font-semibold text-slate-900">体制を組成して
                対応した場合の総コストは数百万〜1,000万円規模・期間4〜6ヶ月</strong>になるのが実情です
                <span className="text-sm text-slate-500">（自社試算。体制・単価の前提はご相談時にご提示します）</span>。
              </p>
              <p>
                さらに、対象外にできる項目を知らずに全項目対応してしまう過剰投資や、
                判断根拠が担当者の頭にしか残らない属人化が、後の監査・引き継ぎで効いてきます。
              </p>
            </div>

            {/* ボリュームの階段（数値の正本: bht-ops docs/3m2g-volume-framing.md 1章。LP では直接編集せず正本を写す） */}
            <div id="volume-ladder" className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">「416項目」は入口にすぎません</h3>
              <p className="text-slate-700 leading-relaxed mb-6">
                対策項目の1つ1つに、厚労省ガイドラインの条文参照と、医療機関からの確認事項がぶら下がります。
                医療機関が見るのは最後の「いいえ」の数です。
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {volumeHeadline.map((h) => (
                  <div key={h.label} className="rounded-xl bg-primary-50 border border-primary-100 p-5 text-center">
                    <p className="text-3xl font-bold text-primary-700 tabular-nums">{h.number}</p>
                    <p className="font-semibold text-slate-900 mt-1">{h.label}</p>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">{h.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm font-semibold text-slate-500 mb-3">内訳: 実際に読んで判断する単位（当社アセットの機械集計・再現可能）</p>
              <ol className="space-y-3">
                {volumeLadder.map((row, i) => (
                  <li key={row.label} className="flex items-start gap-4">
                    <span className="shrink-0 w-24 sm:w-28 text-right text-2xl font-bold text-primary-700 tabular-nums">{row.number}</span>
                    <div className="min-w-0 pt-1">
                      <p className="font-semibold text-slate-900">{row.label}</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{row.desc}</p>
                    </div>
                    {i < volumeLadder.length - 1 && <span className="sr-only">、さらに</span>}
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-slate-700 leading-relaxed">
                <strong className="font-semibold text-slate-900">読んで判断する単位は合計で1,000を超えます（416＋371＋99＋160＋別版参照202）。</strong>
                たとえば「パスワードの世代管理」という1項目は、厚労省ガイドラインの条文 → 医療機関の確認事項 →
                利用者認証方式規程の条文 → 認証基盤の設定値、と5段で初めて「対応した」と言えます。
                416項目それぞれにこの深さがあるのが、対応が重い理由です。
              </p>
              <p className="mt-4 text-slate-700 leading-relaxed">
                <strong className="font-semibold text-slate-900">対応のゴールは文書を揃えることではなく、医療機関の選定基準「全項目が『はい』または『対象外』」を満たして契約が進む状態にすることです。</strong>
                SDS を出せないまま止まる医療機関との契約は、年間で数百万円規模になることが珍しくありません。
                さらに厚労省ガイドライン第7.0版は令和9年度までの二要素認証の採用を求めており、未対応の事業者はシステム更新時の選定から外れる構造になっています。
              </p>
              <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-5">
                <p className="font-semibold text-slate-900 mb-2">どこまで要るかは段階で決められます</p>
                <ul className="text-sm text-slate-700 leading-relaxed space-y-1">
                  <li><span className="font-semibold text-primary-700">PoC・初期導入:</span> 医療機関に出す回答を先に整える（S1／S2）。99項目への回答と規程類で、選定の入口を通す最低線</li>
                  <li><span className="font-semibold text-primary-700">本製品化:</span> 全層を揃える（S3／S4）。AWS設定値レベルの設計書まで含め、監査・引き継ぎに耐える形にする</li>
                  <li><span className="font-semibold text-primary-700">改定への追従:</span> ガイドラインは厚労省と経産省・総務省が別周期で改定し、直近の改定では416項目のうち300項目超で参照条文が動きました。年間更新（20万円／年）で再判定と差し替え版をお渡しします</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 仕組み */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-14">
              なぜ数週間規模にできるのか
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sources.map((s, i) => (
                <div key={s.title} className="bg-slate-50 rounded-xl p-8 border border-slate-200">
                  <p className="text-primary-600 font-bold text-sm mb-2">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{s.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 実績 */}
        <section className="py-24 px-6 bg-primary-950">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">机上のテンプレートではなく、実対応で検証済み</h2>
            <p className="text-primary-100 leading-relaxed mb-6">
              <strong className="text-white font-semibold">医療情報の扱いが最もシビアな領域のひとつ、医用画像をAIで解析するSaaS（大学病院との共同研究から事業化）に本パッケージを適用し、</strong>
              416項目すべてを実装と文書の実態で判定、JAHIS SDS Ver.5.0（160問）の開示書と規程類を整備しました。
              標準回答のまま医療機関に出すのではなく、適用先の実態で判定し直す手順もこの適用で確立しています。
            </p>
            <p className="text-primary-200 leading-relaxed max-w-2xl mx-auto">
              本パッケージの標準回答とフレームワークは実際の3省2ガイドライン対応で運用され、
              <strong className="text-white font-semibold">416項目すべての該当性判断・対応方針の記入を、
              担当1名＋レビュー1名の体制・営業日10日で完了</strong>した実績があります。
              医療機器プログラム（SaMD）から非医療機器のヘルスケアサービスまで、
              複数プロダクトの開発・法令対応で蓄積した判断とAWS実装の型を反映しています。
            </p>
            {/* 人的な信頼の担保。運営者個人名は非公開の方針のため、役割・経験ベースで記載 */}
            <div className="mt-10 pt-8 border-t border-primary-800 max-w-2xl mx-auto">
              <p className="text-white font-semibold mb-2">監修体制</p>
              <p className="text-primary-200 text-sm leading-relaxed">
                メドテック企業でのCTO経験を持ち、SaMDの薬事対応からクラウドセキュリティ構築・
                プロダクト開発までを実務で担ってきたメンバーが、標準回答と文書ひな形の内容を監修しています。
                法解釈と技術実装のどちらか一方に寄らない、両輪での品質担保が本パッケージの前提です。
              </p>
            </div>
          </div>
        </section>

        {/* 機能構成図（bht-saas-kit compliance/feature_map.py の生成物 docs/feature-map.svg の写し。
            キット側で再生成したら public/img/feature-map.svg も差し替える） */}
        <section className="py-24 px-4 sm:px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-6">
              医療機関の審査で問われる機能を、最初から実装済み
            </h2>
            <p className="text-slate-600 text-center leading-relaxed max-w-3xl mx-auto mb-10">
              二要素認証・パスワードの脆弱性チェック・改ざんできない監査ログ・医療機関ごとのデータ分離など、
              SDS（医療情報セキュリティ開示書）で確認される機能を、画面と AWS 上の仕組みとして備えた土台をお渡しします。
              各機能には JAHIS SDS Ver.5.0 の設問番号を併記しています。
            </p>
            <a href="../img/feature-map.svg" target="_blank" rel="noopener noreferrer" className="block">
              <img
                src="../img/feature-map.svg"
                alt="機能構成図: 利用者、Webアプリの画面、AWS上の認証・アカウント、権限・テナント分離、記録・監査、データ保護・可用性、開発・運用の各機能と、文書パック"
                width={1600}
                height={900}
                loading="lazy"
                className="w-full h-auto rounded-xl border border-slate-200 bg-white shadow-sm"
              />
            </a>
            <p className="mt-3 text-xs text-slate-500 text-center">クリックで拡大。ガイドラインへの準拠を保証するものではありません。</p>
          </div>
        </section>

        {/* 提供アセットの全体像（数字カード4枚＋折りたたみ詳細）。
            「数字 → 開示 → CTA」の流れにするため、MDS/SDS開示セクションの直前に置く。
            id="assets" は記事からの誘導先アンカー（bht-ops#109） */}
        <section id="assets" className="py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-6">
              提供アセットの全体像
            </h2>
            <p className="text-slate-600 text-center leading-relaxed max-w-3xl mx-auto mb-12">
              「何がどれだけ揃っているのか」を、件数で示します。
              以下はすべて実在する成果物の件数で、商談の場で現物をご確認いただけます。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assetOverview.map((a) => (
                <div key={a.label} className="bg-slate-50 rounded-xl p-8 border border-slate-200 flex flex-col">
                  <p className="flex items-baseline justify-center gap-1.5 mb-3">
                    <span className="text-4xl font-bold text-primary-600">{a.number}</span>
                    <span className="text-base font-semibold text-primary-700">{a.unit}</span>
                  </p>
                  <p className="text-center text-sm font-bold text-slate-900 mb-4">{a.label}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{a.summary}</p>
                  <details className="mt-5 group">
                    <summary className="cursor-pointer text-sm font-semibold text-primary-700 hover:text-primary-800 list-none flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4 transition-transform group-open:rotate-90"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                      内訳を見る
                    </summary>
                    <ul className="mt-4 space-y-2.5 border-t border-slate-200 pt-4">
                      {a.details.map((d) => (
                        <li key={d} className="flex gap-2 text-sm text-slate-600 leading-relaxed">
                          <span aria-hidden="true" className="text-primary-400 shrink-0">
                            ・
                          </span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-slate-700 leading-relaxed">
              <strong className="font-semibold text-slate-900">
                対策項目416件・医療機関の確認事項99件・規程と手順35文書・設計書35ファイル——合計580を超える管理単位を、文書と実装の両面で紐づけ済みです。
              </strong>
            </p>
          </div>
        </section>

        {/* MDS/SDS 99項目への回答状況（開示型の訴求） */}
        <section className="py-24 px-6 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-6">
              医療機関の確認事項「MDS/SDS 99項目」への回答状況を開示します
            </h2>
            <p className="text-slate-600 text-center leading-relaxed max-w-3xl mx-auto mb-12">
              ガイドライン第7.0版では、医療機関が事業者を選定する際の公式な確認事項として
              MDS（医療情報安全管理適合性開示書）41項目・SDS（サービス仕様適合開示書）58項目の
              計99項目が示され、「全項目が『はい』または『対象外』である事業者を選定すること」と明記されました。
              本パッケージは、この99項目にどう答えられるかを項目単位で整理・開示します。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mdsSdsPoints.map((p, i) => (
                <div key={p.title} className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
                  <p className="text-primary-600 font-bold text-sm mb-2">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{p.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
            {/* L5: AI自動判定の予告枠。プロダクト未リリースのため「開発中の技術検証」であることを明記する */}
            <div className="mt-8 bg-white rounded-xl p-8 border border-primary-200">
              <p className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-bold mb-3">
                開発中
              </p>
              <h3 className="text-lg font-bold text-slate-900 mb-3">対応状況のAI自動判定（技術検証中）</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                対応状況のAI自動判定を自社アセットで実測しています。170件の判定で、根拠引用216件はすべて
                原文と機械照合済み——実在しない根拠（捏造）は0件でした。判定の限界値
                （対象外の項目を誤って「要対応」と読む率など）も測定し、開示します。
                AIの出力を鵜呑みにするのではなく、間違い方まで測って人の確認と組み合わせる——
                本パッケージと同じ検証姿勢で製品化を進めています。
              </p>
            </div>
          </div>
        </section>

        {/* 提供物 */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">提供物</h2>
            <ul className="space-y-3">
              {deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3 bg-slate-50 rounded-lg px-5 py-4 border border-slate-200">
                  <svg className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span className="text-slate-700 text-sm leading-relaxed">{d}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-500 text-center mt-8">
              ※ 当社が提案するクラウド構成（AWS）の採用が前提です。
              既存構成が異なる場合もヒアリングのうえ適用範囲をご提示します。
            </p>
          </div>
        </section>

        {/* 料金（アセットの使用範囲で階段状） */}
        <section id="pricing" className="py-24 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-6">料金</h2>
            <p className="text-slate-600 text-center leading-relaxed max-w-3xl mx-auto mb-12">
              アセットのどこまでを使うかで、4段階に分けています。
              比較していただきたいのは当社の作業量ではなく、SDS を出せずに止まる医療機関との契約（年間数百万円規模）と、
              体制を組成して自力対応した場合の数百万〜1,000万円・4〜6ヶ月です。
              PoC・初期導入ではS1／S2で医療機関への回答を先に整え、本製品化でS3・S4へ進む段階的な使い方ができます。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {pricingTiers.map((t) => (
                <div
                  key={t.id}
                  className={`rounded-xl p-7 border flex flex-col ${
                    t.highlight
                      ? "bg-white border-primary-500 shadow-lg shadow-primary-500/10 ring-1 ring-primary-500"
                      : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold tracking-wider text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full">
                      {t.id}
                    </span>
                    {t.highlight && (
                      <span className="text-xs font-bold text-white bg-primary-600 px-2.5 py-1 rounded-full">おすすめ</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{t.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">{t.scope}</p>
                  <p className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold text-slate-900">{t.price}</span>
                    <span className="text-xs text-slate-500">（税別）</span>
                  </p>
                  <p className="text-sm font-semibold text-primary-600 mb-4">納期目安 {t.lead}</p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">{t.summary}</p>
                  <ul className="space-y-2 border-t border-slate-200 pt-4 mt-auto">
                    {t.includes.map((d) => (
                      <li key={d} className="flex gap-2 text-sm text-slate-600 leading-relaxed">
                        <svg className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <ul className="mt-10 max-w-4xl mx-auto space-y-2">
              {pricingNotes.map((n) => (
                <li key={n} className="text-sm text-slate-500 leading-relaxed flex gap-2">
                  <span aria-hidden="true" className="shrink-0">※</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 進め方 */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-14">進め方</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((s) => (
                <div key={s.step} className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold mb-4">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{s.title}</h3>
                  <p className="text-primary-600 text-sm font-semibold mb-3">{s.duration}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500 text-center mt-8">
              どの段階から始めるかは、無料相談で貴社プロダクトの状況を伺ったうえでご提案します。
            </p>
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="py-24 px-6 bg-slate-900">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              まずは対応範囲の目安から
            </h2>
            <p className="text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
              貴社プロダクトの概要をお聞かせいただければ、416項目のうちどこまでが
              設計選択で対象外にでき、個別検討がどの程度残るか、初回相談（無料）で目安をご提示します。
            </p>
            <a
              href={FORM_URL}
              onClick={() => sendEvent("consult_form_open", { position: "contact" })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 text-white text-lg font-semibold rounded-lg hover:bg-accent-600 transition-colors shadow-lg shadow-accent-500/25"
            >
              無料相談を予約する
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
            <p className="mt-6 text-slate-300 text-sm">
              まず自社の状況を知りたい方は{" "}
              <a href="../sds-check/" className="text-white font-semibold underline underline-offset-4 hover:text-accent-300">
                まずは無料の SDS ギャップ診断（3 分）
              </a>
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
