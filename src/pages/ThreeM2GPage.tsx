import { useEffect, useState } from "react";

const FORM_URL = "https://docs.google.com/forms/d/1qQRrWDUPCOeXklfna912YEs1b2DqPHap3zZ0lpoyjZI/viewform";
// サンプル資料（架空の事業者で生成した成果物の抜粋）。作り方は scripts/sample/build-3m2g-sample.mjs
const SAMPLE_PDF = "../docs/3m2g-sample.pdf";

// 416項目の行き先（正本: bht-ops assets/3m2g/standard-answers.json の標準ステータス集計。対象外167・対応済み196・製品化段階52＋要判断1）。
// 幅は件数の比（167/416・196/416・53/416）。数字を変えるときは正本を数え直す。
const funnel = [
  {
    count: "167",
    unit: "件",
    share: 40,
    title: "独自ノウハウ・戦略的な設計により対象外",
    body: "クラウド構成の選択により対応が不要になる項目。例: 自社でサーバを保有しない構成では、物理的対策など80件が対象外。除外理由は当社が文書化します。",
    bar: "bg-slate-300 text-slate-700",
    dot: "bg-slate-300",
  },
  {
    count: "196",
    unit: "件",
    share: 47,
    title: "標準回答を適用",
    body: "対応方針と AWS の設定例を整備済み。貴社構成への適合を確認のうえ適用します。",
    bar: "bg-primary-200 text-primary-900",
    dot: "bg-primary-200",
  },
  {
    count: "約50",
    unit: "件",
    share: 13,
    title: "要件に応じて個別対応",
    body: "製品の機能・運用により回答が変わる項目。貴社の要件を伺い、当社が対応方針を策定します。",
    bar: "bg-accent-500 text-white",
    dot: "bg-accent-500",
  },
];

// 検討者が最初に確認する3点（納期・費用・納品物）。数字は同じページの料金表と一致させる。
const quickFacts = [
  { label: "納期", value: "最短5営業日", desc: "SDS 回答パックの場合。設計書を含む一式は4〜6週間" },
  { label: "費用", value: "40万円から", desc: "提供範囲に応じた4プラン", href: "#pricing", link: "料金表を見る" },
  { label: "納品物", value: "文書・設計書 70点", desc: "規程・手順35文書、AWS 詳細設計書35ファイル。貴社向けに調整して納品" },
];

// 新規事業で両立しにくい3点と当社の対応。数字は同じページの料金表・自社試算と一致させる。
const tradeoffs = [
  { axis: "スピード", pain: "読解・該当性判断・規程整備で4〜6ヶ月", answer: "標準回答からの差分確認で数週間。SDS 回答草案は最短5営業日" },
  { axis: "費用", pain: "専門体制の組成で数百万〜1,000万円", answer: "整備済みアセットの適用で40万円から" },
  { axis: "品質", pain: "専門人材が少なく判断が属人化。対象外にできる項目まで対応する過剰投資も", answer: "416項目を全件判定した標準回答と、実案件で検証した規程・設計書・実装" },
];

// 品質を担保する仕組み（事実の出所: bht-ops docs/3m2g-lp-claims-evidence.md・bht-saas-kit compliance/feature_map.py）
const qualityChecks = [
  { title: "ガイドラインと項目単位で照合", body: "416項目を経済産業省・総務省ガイドライン 別紙2と項目単位で照合済み。改定時も同じ手順で再照合します。" },
  { title: "判断の誤りを自社で検出", body: "「対象外」の判断根拠を要求の原文と照合し、誤除外4件を検出・是正しました。" },
  { title: "文書と実装を同じ設定値から生成", body: "実装キットの文書パックは、規程・設計書・開示書を実装と同じ設定値から生成。記載と実装の食い違いを防ぎます。" },
];

// 1項目を要件から設定値まで追う例。番号の出所は bht-saas-kit docs/FEATURES.md（パスワードの使い回し禁止: 3省2GL 3.1-④・SDS 17.1.1.4〜17.1.1.6・履歴5世代）。
const traceSteps = [
  { layer: "対策項目", ref: "経産省・総務省ガイドライン 別紙2 3.1-④", body: "パスワードの世代管理" },
  { layer: "厚労省ガイドライン", ref: "第7.0版 システム運用編", body: "対応する条文を特定" },
  { layer: "医療機関の確認事項", ref: "JAHIS SDS Ver.5.0 設問17.1.1.4〜17.1.1.6", body: "開示書の回答と備考" },
  { layer: "規程の条文", ref: "利用者認証方式規程", body: "再利用の禁止を明文化" },
  { layer: "システムの実装", ref: "認証基盤（AWS）", body: "直近5世代との照合で再利用を拒否" },
];

// 画面例（public/img/kit/。bht-saas-kit frontend のデモ表示を 1280×800 で撮影。キットの画面を変えたら撮り直す）
const kitScreens = [
  { file: "login", title: "サインイン", body: "連続失敗時のロック、登録の有無を判別させない応答を実装済み。" },
  { file: "users", title: "ユーザー管理", body: "招待・役割の付与・無効化と、施設ごとの二要素認証の方針設定。" },
  { file: "audit", title: "監査ログ", body: "月・イベント種別・行為者で絞り込み。閲覧操作も記録します。" },
  { file: "security", title: "セキュリティ開示", body: "JAHIS SDS Ver.5.0（160問）の回答を利用者に表示。印刷・PDF 保存に対応。" },
];

// 実績（事実の出所: bht-ops docs/3m2g-lp-claims-evidence.md。適用先の名称は出さない）
const proofs = [
  { value: "医用画像 AI の SaaS", label: "適用先", body: "大学病院との共同研究から事業化した製品。416項目を実装と文書の実態で判定し、規程類を整備しました。" },
  { value: "10営業日", label: "416項目の判定に要した期間", body: "担当1名・レビュー1名の体制で、全項目の該当性判断と対応方針の記入を完了しました。" },
  { value: "160問", label: "JAHIS SDS Ver.5.0 の開示書を整備", body: "標準回答をそのまま提出せず、適用先の実態で再判定する手順を確立しています。" },
];

// ボリュームの階段（正本: bht-ops docs/3m2g-volume-framing.md 1章。数字を変えるときは正本から写す）
const volumeHeadline = [
  { number: "416", label: "対策項目", desc: "経産省・総務省ガイドライン 別紙2。事業者が対応する管理単位" },
  { number: "99", label: "医療機関の確認事項", desc: "厚労省ガイドライン第7.0版 MDS 41＋SDS 58。医療機関が事業者の選定に用いる" },
  { number: "94 / 99", label: "選定基準を満たす回答（当社標準構成）", desc: "「いいえ」は0件。うち15件は規程への数値記入や医療機関との合意が前提で、残る5件は製品の機能で決まるため個別に判定します" },
];
const volumeLadder = [
  { number: "416", label: "対策項目（経産省・総務省ガイドライン 別紙2）", desc: "遵守事項◎384・推奨〇32" },
  { number: "371", label: "厚労省ガイドラインの条文参照", desc: "416項目のうち343項目に、企画管理編149・システム運用編222の条文を対応づけ済み" },
  { number: "99", label: "医療機関からの確認事項（MDS 41＋SDS 58）", desc: "厚労省ガイドライン第7.0版 保守委託機関編【別紙】" },
  { number: "160", label: "JAHIS SDS Ver.5.0 の設問", desc: "商談で実際に提出を求められる開示書の様式" },
  { number: "約90", label: "整備済みの文書", desc: "規程・計画・手順35、AWS 詳細設計書35、案件別文書パック20。貴社が記入するのは案件固有の29欄のみで、導入先に合わせた調整は当社が行います" },
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
    summary: "3省2ガイドラインの対策項目416件すべてに、判定と対応方針を整備済み。「対応中・未対応」は0件です。",
    details: [
      "対応済み 196件 — 標準的なAWSの設定・実装でカバーできる項目",
      "設計選択により対象外 167件 — 12の設計パターンに帰着（物理基盤を自社で持たない80件／院内ネットワークに接続しない11件ほか）。「この構成を採ればこれらは検討不要」を索引で示せます",
      "製品化段階で対応 52件／要判断（製品機能に依存）1件",
      "対策項目マスタは3章・44中項目に構造化（人的・組織的153／物理的41／技術的222）",
      "納品前の通し点検スクリプト付き（内部整合・条文の実在・版数・固有情報の残存を機械判定）",
    ],
  },
  {
    number: "94 / 99",
    unit: "項目",
    label: "医療機関の確認事項への回答素材",
    summary: "当社標準構成で、MDS/SDS 99項目のうち94項目（95%）を「はい」または「対象外」で回答できます。「いいえ」は0件です。",
    details: [
      "MDS 41項目・SDS 58項目を構造化し、99項目 × 対策項目416件の対応表を全件紐づけ",
      "内訳: はい60／はい（要件付き）15／対象外19／要判断5／いいえ 0",
      "要件付き15件は成立要件を文書化済み（どの規程のどの章を埋めれば「はい」になるかまで特定）",
      "要判断5件は、個別検討となる理由を項目単位で示します",
      "別様式の JAHIS SDS Ver.5.0（160問）にも開示書を用意: 標準構成で はい73／対象外72／非該当15、「いいえ」は0件。案件で再判定する72問は区別して管理",
    ],
  },
  {
    number: "70",
    unit: "点",
    label: "規程・手順・設計書のひな形",
    summary: "規程・計画・サービス文書・手順35文書と、AWS の設定値まで記述した詳細設計書35ファイル。",
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
    label: "文書と紐づく実装",
    summary: "管理基盤の画面9枚・API 20経路・AWS の IaC（CDK 81リソース）を、文書と紐づけて提供します。",
    details: [
      "管理基盤フロントエンド 9画面: ログイン／初期パスワード変更／MFA登録／MFAコード入力／パスワード再発行（2段階）／パスワード変更／ユーザー管理／監査ログ閲覧／セキュリティ開示（SDS Ver.5.0 の回答を利用者に表示）",
      "バックエンド 20経路: 認証10＋ユーザー管理4＋テナント設定5（二要素認証の方針・クライアント証明書）＋監査ログ1。パスワード履歴照合・類推しやすいパスワードの拒否（画面と API の両方）・アカウント列挙防止・全パスワード操作の監査ログ記録・実行ログに個人情報を出さないテストを実装",
      "AWS（CDK 81リソース）: Cognito（13文字以上＋複雑性・履歴5世代・MFA 3モード切替＋テナント別の方針）／DynamoDB／監査ログのS3 Object Lock保全／HTTP API＋JWT認可／CloudWatch アラーム3本→SNS通知／CloudTrail（任意）／画面の配信層（CloudFront＋応答ヘッダー・任意）",
      "無操作自動ログオフ（既定15分→警告→強制サインアウト）・テナント別テーマ（ブランド1色から配色を自動導出）",
      "案件別の文書パック自動生成（20文書。二要素認証を全利用者に必須としない案件は利用者認証方式規程を加えた21文書: 規程・SLA・基本設計書・設計書セキュリティ章・施設向け導入手順書・復旧/BCP手順書・各種台帳と記録・組織対応チェックリスト・SDS開示書・医療機関向け説明スライド）: 差し込み欄130欄を5分類で管理し、検査ゲート6種を通らないと生成されません。基本設計書の画面・API・データの表は実装から生成し、納品マニフェストに生成日・コミット・設定・416件の区分別集計が残ります",
      "依存パッケージの悪性混入を毎週検査（OSV-Scanner）し、更新は Dependabot で管理",
    ],
  },
];

// MDS/SDS 99項目（GL第7.0版 保守委託機関編【別紙】）への回答状況の開示。
// 文言はbht-ops docs/3m2g-lp-claims-evidence.md のL1〜L3（B1判断材料）に準拠。
// 「99項目カバー」等のNG表現（同ドキュメント4章）は使わない。
const mdsSdsPoints = [
  {
    title: "要件付きの15件は成立条件まで文書化",
    body: "どの規程のどの章を整備すれば「はい」と回答できるかまで、項目ごとに特定済みです。",
  },
  {
    title: "個別検討は5件",
    body: "製品の機能で回答が決まる項目です。該当する項目と理由を項目単位で示します。",
  },
  {
    title: "二要素認証は規程ひな形を同梱",
    body: "二要素認証（令和9年4月1日期限）の対応ロードマップを定める規程ひな形を同梱。方式の比較、認証手段を利用できない場合の代替手順、医療機関等との合意事項を1本の規程で扱います。",
  },
];

// よくある質問（回答の根拠: bht-ops docs/pricing-2026-10.md の前提条件・年間更新、本ページの注記）
const faqs = [
  {
    q: "AWS 以外のクラウドや、既存の構成でも使えますか？",
    a: "対応できます。標準回答と設計書は AWS を基準にしていますが、Google Cloud や Microsoft Azure などにも同等のサービスがあり、多くの対策はそのまま置き換えられます。構成を伺ったうえで、置き換えの範囲と費用を提示します。",
  },
  {
    q: "すでに運用中の製品にも適用できますか？",
    a: "適用できます。現在の構成と運用を伺い、標準回答との差分を整理します。設計により対象外にできる項目は、構成の見直しを伴う場合があります。",
  },
  {
    q: "ガイドラインへの準拠を保証してもらえますか？",
    a: "保証はしていません。対応の可否は、医療機関との契約内容や貴社の運用にも左右されるためです。本パッケージは、医療機関の確認事項に根拠を示して回答できる状態を整えるものです。",
  },
  {
    q: "補助金・助成金の外注費として支払えますか？",
    a: "補助金を財源とする外注として契約した実績があります。外注費の上限に合わせ、年度ごとに分けて契約することもできます（例: 1年目に S2 で規程と SDS 回答を整え、2年目に開発へ進む）。対象経費になるかは各制度の要件をご確認ください。",
  },
  {
    q: "ガイドラインが改定されたらどうなりますか？",
    a: "年間更新（S2 以上が対象・20万円／年）で、改定時の再判定と文書の差し替え版を提供します。改定の公表から30日以内を目安にお届けします。",
  },
  {
    q: "医療機器プログラム（SaMD）にも使えますか？",
    a: "使えます。3省2ガイドラインへの対応は、医療機器に該当するかどうかに関わらず求められます。医療機器該当性の整理や薬事対応は本パッケージの範囲外ですが、別途ご相談いただけます。",
  },
];

// ページ途中の行動導線（相談とサンプル資料）
function MidCta({ position, heading }: { position: string; heading: string }) {
  return (
    <section className="py-12 px-6 bg-primary-50 border-y border-primary-100">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-lg font-bold text-slate-900">{heading}</p>
          <p className="text-sm text-slate-600 mt-1">成果物の実物は、サンプル資料（PDF・10ページ）でご確認いただけます。</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <a
            href={FORM_URL}
            onClick={() => sendEvent("consult_form_open", { position })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center px-6 py-3 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors"
          >
            無料相談を予約する
          </a>
          <a
            href={SAMPLE_PDF}
            onClick={() => sendEvent("sample_download", { position })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center px-6 py-3 border border-primary-300 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
          >
            サンプル資料を見る
          </a>
        </div>
      </div>
    </section>
  );
}

// 料金（税別）。正本は bht-ops docs/pricing-2026-10.md（v2.1・2026-11-23 S4 改定・2027-03末まで据え置き）。
// ここに載せるのはアセット費（Sライン）だけ。設計・開発費は提案書側で「アセット費＋開発費」の2行見積り。数値を変えるときは正本を先に更新する。
const pricingTiers = [
  {
    id: "S1",
    name: "SDS回答パック",
    price: "40万円",
    lead: "5営業日（特急3営業日）",
    scope: "標準回答DB 416項目 ＋ MDS/SDS対応表",
    summary: "医療機関から求められた SDS・MDS に対し、貴社構成での回答草案とギャップ一覧を提供します。提出可能な状態を最短で整えるプランです。",
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
    summary: "回答草案に加え、根拠となる規程・手順一式を貴社向けに整備します。SDS の「はい」に条文の裏付けが付きます。",
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
    summary: "構成提案を含む一式。設計選択により対象外とする項目を確定し、設計書と文書を相互に紐づけます。",
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
    price: "150万円",
    lead: "契約後即日",
    scope: "管理基盤（画面9・API 20・AWS IaC）＋ 文書パック自動生成",
    summary: "文書と紐づく実装一式。認証・ユーザー管理・監査ログの管理基盤と、案件別の文書パック生成をソースで提供します。",
    includes: [
      "ソース一式（改変可・再頒布不可・1運営者1ライセンス）の買い切り",
      "初回デプロイ支援（2時間）",
      "S3との同時契約は300万円",
    ],
    highlight: false,
  },
];

const pricingNotes = [
  "上記はアセットと貴社向け調整の価格です。設計・実装を当社に依頼する場合は、アセット費と貴社固有の開発費の2行で見積ります。",
  "年間更新（S2以上が対象）: 20万円／年。ガイドラインは厚労省と経産省・総務省が別周期で改定され、直近の改定では416項目のうち300項目超で参照条文が変更されました。改定時の再判定と文書の差し替え版、依存更新を含みます。",
  "厳密対応版（二要素認証の実装、記録確定などの製品機能、閉域網・クライアント証明書・PKI署名への拡張）は差分表をもとに個別にお見積りします。",
  "価格はすべて税別・2026年11月時点の標準価格です。当社標準のクラウド構成（AWS）を基準とした価格で、他のクラウドや既存構成の場合はヒアリング後に適用範囲と費用をご提示します。",
  "本パッケージは3省2ガイドラインへの準拠を保証するものではありません。",
];

const steps = [
  { step: "1", title: "ヒアリング", duration: "2〜3日", body: "プロダクト特性・データフロー・提供形態を確認し、標準回答との差分を特定します。" },
  { step: "2", title: "構成提案 ＋ 差分検討", duration: "1〜2週間", body: "当社標準のクラウド構成の設計提案とセットで、個別検討が必要な項目（50件前後）だけをレビューします。" },
  { step: "3", title: "文書一式の納品", duration: "1〜2週間", body: "検討シート・運用文書・詳細設計書を貴社向けにカスタマイズして納品。医療機関への開示文書まで揃います。" },
];

export default function ThreeM2GPage() {
  useViewEvents(VIEW_EVENTS);
  // スマホ幅の縦長の構成図は冒頭だけ見せ、押すと全体を開く（ページが長くなりすぎないように）
  const [mapOpen, setMapOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="../" className="text-xl font-bold text-primary-700">HealthLegal</a>
          <nav aria-label="ページ内" className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <a href="#feature-map" className="hover:text-primary-700">機能</a>
            <a href="#proof" className="hover:text-primary-700">実績</a>
            <a href="#assets" className="hover:text-primary-700">提供内容</a>
            <a href="#pricing" className="hover:text-primary-700">料金</a>
            <a href="#faq" className="hover:text-primary-700">よくある質問</a>
          </nav>
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
              3省2ガイドラインの対策416項目すべてに、実案件で検証した標準回答・規程・設計書・実装を整備。
              期間と費用を抑えながら、医療機関の審査で求められる水準まで詳細に対応します。
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

        {/* 416項目の行き先（帯グラフ）＋ 期間・費用・受け取るもの */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">
              416項目のうち、個別検討は約50件
            </h2>
            <p className="text-slate-600 text-center leading-relaxed max-w-3xl mx-auto mb-10">
              3省2ガイドラインが事業者に求める対策は416項目。
              全項目に標準回答を整備しており、個別検討は1割強にとどまります。
            </p>
            <div className="hidden sm:flex w-full h-16 rounded-xl overflow-hidden border border-slate-200" role="img" aria-label="416項目の内訳: 独自ノウハウ・戦略的な設計により対象外167件、標準回答を適用196件、要件に応じて個別対応 約50件">
              {funnel.map((f) => (
                <div key={f.title} className={`flex items-center justify-center font-bold tabular-nums ${f.bar}`} style={{ width: `${f.share}%` }}>
                  <span className="text-2xl">{f.count}</span>
                  <span className="text-sm ml-0.5">{f.unit}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
              {funnel.map((f) => (
                <div key={f.title} className="sm:px-1">
                  <p className="flex items-baseline gap-2 mb-1">
                    <span aria-hidden="true" className={`inline-block w-3 h-3 rounded-sm shrink-0 ${f.dot}`} />
                    <span className="text-2xl font-bold text-slate-900 tabular-nums">{f.count}<span className="text-sm font-semibold ml-0.5">{f.unit}</span></span>
                    <span className="text-sm text-slate-500">（{f.share}%）</span>
                  </p>
                  <p className="font-bold text-slate-900 mb-1">{f.title}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
            <dl className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
              {quickFacts.map((q) => (
                <div key={q.label} className="bg-slate-50 rounded-xl px-6 py-5 border border-slate-200">
                  <dt className="text-xs font-bold tracking-wider text-primary-700 mb-1">{q.label}</dt>
                  <dd>
                    <p className="text-xl font-bold text-slate-900 mb-1">{q.value}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{q.desc}</p>
                    {"href" in q && (
                      <a href={q.href} className="inline-block mt-2 text-sm font-semibold text-primary-700 underline underline-offset-4 hover:text-primary-800">{q.link}</a>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            {/* 紙の対応で終わらない、が典型的コンサルとの差別化。範囲の詳細は商談で扱う */}
            <p className="mt-8 text-center text-slate-700 leading-relaxed">
              <strong className="font-semibold text-slate-900">文書整備にとどまりません。</strong>
              規程・設計書から実装まで、一貫して提供します。
            </p>
          </div>
        </section>

        {/* 機能構成図（bht-saas-kit compliance/feature_map.py の生成物 docs/feature-map.svg の写し。
            キット側で再生成したら public/img/feature-map.svg も差し替える） */}
        <section id="feature-map" className="scroll-mt-20 py-20 px-4 sm:px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <p className="text-center text-sm font-bold tracking-wider text-primary-700 mb-3">高水準のセキュリティ</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-6">
              医療機関の審査で問われる機能を、あらかじめ搭載
            </h2>
            <p className="text-slate-600 text-center leading-relaxed max-w-3xl mx-auto mb-10">
              二要素認証、改ざんできない監査ログ、医療機関ごとのデータ分離など、SDS（医療情報セキュリティ開示書）で確認されるセキュリティ機能を基盤に組み込んでいます。
              貴社は図中の「貴社の業務機能」の開発に専念できます。各機能に JAHIS SDS Ver.5.0 の設問番号を併記しています。
            </p>
            <a href="../img/feature-map.svg" target="_blank" rel="noopener noreferrer" className="hidden md:block">
              <img
                src="../img/feature-map.svg"
                alt="機能構成図: 利用者、Webアプリの画面、貴社の業務機能が載る位置、AWS上の認証・アカウント、権限・テナント分離、記録・監査、データ保護・可用性、開発・運用の各機能と、文書パック"
                width={1600}
                height={900}
                className="w-full h-auto rounded-xl border border-slate-200 bg-white shadow-sm"
              />
            </a>
            {/* スマホ幅では縦長版（同じ生成器の docs/feature-map-mobile.svg の写し） */}
            <div className={`md:hidden relative rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden ${mapOpen ? "" : "max-h-[34rem]"}`}>
              <img
                src="../img/feature-map-mobile.svg"
                alt="機能構成図（縦長版）: Webアプリの画面、貴社の業務機能が載る位置、AWS上の各機能、文書パック"
                width={720}
                height={3894}
                className="w-full h-auto"
              />
              {!mapOpen && (
                <div className="absolute inset-x-0 bottom-0 pt-16 pb-4 bg-gradient-to-t from-white via-white/95 to-transparent text-center">
                  <button
                    type="button"
                    onClick={() => setMapOpen(true)}
                    className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    図の全体を表示
                  </button>
                </div>
              )}
            </div>
            <p className="mt-3 text-xs text-slate-500 text-center"><span className="hidden md:inline">クリックで拡大。</span>ガイドラインへの準拠を保証するものではありません。</p>

            {/* 画面例（bht-saas-kit のデモ表示を撮影。デモ用データで、製品名・色は差し替え可能） */}
            <h3 className="mt-16 text-xl font-bold text-slate-900 text-center mb-2">画面例</h3>
            <p className="text-sm text-slate-600 text-center mb-8">基盤に含まれる管理画面です（デモ用データ）。製品名・配色・ロゴは貴社のブランドに差し替えます。</p>
            <div className="flex md:grid md:grid-cols-2 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-2 md:pb-0">
              {kitScreens.map((k) => (
                <figure key={k.file} className="m-0 shrink-0 w-[85%] md:w-auto snap-center">
                  <a href={`../img/kit/${k.file}.webp`} target="_blank" rel="noopener noreferrer" className="block">
                    <img
                      src={`../img/kit/${k.file}.webp`}
                      alt={`画面例: ${k.title}`}
                      width={1280}
                      height={800}
                      loading="lazy"
                      className="w-full h-auto rounded-xl border border-slate-200 bg-white shadow-sm"
                    />
                  </a>
                  <figcaption className="mt-3">
                    <p className="font-bold text-slate-900">{k.title}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{k.body}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* 課題（選定基準と3枚のカードまで。内訳の階段は折りたたみ） */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-6">
              医療領域の新規事業では、スピード・費用・品質の両立が難しい
            </h2>
            <p className="text-slate-700 leading-relaxed text-center max-w-3xl mx-auto mb-8">
              医療情報を扱うサービスの提供事業者には、厚労省・経産省・総務省の3文書（計数百ページ）、416項目への対応が求められます。
              体制の小さい新規事業ほど、スピード・費用・品質のいずれかが犠牲になりやすくなります。
            </p>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="hidden sm:grid grid-cols-[7rem_1fr_1fr] bg-slate-100 text-sm font-bold text-slate-700">
                <p className="px-5 py-3" />
                <p className="px-5 py-3">自力で対応する場合</p>
                <p className="px-5 py-3 text-primary-800">本パッケージを使う場合</p>
              </div>
              {tradeoffs.map((t) => (
                <div key={t.axis} className="grid grid-cols-1 sm:grid-cols-[7rem_1fr_1fr] border-t border-slate-200 first:border-t-0 sm:first:border-t">
                  <p className="px-5 pt-4 sm:py-5 font-bold text-slate-900">{t.axis}</p>
                  <p className="px-5 py-2 sm:py-5 text-slate-600 leading-relaxed"><span className="sm:hidden text-xs font-bold text-slate-500 block">自力で対応する場合</span>{t.pain}</p>
                  <p className="px-5 pb-4 pt-2 sm:py-5 bg-primary-50/60 text-slate-900 font-semibold leading-relaxed"><span className="sm:hidden text-xs font-bold text-primary-700 block">本パッケージを使う場合</span>{t.answer}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">スピード・費用の比較は自社試算です。体制・単価の前提はご相談時に提示します。</p>
            <p className="mt-6 text-slate-700 leading-relaxed text-center">
              <strong className="font-semibold text-slate-900">スピードと高い品質を両立します。</strong>
              検証済みのアセットにより、短期間でも詳細まで設計された対応を実現します。
            </p>

            {/* 数値の正本: bht-ops docs/3m2g-volume-framing.md 1章。LP では直接編集せず正本を写す */}
            <div id="volume-ladder" className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">対応のゴールは、医療機関の選定基準を満たすこと</h3>
              <p className="text-slate-700 leading-relaxed mb-6">
                医療機関は、厚労省ガイドライン第7.0版の確認事項99項目で事業者を選定します。
                基準は「全項目が『はい』または『対象外』」です。
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {volumeHeadline.map((h) => (
                  <div key={h.label} className="rounded-xl bg-primary-50 border border-primary-100 p-5 text-center">
                    <p className="text-3xl font-bold text-primary-700 tabular-nums">{h.number}</p>
                    <p className="font-semibold text-slate-900 mt-1">{h.label}</p>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">{h.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-slate-700 leading-relaxed">
                SDS を提出できず医療機関との契約が止まると、損失は年間数百万円規模に及ぶことがあります。
                同ガイドラインは令和9年度までの二要素認証の採用も求めており、未対応の事業者はシステム更新時の選定から外れるおそれがあります。
              </p>
              <details className="mt-6 group">
                <summary className="cursor-pointer text-sm font-semibold text-primary-700 hover:text-primary-800 list-none flex items-center gap-1.5">
                  <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                  判断が必要な箇所の内訳（合計1,000超）
                </summary>
                <div className="mt-4 border-t border-slate-200 pt-5">
                  <ol className="space-y-3">
                    {volumeLadder.map((row) => (
                      <li key={row.label} className="flex items-start gap-4">
                        <span className="shrink-0 w-20 sm:w-28 text-right text-2xl font-bold text-primary-700 tabular-nums">{row.number}</span>
                        <div className="min-w-0 pt-1">
                          <p className="font-semibold text-slate-900">{row.label}</p>
                          <p className="text-sm text-slate-600 leading-relaxed">{row.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-5 text-sm text-slate-700 leading-relaxed">
                    判断が必要な箇所は合計で1,000を超えます（416＋371＋99＋160＋別版参照202）。当社アセットの機械集計による件数です。
                  </p>
                </div>
              </details>
              <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-5">
                <p className="font-semibold text-slate-900 mb-2">必要な範囲は段階に応じて選択できます</p>
                <ul className="text-sm text-slate-700 leading-relaxed space-y-1">
                  <li><span className="font-semibold text-primary-700">PoC・初期導入:</span> 医療機関への回答を先に整備（S1／S2）。99項目への回答と規程類で選定の入口を通過</li>
                  <li><span className="font-semibold text-primary-700">本製品化:</span> 全層を整備（S3／S4）。AWS 設定値レベルの設計書を含め、監査・引き継ぎに耐える構成</li>
                  <li><span className="font-semibold text-primary-700">改定への追従:</span> 直近の改定では416項目のうち300項目超で参照条文が変更。年間更新（20万円／年）で再判定と差し替え版を提供</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 要件から実装までの紐づけ（1項目の例）と、品質を担保する仕組み */}
        <section className="py-24 px-6 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-4">
              ガイドラインの要件から実装まで、戦略的に対応
            </h2>
            <p className="text-slate-600 text-center leading-relaxed max-w-3xl mx-auto mb-10">
              ガイドラインの要件、医療機関の確認事項、規程の条文、システムの実装を相互に紐づけています。
              照会や監査には根拠を示して回答でき、担当者が交代しても判断の経緯が残ります。
            </p>
            <p className="text-sm font-semibold text-slate-500 mb-3">例: パスワードの世代管理</p>
            <ol className="grid grid-cols-1 lg:grid-cols-5 gap-3">
              {traceSteps.map((t, i) => (
                <li key={t.layer} className="relative bg-white rounded-xl border border-slate-200 p-5">
                  <p className="text-xs font-bold tracking-wider text-primary-700 mb-1"><span className="mr-1.5">{i + 1}</span>{t.layer}</p>
                  <p className="font-bold text-slate-900 leading-snug mb-2">{t.body}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{t.ref}</p>
                  {i < traceSteps.length - 1 && (
                    <span aria-hidden="true" className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 w-6 h-6 items-center justify-center rounded-full bg-primary-600 text-white text-xs">→</span>
                  )}
                </li>
              ))}
            </ol>
            <p className="mt-6 text-center text-sm text-slate-600">416項目のそれぞれに、この紐づけがあります。</p>
            <h3 className="mt-16 text-xl font-bold text-slate-900 text-center mb-8">高い品質を支える3つの検証</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {qualityChecks.map((q) => (
                <div key={q.title} className="bg-white rounded-xl border border-slate-200 p-6">
                  <p className="font-bold text-slate-900 mb-2">{q.title}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{q.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 実績 */}
        <section id="proof" className="scroll-mt-20 py-24 px-6 bg-primary-950">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">実案件への適用で検証済み</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {proofs.map((x) => (
                <div key={x.label} className="rounded-xl bg-white/5 border border-primary-800 p-7">
                  <p className="text-xs font-bold tracking-wider text-primary-300 mb-2">{x.label}</p>
                  <p className="text-2xl font-bold text-white mb-3">{x.value}</p>
                  <p className="text-sm text-primary-100 leading-relaxed">{x.body}</p>
                </div>
              ))}
            </div>
            {/* 人的な信頼の担保。運営者個人名は非公開の方針のため、役割・経験ベースで記載 */}
            <div className="mt-10 pt-8 border-t border-primary-800 max-w-3xl mx-auto text-center">
              <p className="text-white font-semibold mb-2">監修体制</p>
              <p className="text-primary-200 text-sm leading-relaxed">
                メドテック企業での CTO 経験を持ち、SaMD の薬事対応、クラウドセキュリティ構築、プロダクト開発を実務で担ってきたメンバーが、
                標準回答と文書ひな形を監修しています。医療機器プログラムから非医療機器のヘルスケアサービスまで、複数製品の開発・法令対応で得た判断を反映しています。
              </p>
            </div>
          </div>
        </section>

        <MidCta position="after_proof" heading="貴社の対応範囲を、無料相談で提示します" />

        {/* 提供アセットの全体像（数字カード4枚＋折りたたみ詳細）。
            「数字 → 開示 → CTA」の流れにするため、MDS/SDS開示セクションの直前に置く。
            id="assets" は記事からの誘導先アンカー（bht-ops#109） */}
        <section id="assets" className="scroll-mt-20 py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-6">
              提供アセットの全体像
            </h2>
            <p className="text-slate-600 text-center leading-relaxed max-w-3xl mx-auto mb-12">
              提供するアセットの件数です。いずれも実在する成果物で、商談時に現物を確認いただけます。
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
            <div className="mt-12 flex flex-col md:flex-row items-center gap-6 rounded-2xl border border-primary-200 bg-primary-50/50 p-6 sm:p-8">
              <div className="flex-1">
                <p className="text-xs font-bold tracking-wider text-primary-700 mb-1">サンプル資料（PDF・10ページ）</p>
                <p className="text-lg font-bold text-slate-900 mb-2">成果物の実物を、抜粋でご確認いただけます</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  機能構成図、医療情報セキュリティ開示書（SDS Ver.5.0）、対応状況表、運用管理規程の抜粋。架空の事業者を例に、当社の生成ツールで作成しています。
                </p>
              </div>
              <a
                href={SAMPLE_PDF}
                onClick={() => sendEvent("sample_download", { position: "assets" })}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                サンプル資料を見る
              </a>
            </div>
          </div>
        </section>

        {/* MDS/SDS 99項目への回答方針 */}
        <section className="py-24 px-6 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-6">
              医療機関の確認事項99項目、すべてに回答方針を整備済み
            </h2>
            <p className="text-slate-600 text-center leading-relaxed max-w-3xl mx-auto mb-12">
              ガイドライン第7.0版では、医療機関が事業者を選定する際の公式な確認事項として
              MDS（製造業者向け）41項目・SDS（サービス事業者向け）58項目の
              計99項目が示され、「全項目が『はい』または『対象外』である事業者を選定すること」と明記されました。
              本パッケージは、この99項目について項目単位で回答方針と根拠を整理しています。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mdsSdsPoints.map((p, i) => (
                <div key={p.title} className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
                  <p className="text-primary-600 font-bold text-sm mb-2">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{p.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 料金（アセットの使用範囲で階段状） */}
        <section id="pricing" className="scroll-mt-20 py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-6">料金</h2>
            <p className="text-slate-600 text-center leading-relaxed max-w-3xl mx-auto mb-12">
              提供範囲に応じた4プランです。
              比較対象は、SDS を提出できず止まる医療機関との契約（年間数百万円規模）と、
              自力対応に要する数百万〜1,000万円・4〜6ヶ月です。
              PoC・初期導入では S1／S2 で医療機関への回答を整え、本製品化で S3・S4 へ進む段階的な利用が可能です。
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

        <MidCta position="after_pricing" heading="最適なプランを、無料相談で提案します" />

        {/* 進め方 */}
        <section className="py-24 px-6 bg-slate-50">
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

        {/* よくある質問 */}
        <section id="faq" className="scroll-mt-20 py-24 px-6 bg-slate-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">よくある質問</h2>
            <div className="space-y-3">
              {faqs.map((f) => (
                <details key={f.q} className="group bg-white rounded-xl border border-slate-200 px-6 py-5">
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-bold text-slate-900">
                    <span>{f.q}</span>
                    <span aria-hidden="true" className="text-primary-600 transition-transform group-open:rotate-45 text-xl leading-none">＋</span>
                  </summary>
                  <p className="mt-4 text-slate-700 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="py-24 px-6 bg-slate-900">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              まずは対応範囲の目安から
            </h2>
            <p className="text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
              製品の概要を伺い、設計選択で対象外にできる範囲と、個別検討として残る件数の目安を、初回相談（無料）で提示します。
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
              自社の状況を先に確認したい方は{" "}
              <a href="../sds-check/" className="text-white font-semibold underline underline-offset-4 hover:text-accent-300">
                SDS ギャップ診断（無料・3分）
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 bg-slate-950">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} HealthLegal
          </p>
        </div>
      </footer>
    </>
  );
}
