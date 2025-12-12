# シャッフルランチアプリ 仕様書

## 1. アプリケーション概要

シャッフルランチアプリは、参加者を3-4人のグループに自動振り分けし、各グループに行き先をランダムに割り当てるWebアプリケーションです。

### 主な機能
- 参加者の登録・削除・一覧表示
- 行き先の登録・削除・一覧表示
- 参加者を3-4人のグループに自動振り分け
- 各グループに行き先をランダムに割り当て
- グループ分け結果の表示

## 2. 技術スタック

### バックエンド
- **フレームワーク**: Hono (TypeScript)
- **ランタイム**: Node.js (>=20.0.0)
- **データベース**: PostgreSQL 15
- **データベースクライアント**: pg (PostgreSQLクライアント)

### フロントエンド
- HTML + CSS + JavaScript (サーバーサイドレンダリング)
- レスポンシブデザイン対応

## 3. データベーススキーマ

### テーブル構成

#### participants (参加者テーブル)
- `id`: SERIAL PRIMARY KEY
- `name`: VARCHAR(100) NOT NULL
- `created_at`: TIMESTAMP DEFAULT NOW()

#### destinations (行き先テーブル)
- `id`: SERIAL PRIMARY KEY
- `name`: VARCHAR(200) NOT NULL
- `created_at`: TIMESTAMP DEFAULT NOW()

#### groups (グループテーブル)
- `id`: SERIAL PRIMARY KEY
- `destination_id`: INTEGER REFERENCES destinations(id) ON DELETE SET NULL
- `created_at`: TIMESTAMP DEFAULT NOW()

#### group_members (グループメンバーテーブル)
- `id`: SERIAL PRIMARY KEY
- `group_id`: INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE
- `participant_id`: INTEGER NOT NULL REFERENCES participants(id) ON DELETE CASCADE
- `created_at`: TIMESTAMP DEFAULT NOW()
- UNIQUE(group_id, participant_id)

### インデックス
- `idx_group_members_group_id` ON group_members(group_id)
- `idx_group_members_participant_id` ON group_members(participant_id)
- `idx_groups_destination_id` ON groups(destination_id)

## 4. API仕様

### 参加者管理 API (`/api/participants`)

#### GET /api/participants
参加者一覧を取得

**レスポンス**
```json
{
  "participants": [
    {
      "id": 1,
      "name": "山田太郎",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/participants
参加者を登録

**リクエストボディ**
```json
{
  "name": "山田太郎"
}
```

**レスポンス** (201 Created)
```json
{
  "participant": {
    "id": 1,
    "name": "山田太郎",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### DELETE /api/participants/:id
参加者を削除

**レスポンス**
```json
{
  "message": "参加者を削除しました"
}
```

### 行き先管理 API (`/api/destinations`)

#### GET /api/destinations
行き先一覧を取得

**レスポンス**
```json
{
  "destinations": [
    {
      "id": 1,
      "name": "イタリアンレストラン「トラットリア」",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/destinations
行き先を登録

**リクエストボディ**
```json
{
  "name": "イタリアンレストラン「トラットリア」"
}
```

**レスポンス** (201 Created)
```json
{
  "destination": {
    "id": 1,
    "name": "イタリアンレストラン「トラットリア」",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### DELETE /api/destinations/:id
行き先を削除

**レスポンス**
```json
{
  "message": "行き先を削除しました"
}
```

### グループ分け API (`/api/groups`)

#### POST /api/groups/shuffle
グループ分けを実行

**処理内容**
1. 既存のグループとメンバーを削除
2. 参加者を3-4人のグループに振り分け
3. 各グループに行き先をランダムに割り当て
4. データベースに保存

**バリデーション**
- 参加者は3人以上必要
- 行き先が1つ以上登録されている必要がある

**レスポンス** (201 Created)
```json
{
  "groups": [
    {
      "id": 1,
      "destination": {
        "id": 1,
        "name": "イタリアンレストラン「トラットリア」"
      },
      "members": [
        {
          "id": 1,
          "name": "山田太郎"
        },
        {
          "id": 2,
          "name": "佐藤花子"
        },
        {
          "id": 3,
          "name": "鈴木一郎"
        }
      ]
    }
  ]
}
```

**エラーレスポンス** (400 Bad Request)
```json
{
  "error": "参加者は3人以上必要です"
}
```
または
```json
{
  "error": "行き先が登録されていません"
}
```

#### GET /api/groups
グループ分け結果一覧を取得

**レスポンス**
```json
{
  "groups": [
    {
      "id": 1,
      "destination": {
        "id": 1,
        "name": "イタリアンレストラン「トラットリア」"
      },
      "members": [
        {
          "id": 1,
          "name": "山田太郎"
        }
      ],
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### GET /api/groups/:id
特定グループの詳細を取得

**レスポンス**
```json
{
  "group": {
    "id": 1,
    "destination": {
      "id": 1,
      "name": "イタリアンレストラン「トラットリア」"
    },
    "members": [
      {
        "id": 1,
        "name": "山田太郎"
      }
    ],
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### DELETE /api/groups/:id
グループを削除

**レスポンス**
```json
{
  "message": "グループを削除しました"
}
```

## 5. グループ分けアルゴリズム

### 実装詳細

1. **参加者のシャッフル**
   - Fisher-Yatesアルゴリズムを使用して参加者リストをランダムにシャッフル

2. **グループ分割**
   - シャッフルされた参加者を4人ずつグループに分割
   - 最後のグループが2人以下の場合は、前のグループに統合
   - 例: 30人の場合 → 7グループ（4, 4, 4, 4, 4, 4, 6人）

3. **行き先の割り当て**
   - 行き先リストをシャッフル
   - 各グループに行き先を順番に割り当て
   - 行き先がグループ数より少ない場合は、繰り返し使用

### ファイル
- `src/utils/shuffle.ts`

## 6. UI/UX仕様

### 画面構成

#### 1. メイン画面（グループ分け実行） - `/`
- ナビゲーションバー
- グループ分け実行ボタン
- グループ分け結果表示エリア
  - グループカード（左側）
  - 行き先カード（右側）

#### 2. 参加者管理画面 - `/participants`
- ナビゲーションバー
- 参加者追加フォーム
- 参加者一覧表示（削除ボタン付き）

#### 3. 行き先管理画面 - `/destinations`
- ナビゲーションバー
- 行き先追加フォーム
- 行き先一覧表示（削除ボタン付き）

### デザイン仕様

#### カラースキーム
- 背景: グラデーション（#667eea → #764ba2）
- グループカード: グラデーション（#667eea → #764ba2）
- 行き先カード: グラデーション（#f093fb → #f5576c）
- グループ分けボタン: グラデーション（#f093fb → #f5576c）
- 削除ボタン: #dc3545

#### レスポンシブデザイン
- モバイル（480px未満）: 1列表示
- タブレット（480px以上）: 2列表示
- 中サイズ（768px以上）: 3列表示
- デスクトップ（1024px以上）: 4列表示
- 大きなデスクトップ（1280px以上）: 5列表示
- 超大画面（1600px以上）: 6列表示

#### グループ表示レイアウト
- グループカードと行き先カードを横並びに表示
- モバイル表示では縦並びに切り替え

## 7. ファイル構成

```
src/
├── index.ts                 # メインアプリケーション、ルーティング
├── db/
│   ├── connection.ts       # データベース接続設定
│   ├── init.ts             # データベース初期化
│   ├── schema.sql          # テーブル作成SQL
│   └── seed.ts             # テストデータ登録スクリプト
├── routes/
│   ├── participants.ts     # 参加者APIルート
│   ├── destinations.ts     # 行き先APIルート
│   └── groups.ts           # グループAPIルート
├── utils/
│   └── shuffle.ts          # グループ分けアルゴリズム
└── views/
    └── common.ts           # 共通スタイルとナビゲーション
```

## 8. 環境変数

### データベース接続設定
- `DB_HOST`: データベースホスト（デフォルト: localhost）
- `DB_PORT`: データベースポート（デフォルト: 5432）
- `DB_NAME`: データベース名（デフォルト: mydb）
- `DB_USER`: データベースユーザー（デフォルト: user）
- `DB_PASSWORD`: データベースパスワード（デフォルト: password）

### サーバー設定
- `PORT`: サーバーポート（デフォルト: 3000）

## 9. セットアップ手順

### 1. 依存関係のインストール
```bash
npm install
```

### 2. データベースの起動
PostgreSQLが起動していることを確認（docker-compose.ymlを使用する場合）

### 3. データベーススキーマの初期化
アプリケーション起動時に自動的にスキーマが作成されます

### 4. テストデータの登録（オプション）
```bash
npx tsx src/db/seed.ts
```

### 5. アプリケーションの起動
```bash
npm run dev
```

### 6. ブラウザでアクセス
http://localhost:3000

## 10. エラーハンドリング

### バリデーションエラー
- 参加者名・行き先名が空の場合: 400 Bad Request
- 参加者が3人未満でグループ分け実行: 400 Bad Request
- 行き先が0件でグループ分け実行: 400 Bad Request

### データベースエラー
- 接続エラー: エラーログを出力し、アプリケーションは続行
- テーブルが既に存在する場合: エラーを無視して続行

## 11. 今後の拡張案

- グループ分け履歴の保存・表示
- グループ分け結果のエクスポート（CSV、PDF）
- 参加者の希望行き先設定
- グループ分けアルゴリズムのカスタマイズ（グループサイズの指定など）
- 認証・認可機能
- 複数のイベント管理

