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
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx        # メインページ（SPA構成）
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # shadcn/uiコンポーネント
│   │   ├── expense-card.tsx    # 支出入力カード
│   │   ├── income-card.tsx     # 収入入力カード
│   │   ├── period-card.tsx     # ユーザー・期間入力カード
│   │   ├── chart-card.tsx      # グラフ出力カード
│   │   └── theme-toggle.tsx    # ダークモード切替
│   ├── lib/
│   │   ├── calc.ts             # 収支計算ロジック（純粋関数）
│   │   ├── storage.ts          # LocalStorage永続化
│   │   └── utils.ts            # shadcn/ui用ユーティリティ（cn関数など）
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
  1. **支出入力カード** - 項目名と月額を動的に追加・削除可能（例: サーバー代 ¥2,000/月）
  2. **収入入力カード** - 項目名と月額を動的に追加・削除可能（例: 広告収入 ¥500/月）
  3. **期間・成長設定カード** - 計算期間（月数）、月次成長率（%）の入力
- **右カラム**: 1つのカードでグラフ表示
  - 積み上げ面グラフ（収入・支出を積み上げ、累計損益を折れ線で重ねる）
  - 横軸: 月、縦軸: 金額

## データモデル

```typescript
type ExpenseItem = {
  id: string;
  name: string;
  amount: number; // 月額（円）
};

type IncomeItem = {
  id: string;
  name: string;
  amount: number; // 月額（円）
};

type SimulationConfig = {
  expenses: ExpenseItem[];
  incomes: IncomeItem[];
  periodMonths: number;       // 計算期間（月）
  monthlyGrowthRate: number;  // 月次成長率（%）
};

type MonthlyData = {
  month: number;
  totalExpense: number;
  totalIncome: number;
  profit: number;             // 当月損益
  cumulativeProfit: number;   // 累計損益
};
```

## 成長モデル

- 月次成長率（複利）で収入が増加: `収入_n = 初月収入 × (1 + 成長率/100)^n`
- 支出は固定（成長に伴う変動は将来検討）

## コーディング規約

- TypeScript strict modeを使用
- コンポーネントはfunction宣言で定義（`export function ComponentName()`）
- 計算ロジックは `lib/calc.ts` に純粋関数として集約し、テスト可能にする
- shadcn/uiの`cn()`ユーティリティでクラス名を結合
- ダークモード: shadcn/uiのテーマ切替機能（`next-themes`）を使用
- コミットメッセージは英語で、Conventional Commits形式（`feat:`, `fix:`, `chore:` など）
- コード中のコメントは日本語可

## 注意事項

- SPAとして動作する。ページ遷移はなく、1ページで完結
- 入力変更時にリアルタイムでグラフを再計算・再描画する
- レスポンシブ対応: モバイルでは左右グリッドを上下に切り替え（左カラムが上、グラフが下）
- グラフのアニメーションは軽量に保つ（rechartsのデフォルトアニメーション程度）
- LocalStorageへの保存はdebounceして書き込み頻度を抑える
