# Vercelでの環境変数設定手順

読書記録アプリをVercelにデプロイする際の環境変数設定手順を詳しく説明します。

## 1. Vercelアカウントにログイン

1. [Vercel](https://vercel.com/)にアクセスします。
2. GitHubアカウントでログインします（「Continue with GitHub」ボタンをクリック）。

## 2. プロジェクトのインポート

1. ダッシュボードから「Add New...」→「Project」をクリックします。
2. 「Import Git Repository」セクションで、「akiramotomura/reading-tracker」リポジトリを選択します。

## 3. 環境変数の設定

プロジェクト設定画面で、以下の手順で環境変数を設定します：

1. 「Environment Variables」セクションを探します。
2. 以下の環境変数を**一つずつ**追加します：

| 名前 (NAME) | 値 (VALUE) |
|------------|-----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyApbnAZAZzQaqtsAzGB9j_ecQQjor10y80` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `reading-tracker-plan.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `reading-tracker-plan` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `reading-tracker-plan.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `102687335111` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:102687335111:web:25bfe912fe4813f96d94e2` |

各環境変数を追加する手順：

1. 「Add New」ボタンをクリックします。
2. 「NAME」フィールドに環境変数名（例：`NEXT_PUBLIC_FIREBASE_API_KEY`）を入力します。
3. 「VALUE」フィールドに対応する値（例：`AIzaSyApbnAZAZzQaqtsAzGB9j_ecQQjor10y80`）を入力します。
4. 「Add」ボタンをクリックして環境変数を追加します。
5. 上記の手順を繰り返して、すべての環境変数を追加します。

## 4. 環境変数のスコープ設定（オプション）

デフォルトでは、環境変数はすべての環境（Production、Preview、Development）に適用されます。特定の環境にのみ適用したい場合は、各環境変数の横にある「Configure」ボタンをクリックして設定を変更できます。

## 5. デプロイの開始

すべての環境変数を設定したら、「Deploy」ボタンをクリックしてデプロイを開始します。

## 6. デプロイの確認

デプロイが完了すると、Vercelによって生成されたURLでアプリケーションにアクセスできます。環境変数が正しく設定されていれば、アプリケーションは正常に動作するはずです。

## トラブルシューティング

環境変数の設定に問題がある場合は、以下を確認してください：

1. 環境変数名が正確に入力されているか（大文字小文字を含む）
2. 値にスペースや余分な文字が含まれていないか
3. すべての必要な環境変数が設定されているか

また、Vercelのデプロイログを確認することで、環境変数に関連するエラーを特定できる場合があります。

## 注意点

- 環境変数の値は機密情報です。公開リポジトリに`.env.local`ファイルをコミットしないように注意してください（`.gitignore`に含まれていることを確認）。
- Vercelの環境変数は暗号化されて保存され、安全に管理されます。
- 環境変数を変更した場合は、再デプロイが必要です。