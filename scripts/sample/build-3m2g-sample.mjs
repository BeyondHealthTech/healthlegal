import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
const hl = createRequire('/Users/junya/Desktop/BeyondHealthTech/bht/healthlegal/');
const { Marked } = hl('marked');
const kit = createRequire('/Users/junya/Desktop/BeyondHealthTech/bht/bht-saas-kit/frontend/');
const { chromium } = kit('playwright-core');
const S = process.argv[2];
const md = new Marked({ gfm: true });
const r = (f) => md.parse(readFileSync(`${S}/${f}`, 'utf8'));
const svg = readFileSync(`${S}/feature-map.svg`, 'utf8');
const section = (no, title, lead, html) => `
<section class="doc"><div class="band"><span>サンプル ${no}/4</span>${title}</div><p class="lead">${lead}</p><div class="body">${html}</div></section>`;
const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><style>
@page { size: A4; margin: 16mm 14mm 16mm; }
@page land { size: A4 landscape; }
.landsec { page: land; }
body { font-family: 'Hiragino Sans','Noto Sans JP',sans-serif; color:#0f172a; font-size:9.5pt; line-height:1.7; }
.cover { height: 250mm; display:flex; flex-direction:column; justify-content:center; page-break-after: always; }
.cover .eyebrow { color:#4338ca; font-weight:700; letter-spacing:.08em; font-size:11pt; }
.cover h1 { font-size:26pt; line-height:1.35; margin:8mm 0 6mm; }
.cover .sub { font-size:12pt; color:#334155; }
.cover ul { margin-top:12mm; font-size:10pt; color:#334155; padding-left:5mm }
.cover .note { margin-top:14mm; font-size:8.5pt; color:#64748b; border-top:1px solid #e2e8f0; padding-top:4mm }
.cover .brand { margin-top:auto; font-weight:700; color:#4338ca; font-size:13pt }
.doc { page-break-before: always; }
.band { background:#1e1b4b; color:#fff; font-weight:700; font-size:12pt; padding:3mm 5mm; border-radius:2mm; }
.band span { display:inline-block; font-size:8.5pt; color:#c7d2fe; margin-right:4mm; font-weight:600 }
.lead { color:#475569; font-size:9pt; margin:3mm 0 5mm; }
h1 { font-size:14pt; } h2 { font-size:12pt; margin-top:6mm; border-bottom:1px solid #e2e8f0; padding-bottom:1mm } h3 { font-size:10.5pt } h4 { font-size:10pt }
table { border-collapse:collapse; width:100%; font-size:8pt; margin:2mm 0 4mm; }
.body p strong:first-child { color:#3730a3 }
th, td { border:1px solid #cbd5e1; padding:1.2mm 1.6mm; vertical-align:top; } th { background:#f1f5f9; }
tr { page-break-inside: avoid; }
code { font-size:8pt; background:#f1f5f9; padding:0 1mm; border-radius:1mm }
blockquote { border-left:3px solid #a5b4fc; margin:2mm 0; padding:1mm 4mm; color:#334155; background:#eef2ff }
.map svg { width:100%; height:auto; }
.endnote { margin-top:8mm; font-size:8.5pt; color:#64748b; border-top:1px solid #e2e8f0; padding-top:3mm }
</style></head><body>
<div class="cover">
  <p class="eyebrow">3省2ガイドライン対応パッケージ</p>
  <h1>サンプル資料<br>（成果物の抜粋）</h1>
  <p class="sub">医療機関の審査で求められる文書と、その根拠となる実装の一部をご覧いただけます。</p>
  <ul>
    <li>1. 機能構成図（医療情報SaaS 基盤）</li>
    <li>2. 医療情報セキュリティ開示書（JAHIS SDS Ver.5.0）冒頭</li>
    <li>3. 3省2ガイドライン 対応状況表（416項目のうち冒頭）</li>
    <li>4. 運用管理規程（1〜3章）</li>
  </ul>
  <p class="note">本資料は架空の事業者「サンプル医療情報株式会社」を例に、当社の文書パック生成ツールで作成した成果物の抜粋です。実際の納品物は、貴社の構成と運用に合わせて作成します。本パッケージは3省2ガイドラインへの準拠を保証するものではありません。</p>
  <p class="brand">HealthLegal</p>
</div>
<section class="doc landsec"><div class="band"><span>サンプル 1/4</span>機能構成図</div>
<p class="lead">医療機関の審査で問われる機能を、画面と AWS 上の仕組みとして実装済み。各機能に JAHIS SDS Ver.5.0 の設問番号を併記しています。</p>
<div class="map">${svg.replace(/<\?xml[^>]*>/, '')}</div></section>
${section(2, '医療情報セキュリティ開示書（SDS Ver.5.0）', '全160問のうち冒頭の3分類と、備考5件を掲載。各回答の根拠を備考で示しています。', r('sds.md'))}
${section(3, '3省2ガイドライン 対応状況表', '416項目すべてについて、担保の種類（文書・実装・設計選択による対象外など）と担保先を示す表です。冒頭の14項目を掲載。', r('table.md'))}
${section(4, '運用管理規程', '規程の冒頭に「本規程が満たすガイドラインの要求」を置き、条文ごとに要件IDを付けています。1〜3章を掲載。', r('rule.md'))}
<p class="endnote">全体の構成・件数は https://healthlegal.beyondht.jp/3m2g/ をご覧ください。ご相談は同ページのフォームから受け付けています（初回無料）。</p>
</body></html>`;
writeFileSync(`${S}/sample.html`, html);
const b = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const p = await b.newPage();
await p.goto('file://' + S + '/sample.html', { waitUntil: 'networkidle' });
await p.pdf({ path: `${S}/sample.pdf`, format: 'A4', printBackground: true, displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: '<div style="font-size:7pt;color:#94a3b8;width:100%;text-align:center;font-family:Hiragino Sans,sans-serif">HealthLegal ・ 3省2ガイドライン対応パッケージ サンプル資料 ・ <span class="pageNumber"></span>/<span class="totalPages"></span></div>', margin: { top: '16mm', bottom: '16mm', left: '14mm', right: '14mm' } });
await b.close();
