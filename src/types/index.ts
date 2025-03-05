// 読書記録の型定義
export interface ReadingRecord {
  id: string;
  bookId: string;
  userId: string;
  readDate: string; // ISO形式の日付文字列
  readCount: number;
  favoriteRating: number; // 1-5のスケール
  childReaction: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// 本の型定義
export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  isbn?: string;
  publisher?: string;
  publishedYear?: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// ユーザープロファイルの型定義
export interface UserProfile {
  id: string;
  email: string;
  familyName: string;
  children?: Child[];
  createdAt: string;
  updatedAt: string;
}

// 子供の型定義
export interface Child {
  id: string;
  name: string;
  birthdate?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// 読書目標の型定義
export interface ReadingGoal {
  id: string;
  userId: string;
  targetBooks: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// 読書分析の結果型定義
export interface ReadingAnalytics {
  totalBooks: number;
  totalReadingTime?: number;
  favoriteAuthors: { author: string; count: number }[];
  favoriteBooks: { book: Book; rating: number }[];
  readingTrends: { date: string; count: number }[];
  readingGoalProgress?: {
    goal: ReadingGoal;
    progress: number;
    percentage: number;
  };
}

// モック用のデータ生成関数
export const generateMockData = () => {
  const mockBooks: Book[] = [
    {
      id: '1',
      title: 'はらぺこあおむし',
      author: 'エリック・カール',
      coverImage: 'https://example.com/covers/hungry-caterpillar.jpg',
      publisher: '偕成社',
      publishedYear: 1976,
      userId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'ぐりとぐら',
      author: '中川李枝子',
      coverImage: 'https://example.com/covers/guri-gura.jpg',
      publisher: '福音館書店',
      publishedYear: 1963,
      userId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'いないいないばあ',
      author: '松谷みよ子',
      coverImage: 'https://example.com/covers/inai-inai-baa.jpg',
      publisher: '童心社',
      publishedYear: 1967,
      userId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const mockReadingRecords: ReadingRecord[] = [
    {
      id: '1',
      bookId: '1',
      userId: '1',
      readDate: new Date().toISOString(),
      readCount: 1,
      favoriteRating: 5,
      childReaction: 'とても喜んでいました。特に食べ物のページが好きなようです。',
      notes: '絵本を指差して喜んでいました。',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      bookId: '2',
      userId: '1',
      readDate: new Date(Date.now() - 86400000).toISOString(), // 1日前
      readCount: 2,
      favoriteRating: 4,
      childReaction: 'パンケーキを作るシーンで笑っていました。',
      notes: '読み聞かせ後、おままごとで再現していました。',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  return {
    books: mockBooks,
    readingRecords: mockReadingRecords
  };
};