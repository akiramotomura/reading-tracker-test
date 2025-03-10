'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ReadingRecordList from '@/components/reading-records/ReadingRecordList';
import BookList from '@/components/books/BookList';
import Image from 'next/image';

export default function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'recent' | 'books'>('recent');
  // 初期値として2025を設定し、クライアントサイドでのみ現在の年に更新
  const [year, setYear] = useState(2025);
  
  useEffect(() => {
    // クライアントサイドでのみ実行
    setYear(new Date().getFullYear());
  }, []);

  // ログインしていない場合はランディングページを表示
  if (!user) {
    return (
      <div className="max-w-6xl mx-auto">
        {/* ヒーローセクション */}
        <section className="py-16 md:py-24 px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 leading-tight">
                あなたの子供の『今』が、<br />未来をつくる
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                読書の記録で見える成長の軌跡。家族みんなで、学びと感動を共有しませんか？
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth/signup"
                  className="btn btn-primary text-center px-8 py-3 text-lg"
                >
                  無料で始める
                </Link>
                <Link
                  href="/auth/login"
                  className="btn btn-secondary text-center px-8 py-3 text-lg"
                >
                  ログイン
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden shadow-card">
                {/* 実際のプロジェクトでは適切な画像を使用してください */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-primary-50 flex items-center justify-center">
                  <div className="text-center p-6 bg-white rounded-xl shadow-soft max-w-md">
                    <div className="flex justify-center mb-4">
                      <span className="text-5xl">📚</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">子供の読書記録</h3>
                    <p className="text-gray-600">
                      読んだ本、感想、成長の記録をカンタンに管理できます
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* サービス概要 */}
        <section className="py-16 bg-gray-50 px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">サービスの特徴</h2>
            <p className="text-xl text-gray-600">
              子供の読書習慣を育み、成長を見守るための機能が充実
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-soft">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 mx-auto text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">成長トラッキング</h3>
              <p className="text-gray-600 text-center">
                読書履歴や感想、学びを自動で記録し、グラフやタイムラインで成長を可視化します。
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-soft">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 mx-auto text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">おすすめ機能</h3>
              <p className="text-gray-600 text-center">
                子供の興味やレベルに合わせた本の推薦機能で、次に読むべき本が簡単に見つかります。
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-soft">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 mx-auto text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center">共有機能</h3>
              <p className="text-gray-600 text-center">
                家族間、または学校や先生とのフィードバック機能でコミュニケーションを促進します。
              </p>
            </div>
          </div>
        </section>

        {/* ストーリーテリング */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">利用者の声</h2>
            
            <div className="bg-white p-6 rounded-xl shadow-soft mb-8">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4 text-primary-600">
                  <span className="font-bold">T.K</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">田中さん家族（小学2年生の男の子）</h3>
                  <p className="text-gray-500">アプリ利用歴：1年2ヶ月</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                「息子は最初、読書があまり好きではなかったのですが、このアプリで記録をつけ始めてから、『今日は何を読もうかな』と自分から本を手に取るようになりました。特に、読んだ本の数がグラフで見えるのが嬉しいようで、『もっと読みたい！』というモチベーションにつながっています。」
              </p>
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">5.0 / 5.0</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-soft">
              <div className="flex items-start mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4 text-primary-600">
                  <span className="font-bold">M.S</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">佐藤さん家族（年長の女の子）</h3>
                  <p className="text-gray-500">アプリ利用歴：8ヶ月</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                「娘が読んだ本の感想を記録していくうちに、言葉の使い方や表現力が豊かになっていくのを実感しています。最初は『面白かった』だけだった感想が、今では『○○が△△で面白かった』と具体的に話せるようになりました。成長の記録として残せるのも嬉しいです。」
              </p>
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="ml-2 text-gray-600">4.0 / 5.0</span>
              </div>
            </div>
          </div>
        </section>

        {/* 機能紹介 */}
        <section className="py-16 bg-gray-50 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">主な機能</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-soft">
                <div className="flex items-center mb-4">
                  <span className="flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full text-xl font-bold mr-4">
                    📚
                  </span>
                  <h3 className="text-xl font-semibold">読書記録</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  読んだ本のタイトル、著者、日付、回数、お気に入り度、子供の反応などを簡単に記録できます。
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 italic">
                    「今日はどんな本を読んだ？」「どんなところが面白かった？」という会話から、子供の理解度や興味を深く知ることができます。
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-soft">
                <div className="flex items-center mb-4">
                  <span className="flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full text-xl font-bold mr-4">
                    ⭐
                  </span>
                  <h3 className="text-xl font-semibold">お気に入り度</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  子供がどれだけ本を気に入ったかを5段階で評価し、お気に入りの本を見つけやすくします。
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 italic">
                    お気に入りの本のパターンを分析することで、子供の好みや興味を理解し、次に読む本の選択に役立てられます。
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-soft">
                <div className="flex items-center mb-4">
                  <span className="flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full text-xl font-bold mr-4">
                    📊
                  </span>
                  <h3 className="text-xl font-semibold">読書分析</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  読書の傾向や頻度、お気に入りの本のランキングなどを分析し、視覚的に表示します。
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 italic">
                    「先月は10冊読んだね！」「物語の本が多いね」など、データを通じて子供の成長を実感できます。
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-soft">
                <div className="flex items-center mb-4">
                  <span className="flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full text-xl font-bold mr-4">
                    🎯
                  </span>
                  <h3 className="text-xl font-semibold">読書目標</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  日々の読書習慣を身につけるための目標を設定し、達成状況を追跡できます。
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 italic">
                    「週に3冊読む」などの目標設定と達成の喜びを通じて、自発的な読書習慣を育みます。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Q&A */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">よくある質問</h2>
            
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-xl shadow-soft">
                <h3 className="text-xl font-semibold mb-2">Q: どのような年齢の子供に適していますか？</h3>
                <p className="text-gray-600">
                  A: 主に未就学児から小学生を対象としていますが、年齢に関わらず読書記録を残したい方であれば誰でもご利用いただけます。保護者の方が記録する形式なので、お子様がまだ文字を書けない年齢でも問題ありません。
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-soft">
                <h3 className="text-xl font-semibold mb-2">Q: 無料で利用できますか？</h3>
                <p className="text-gray-600">
                  A: 基本機能は無料でご利用いただけます。読書記録の登録、本の管理、基本的な分析機能などが含まれます。より詳細な分析や高度な機能は将来的に有料プランとして提供予定です。
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-soft">
                <h3 className="text-xl font-semibold mb-2">Q: データのバックアップはできますか？</h3>
                <p className="text-gray-600">
                  A: はい、記録したデータはクラウドに保存され、アカウントに紐づいています。デバイスを変更しても、同じアカウントでログインすれば以前の記録を引き続き利用できます。また、データのエクスポート機能も提供しています。
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-soft">
                <h3 className="text-xl font-semibold mb-2">Q: 複数の子供の記録を管理できますか？</h3>
                <p className="text-gray-600">
                  A: はい、一つのアカウントで複数のお子様の読書記録を別々に管理することができます。それぞれのお子様ごとにプロフィールを作成し、個別に記録や分析を行うことが可能です。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary-50 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">子供の読書習慣を楽しく記録しませんか？</h2>
            <p className="text-xl text-gray-600 mb-8">
              無料で始めて、お子様の成長を見守りましょう。
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/auth/signup"
                className="btn btn-primary text-center px-8 py-3 text-lg"
              >
                無料アカウントを作成
              </Link>
              <Link
                href="/auth/login"
                className="btn btn-secondary text-center px-8 py-3 text-lg"
              >
                ログイン
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              登録は30秒で完了します。クレジットカードは必要ありません。
            </p>
          </div>
        </section>

        <section className="text-center py-8">
          <p className="text-gray-600">
            © {year} 読書記録アプリ
          </p>
        </section>
      </div>
    );
  }

  // ログインしている場合はアプリのメイン画面を表示
  return (
    <div className="max-w-4xl mx-auto">
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-4">
          お子様の読書記録を楽しく管理
        </h1>
        <p className="text-center text-lg text-gray-600 mb-6">
          読んだ本の記録、お気に入り度、感想を簡単に記録。読書の習慣づけをサポートします。
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card flex flex-col items-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">読書を記録</h2>
          <p className="text-gray-600 text-center mb-4">
            今日読んだ本を記録しましょう
          </p>
          <Link
            href="/reading-records/new"
            className="mt-auto btn btn-primary"
          >
            記録する
          </Link>
        </div>

        <div className="card flex flex-col items-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">本を管理</h2>
          <p className="text-gray-600 text-center mb-4">
            お気に入りの本を整理しましょう
          </p>
          <Link
            href="/books/new"
            className="mt-auto btn btn-primary"
          >
            本を追加
          </Link>
        </div>

        <div className="card flex flex-col items-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">読書分析</h2>
          <p className="text-gray-600 text-center mb-4">
            読書の傾向を確認できます
          </p>
          <Link
            href="/analytics"
            className="mt-auto btn btn-primary"
          >
            分析を見る
          </Link>
        </div>
      </section>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4 border-b border-gray-200">
            <button
              className={`py-2 px-4 ${
                activeTab === 'recent'
                  ? 'tab-active'
                  : 'tab'
              }`}
              onClick={() => setActiveTab('recent')}
            >
              最近の記録
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === 'books'
                  ? 'tab-active'
                  : 'tab'
              }`}
              onClick={() => setActiveTab('books')}
            >
              本の一覧
            </button>
          </div>
        </div>

        {activeTab === 'recent' ? (
          <>
            <h2 className="text-xl font-semibold mb-4">最近の読書記録</h2>
            <ReadingRecordList limit={5} />
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">登録されている本</h2>
            <BookList limit={6} />
          </>
        )}
      </section>

      <section className="text-center mb-8">
        <p className="text-gray-600">
          © {year} 読書記録アプリ
        </p>
      </section>
    </div>
  );
}
