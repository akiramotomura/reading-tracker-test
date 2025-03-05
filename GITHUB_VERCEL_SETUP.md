# GitHubとVercelへのデプロイ手順

## GitHubリポジトリの作成とプッシュ

1. GitHubにログインし、新しいリポジトリを作成します。
   - リポジトリ名: `reading-tracker`
   - 説明: 幼児の親が子供の読書記録を管理するWEBアプリ
   - 公開設定: Public または Private
   - READMEファイルの追加: チェックを外す（既に作成済み）

2. リモートリポジトリを設定し、コードをプッシュします。
   ```bash
   git remote add origin https://github.com/yourusername/reading-tracker.git
   git branch -M main
   git push -u origin main
   ```

## Vercelへのデプロイ

1. [Vercel](https://vercel.com/)にアクセスし、GitHubアカウントでログインします。

2. 「New Project」をクリックします。

3. 「Import Git Repository」セクションで、先ほど作成した`reading-tracker`リポジトリを選択します。

4. プロジェクト設定画面で、以下の環境変数を設定します：
   - `NEXT_PUBLIC_FIREBASE_API_KEY`: Firebase APIキー
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase認証ドメイン
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Firebaseプロジェクトのプロジェクトid
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebaseストレージバケット
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebaseメッセージ送信者ID
   - `NEXT_PUBLIC_FIREBASE_APP_ID`: FirebaseアプリID

5. 「Deploy」ボタンをクリックしてデプロイを開始します。

6. デプロイが完了すると、Vercelによって生成されたURLでアプリケーションにアクセスできます。

## カスタムドメインの設定（オプション）

1. Vercelのプロジェクトダッシュボードで「Domains」タブをクリックします。

2. 「Add」ボタンをクリックし、使用したいドメインを入力します。

3. 画面の指示に従って、DNSレコードを設定します。

## 継続的デプロイ

GitHubリポジトリの`main`ブランチに変更をプッシュするたびに、Vercelは自動的に新しいデプロイを作成します。これにより、常に最新のコードがデプロイされます。

## 開発フロー

1. 新しい機能を開発する場合は、新しいブランチを作成します。
   ```bash
   git checkout -b feature/new-feature
   ```

2. 変更を加え、コミットします。
   ```bash
   git add .
   git commit -m "Add new feature: XXX"
   ```

3. 変更をGitHubにプッシュします。
   ```bash
   git push origin feature/new-feature
   ```

4. GitHubでプルリクエストを作成し、レビュー後に`main`ブランチにマージします。

5. `main`ブランチへのマージ後、Vercelが自動的に新しいデプロイを作成します。