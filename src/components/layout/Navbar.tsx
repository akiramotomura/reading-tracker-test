'use client';

import { useState, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChartBarIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { useRouter, usePathname } from 'next/navigation';

// モバイル版のナビゲーション（2つのタブに簡略化）
const navigation = [
  { name: 'まとめ', href: '/', icon: ChartBarIcon, current: true },
  { name: 'えほん', href: '/books', icon: BookOpenIcon, current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface DisclosureRenderProps {
  open: boolean;
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
      <div className="hidden sm:block bg-white shadow-sm sticky top-0 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-shrink-0 items-center">
              <button 
                onClick={() => handleNavigation('/')}
                className="text-primary text-xl font-bold"
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
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-500 hover:text-primary hover:border-b-2 hover:border-primary-300',
                    'px-4 py-2 text-sm font-medium bg-transparent'
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
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
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
                    : 'text-gray-500',
                  'flex flex-col items-center justify-center py-4 bg-transparent w-full'
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
      <div className="sm:hidden bg-white shadow-sm sticky top-0 z-20">
        <div className="px-4 py-3 flex items-center justify-center">
          <button 
            onClick={() => handleNavigation('/')}
            className="text-primary text-lg font-bold bg-transparent"
          >
            YOMITAI
          </button>
        </div>
      </div>
    </>
  );
}
