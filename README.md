# 読書記録アプリ

幼児の親が子供の読書記録を簡単に管理できるWEBアプリケーションです。

## 主な機能

- **読書記録管理**: 本のタイトル、著者、読んだ日付、読んだ回数、お気に入り度、子供の反応などを記録
- **本の管理**: お気に入りの本のリストを作成・管理
- **読書分析**: 読書の傾向分析やお気に入りの本のランキング表示
- **読書目標**: 読書習慣を身につけるための目標設定と達成状況の追跡

## 技術スタック

- **フロントエンド**: Next.js, React, TypeScript, Tailwind CSS
- **認証**: Firebase Authentication
- **データ管理**: React Context API (将来的にはFirebase Firestoreと連携予定)

## 開発環境のセットアップ

1. リポジトリをクローン
   ```
   git clone https://github.com/yourusername/reading-tracker.git
   cd reading-tracker
   ```

2. 依存パッケージをインストール
   ```
   npm install
   ```

3. 環境変数の設定
   `.env.local`ファイルを作成し、以下の内容を設定:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

4. 開発サーバーを起動
   ```
   npm run dev
   ```

5. ブラウザで `http://localhost:3000` にアクセス

## デプロイ

このプロジェクトはVercelにデプロイされています。メインブランチへのプッシュが自動的にデプロイされます。

## 今後の拡張予定

1. Firebase Firestoreとの連携によるデータの永続化
2. 複数の子供の読書記録を管理する機能
3. 外部APIと連携した本の情報の自動取得
4. 読書記録の共有機能

## ライセンス

MIT

## 作者

[Your Name](https://github.com/yourusername)
