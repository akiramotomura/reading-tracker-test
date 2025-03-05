# Vercelでのデプロイ手順

読書記録アプリをVercelにデプロイする手順を詳しく説明します。

## 前提条件

1. GitHubアカウントを持っていること
2. Vercelアカウントを持っていること（GitHubアカウントでサインアップ可能）
3. 読書記録アプリのコードがGitHubリポジトリにプッシュされていること

## 1. Vercelアカウントにログイン

1. [Vercel](https://vercel.com/)にアクセスします。
2. GitHubアカウントでログインします（「Continue with GitHub」ボタンをクリック）。

## 2. 新しいプロジェクトの作成

1. ダッシュボードから「Add New...」→「Project」をクリックします。
2. 「Import Git Repository」セクションで、「akiramotomura/reading-tracker」リポジトリを選択します。

## 3. プロジェクト設定

プロジェクト設定画面で、以下の設定を確認・変更します：

1. **Project Name**: デフォルトでは「reading-tracker」となっていますが、必要に応じて変更できます。
2. **Framework Preset**: 自動的に「Next.js」が選択されているはずです。
3. **Root Directory**: デフォルトのままで問題ありません。
4. **Build and Output Settings**: デフォルトのままで問題ありません。

## 4. 環境変数の設定

「Environment Variables」セクションで、以下の環境変数を設定します：

| 名前 (NAME) | 値 (VALUE) |
|------------|-----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyApbnAZAZzQaqtsAzGB9j_ecQQjor10y80` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `reading-tracker-plan.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `reading-tracker-plan` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `reading-tracker-plan.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `102687335111` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:102687335111:web:25bfe912fe4813f96d94e2` |

環境変数の設定方法の詳細については、[VERCEL_ENV_SETUP.md](./VERCEL_ENV_SETUP.md)を参照してください。

## 5. デプロイの開始

すべての設定が完了したら、「Deploy」ボタンをクリックしてデプロイを開始します。

## 6. デプロイの進行状況の確認

デプロイが開始されると、Vercelはリポジトリからコードを取得し、ビルドプロセスを実行します。このプロセスには数分かかることがあります。

デプロイの進行状況は、リアルタイムで表示されます：

1. **Building**: プロジェクトのビルド中
2. **Deploying**: ビルドされたアプリケーションのデプロイ中
3. **Ready**: デプロイ完了

## 7. デプロイの確認

デプロイが完了すると、「Congratulations!」というメッセージとともに、デプロイされたアプリケーションのURLが表示されます。

このURLをクリックすると、デプロイされたアプリケーションにアクセスできます。

## 8. ドメイン設定（オプション）

デフォルトでは、Vercelは「project-name.vercel.app」という形式のURLを提供します。カスタムドメインを設定したい場合は、以下の手順に従います：

1. プロジェクトダッシュボードで「Domains」タブをクリックします。
2. 「Add」ボタンをクリックし、使用したいドメインを入力します。
3. 画面の指示に従って、DNSレコードを設定します。

## 9. 継続的デプロイ

Vercelは継続的デプロイをサポートしています。GitHubリポジトリの`main`ブランチに変更をプッシュするたびに、Vercelは自動的に新しいデプロイを作成します。

## トラブルシューティング

デプロイに問題がある場合は、以下を確認してください：

1. ビルドログでエラーメッセージを確認する
2. 環境変数が正しく設定されているか確認する
3. プロジェクト設定が正しいか確認する

問題が解決しない場合は、Vercelのドキュメントを参照するか、サポートに問い合わせてください。