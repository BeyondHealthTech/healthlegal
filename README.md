# HealthLegal LP

Beyond HealthTech合同会社のサービスサイト（3省2ガイドライン対応・セキュリティ設計・開発支援）。

React + Vite + Tailwind CSS v4 の 1ページ構成（SPA・アンカーリンクのみ）。

## 開発

```bash
npm ci
npm run dev      # ローカル開発サーバー
npm run build    # 型チェック + 本番ビルド（dist/）
npm run preview  # ビルド結果の確認
npm run lint
```

## 配信先とベースパス

現在、次の2経路が存在する。

| 経路 | URL | 設定 |
|---|---|---|
| Vercel | https://healthlegal.vercel.app/ | GA4の実測トラフィックはこのホスト。ルート直下配信 |
| GitHub Pages | https://beyondhealthtech.github.io/healthlegal/ | `.github/workflows/deploy.yml`（`master` へのpushで発火） |

`vite.config.ts` の `base` は **相対パス `'./'`** にしてある。ルート直下配信とサブパス配信のどちらでも
同じビルド成果物が動くため。`'/healthlegal/'` に固定するとルート直下配信側でJS/CSSが404になり、
SPAが何も描画しない（＝クローラーからは空ページに見える）状態になる。

> **[要判断] 正規ホストの一本化**
> 同一内容が2つのホストで配信されていると重複コンテンツとなり、被リンク・評価が分散する。
> どちらを正とするか決めて、もう一方は停止するか正規ホストへリダイレクトするのが望ましい。
> 現状は `index.html` の `<link rel="canonical">`・`sitemap.xml`・`robots.txt` を
> **Vercel側（healthlegal.vercel.app）を正**として記載している。
> 独自ドメイン（例: legal.beyondhealthtech.com）へ移行する場合は、以下3ファイルの
> URLをまとめて置き換えること。
> - `index.html`（canonical / og:url）
> - `public/sitemap.xml`（`<loc>`）
> - `public/robots.txt`（`Sitemap:`）

## SEO

- `public/robots.txt` — 全クローラー許可 + サイトマップの所在
- `public/sitemap.xml` — 1ページ構成のためトップのみ
- `index.html` — `canonical` / OGP / Twitter Card / JSON-LD（ProfessionalService）

いずれも `public/` 配下なのでビルド時に `dist/` 直下へコピーされる。

> 注: `robots.txt` はホストのルート（`https://<host>/robots.txt`）に無いとクローラーに参照されない。
> GitHub Pages のプロジェクトページ配信（`/healthlegal/` 配下）では要件を満たせないため、
> この点でもルート直下配信のホストを正規にするのが望ましい。

### 残作業（[要Junya]）

- **Google Search Console への登録とサイトマップ送信**（Googleアカウント認証が必要なためJunya作業）
  1. https://search.google.com/search-console でプロパティ追加（URLプレフィックス型・正規ホストのURL）
  2. 所有権確認（HTMLタグ方式なら、発行された `<meta name="google-site-verification" ...>` を
     `index.html` の `<head>` に追記 → このリポジトリへコミット）
  3. 「サイトマップ」から `sitemap.xml` を送信
  4. 「URL検査」からトップページのインデックス登録をリクエスト
- SSG/プリレンダリング化の検討（現状はSPAのため、初期HTMLに本文テキストが含まれない）
