# CLAUDE.md - revenue-x

## プロジェクト概要

個人開発者向けの収益シミュレーター。ユーザーが支出（サーバー代、API利用料など）、収入（広告、サブスクなど）、期間（成長率、計算期間）を入力し、月次の収支推移グラフを出力するWebアプリケーション。

## 技術スタック

- **フレームワーク**: Next.js (App Router) + TypeScript
- **UI**: shadcn/ui + Tailwind CSS
- **グラフ**: Recharts
- **i18n**: next-intl（日本語 + 英語対応）
- **テスト**: Vitest（コアロジックのユニットテスト）
- **パッケージマネージャー**: pnpm
- **ホスティング**: Vercel
- **データ永続化**: LocalStorage（将来的にSupabaseまたはNeonDBへ移行予定。認証実装時はGoogle認証）

## コマンド

```bash
pnpm dev          # 開発サーバー起動
pnpm build        # プロダクションビルド
pnpm lint         # ESLint実行
pnpm test         # Vitestでユニットテスト実行
pnpm test:watch   # テストをウォッチモードで実行
```

## ディレクトリ構成

```
revenue-x/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/           # i18nルーティング
│   │   │   ├── layout.tsx      # ヘッダー・フッター配置
│   │   │   ├── page.tsx        # メインページ（シミュレーター）
│   │   │   ├── privacy/page.tsx # プライバシーポリシー
│   │   │   └── terms/page.tsx  # 利用規約
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # shadcn/uiコンポーネント
│   │   ├── expense-card.tsx    # 支出入力カード
│   │   ├── income-card.tsx     # 収入入力カード
│   │   ├── period-card.tsx     # ユーザー・期間入力カード
│   │   ├── stats-cards.tsx     # KPI指標カード（BEP・累積赤字）
│   │   ├── chart-card.tsx      # グラフ出力カード
│   │   ├── site-header.tsx     # 共通ヘッダー（タイトル・言語切替・テーマ切替）
│   │   ├── footer.tsx          # 共通フッター（copyright・法的ページリンク）
│   │   ├── legal-page.tsx      # 法的ページ共通レイアウト
│   │   ├── locale-toggle.tsx   # 言語切替ボタン（ja/en）
│   │   └── theme-toggle.tsx    # ダークモード切替
│   ├── lib/
│   │   ├── calc.ts             # 収支計算ロジック（純粋関数）
│   │   ├── storage.ts          # LocalStorage永続化
│   │   └── utils.ts            # shadcn/ui用ユーティリティ（cn関数など）
│   ├── i18n/
│   │   ├── routing.ts          # next-intlルーティング設定
│   │   └── navigation.ts       # ロケール対応Link・router
│   ├── hooks/
│   │   └── use-simulation.ts   # シミュレーション状態管理フック
│   ├── types/
│   │   └── index.ts            # 型定義
│   └── messages/
│       ├── ja.json             # 日本語メッセージ
│       └── en.json             # 英語メッセージ
├── __tests__/
│   └── calc.test.ts            # 計算ロジックのテスト
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

## UIレイアウト

- 2グリッドレイアウト（左:右 = 4:8）
- **左カラム**: 縦に3つのカードが並ぶ
  1. **支出入力カード** - 初期費用（1回のみ）、固定費（月額）、変動費（ユーザーあたり月額）、決済手数料（%）を動的に追加・削除可能
  2. **収入入力カード** - サブスクリプション（プラン名・月額・課金率・解約率）と広告（項目名・ユーザーあたり月額）を動的に追加・削除可能
  3. **ユーザー・期間設定カード** - 初期ユーザー数、計算期間（月数）、月次成長率（%）の入力
- **右カラム**: KPIカード + グラフ
  1. **KPI指標カード** - 損益分岐点（BEP月）と累積赤字（最大必要資金）の2枚を横並びで表示
  2. **グラフカード** - 折れ線グラフ（収入・支出・累計損益・ユーザー数の4本）+ BEP参照線
     - 左Y軸: 金額、右Y軸: ユーザー数、横軸: 月

## データモデル

```typescript
type InitialCostItem = {
  id: string;
  name: string;
  amount: number; // 初期費用（円）、1ヶ月目のみ計上
};

type FixedExpenseItem = {
  id: string;
  name: string;
  amount: number; // 月額（円）
};

type VariableExpenseItem = {
  id: string;
  name: string;
  amount: number; // 1ユーザーあたり月額（円）
};

type TransactionFeeItem = {
  id: string;
  name: string;
  rate: number; // 決済手数料（%）、サブスク売上に対して
};

type SubscriptionItem = {
  id: string;
  name: string;
  amount: number; // 1契約者あたり月額（円）
  conversionRate: number; // 課金率（%）
  churnRate: number;      // 解約率（%）
};

type AdItem = {
  id: string;
  name: string;
  amount: number; // 1ユーザーあたり月額（円）
};

type SimulationConfig = {
  initialCosts: InitialCostItem[];
  fixedExpenses: FixedExpenseItem[];
  variableExpenses: VariableExpenseItem[];
  transactionFees: TransactionFeeItem[];
  subscriptions: SubscriptionItem[];
  ads: AdItem[];
  periodMonths: number;       // 計算期間（月）
  monthlyGrowthRate: number;  // 月次成長率（%）
  initialUsers: number;       // 初期ユーザー数
};

type MonthlyData = {
  month: number;
  users: number;              // 当月ユーザー数
  subscribers: number;        // 当月契約者数
  totalExpense: number;
  totalIncome: number;
  profit: number;             // 当月損益
  cumulativeProfit: number;   // 累計損益
};
```

## 成長モデル

- ユーザー数は月次成長率（複利）で増加: `ユーザー数_n = 初期ユーザー数 × (1 + 成長率/100)^(n-1)`
- 契約者数: プランごとに独立して計算。毎月の新規ユーザー × 課金率 で新規契約、既存契約者 × 解約率 で解約
- サブスク収入: `Σ(プランごとの契約者数 × プラン単価)`
- 広告収入: `ユーザー数 × 広告単価合計`
- 初期費用: 1ヶ月目のみ支出に計上
- 固定費は毎月一定
- 変動費はユーザー数に比例: `変動費_n = ユーザーあたりコスト合計 × ユーザー数_n`
- 決済手数料: サブスク売上に対して `手数料 = サブスク収入 × (手数料率合計 / 100)` を支出に加算

## コーディング規約

- TypeScript strict modeを使用
- コンポーネントはfunction宣言で定義（`export function ComponentName()`）
- 計算ロジックは `lib/calc.ts` に純粋関数として集約し、テスト可能にする
- shadcn/uiの`cn()`ユーティリティでクラス名を結合
- ダークモード: shadcn/uiのテーマ切替機能（`next-themes`）を使用
- コミットメッセージは英語で、Conventional Commits形式（`feat:`, `fix:`, `chore:` など）
- コード中のコメントは日本語可

## 注意事項

- メインのシミュレーターページはSPA構成。法的ページ（プライバシーポリシー・利用規約）は独立ページ
- 入力変更時にリアルタイムでグラフを再計算・再描画する
- レスポンシブ対応: モバイルでは左右グリッドを上下に切り替え（左カラムが上、グラフが下）
- グラフのアニメーションは軽量に保つ（rechartsのデフォルトアニメーション程度）
- LocalStorageへの保存はdebounceして書き込み頻度を抑える

## グラフ・シミュレーション改善予定

1. ~~**損益分岐点（BEP）のハイライト表示**~~ ✅ — ReferenceLineで縦線を表示。線形補間で小数月にも対応
2. **Tooltipに通貨単位（¥）を追加** — Tooltipの金額表示に¥プレフィックスを付与
3. ~~**Y軸の大きな数値を短縮フォーマット**~~ ✅ — 閾値（100万）未満はフル表示（¥55,000）、以上はコンパクト表示（¥150万）。ロケール別にi18nメッセージで閾値・単位を管理
4. **月次損益（profit）の折れ線を追加** — 累計損益に加えて単月損益も表示し、単月黒字化タイミングを可視化
5. ~~**サマリー指標（KPIカード）の表示**~~ ✅ — BEP到達月と累積赤字（最大必要資金）を表示
6. ~~**ユーザー数の推移を第2Y軸で表示**~~ ✅ — 右側Y軸にユーザー数スケールを追加し、破線の折れ線で成長推移を重ねて表示
