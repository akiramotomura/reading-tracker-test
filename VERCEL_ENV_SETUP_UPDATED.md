# Vercelでの環境変数設定手順（更新版）

読書記録アプリをVercelにデプロイする際の環境変数設定手順を詳しく説明します。

## エラーの解決方法

以前の設定方法では、以下のようなエラーが発生する可能性があります：

```
"NEXT_PUBLIC_FIREBASE_API_KEY" references Secret "next_public_firebase_api_key", which does not exist.
```

これは、環境変数がVercelのシークレットを参照しようとしているが、そのシークレットが存在しないために発生するエラーです。このエラーを解決するために、以下の手順に従って環境変数を設定してください。

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

## 重要な注意点

- 環境変数名は正確に入力してください（大文字小文字を含む）。
- 値にスペースや余分な文字が含まれていないことを確認してください。
- すべての環境変数を設定してください。一つでも欠けていると、アプリケーションが正常に動作しない可能性があります。
- 環境変数の値は直接入力してください。@シンボルで始まる名前（例：@next_public_firebase_api_key）は使用しないでください。

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
4. デプロイログでエラーメッセージを確認する

また、Vercelのデプロイログを確認することで、環境変数に関連するエラーを特定できる場合があります。