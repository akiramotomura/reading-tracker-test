'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChartBarIcon, BookOpenIcon } from '@heroicons/react/24/outline';

// モバイル版のナビゲーション（2つのタブに簡略化）
const navigation = [
  { name: 'まとめ', href: '/', icon: ChartBarIcon, current: true },
  { name: 'えほん', href: '/books', icon: BookOpenIcon, current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [updatedNavigation, setUpdatedNavigation] = useState(navigation);

  // パスに基づいて現在のナビゲーション項目を更新
  useEffect(() => {
    const newNavigation = navigation.map(item => {
      // 「えほん」タブは /books または /reading-records で始まるパスの場合にアクティブにする
      if (item.name === 'えほん') {
        return {
          ...item,
          current: pathname.startsWith('/books') || pathname.startsWith('/reading-records')
        };
      }
      // 「まとめ」タブはホームページまたは /analytics で始まるパスの場合にアクティブにする
      return {
        ...item,
        current: pathname === '/' || pathname === '/analytics' || pathname.startsWith('/analytics/')
      };
    });
    setUpdatedNavigation(newNavigation);
  }, [pathname]);

  // ナビゲーション処理
  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <>
      {/* デスクトップ用トップナビゲーション */}
      <div className="hidden sm:block bg-surface elevation-1 sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-shrink-0 items-center">
              <button 
                onClick={() => handleNavigation('/')}
                className="text-primary text-xl font-bold md-ripple bg-transparent"
              >
                YOMITAI
              </button>
            </div>
            <div className="flex space-x-4">
              {updatedNavigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={classNames(
                    item.current
                      ? 'md-nav-item-active'
                      : 'md-nav-item',
                    'md-ripple bg-transparent'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* モバイル用ボトムタブナビゲーション */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-surface elevation-2 z-50">
        <div className="grid grid-cols-2">
          {updatedNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={classNames(
                  item.current
                    ? 'text-primary'
                    : 'text-neutral-600',
                  'flex flex-col items-center justify-center py-3 bg-transparent w-full md-ripple'
                )}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
                <span className="text-xs mt-1">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* モバイル用ヘッダー（タイトルのみ） */}
      <div className="sm:hidden bg-surface elevation-1 sticky top-0 z-20">
        <div className="px-4 py-3 flex items-center justify-center">
          <button 
            onClick={() => handleNavigation('/')}
            className="text-primary text-lg font-bold bg-transparent md-ripple"
          >
            YOMITAI
          </button>
        </div>
      </div>
    </>
  );
}
