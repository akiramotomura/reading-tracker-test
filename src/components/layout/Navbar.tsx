'use client';

import { Fragment, useState, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, BookOpenIcon, ChartBarIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// モバイル版のナビゲーション
const navigation = [
  { name: '概要', href: '/', icon: ChartBarIcon, current: true },
  { name: '読書記録', href: '/reading-records', icon: BookOpenIcon, current: false },
  { name: '本の管理', href: '/books', icon: BookmarkIcon, current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface DisclosureRenderProps {
  open: boolean;
}

export default function Navbar() {
  const pathname = usePathname();
  const [updatedNavigation, setUpdatedNavigation] = useState(navigation);

  // パスに基づいて現在のナビゲーション項目を更新
  useEffect(() => {
    const newNavigation = navigation.map(item => ({
      ...item,
      current: pathname === item.href || pathname.startsWith(`${item.href}/`)
    }));
    setUpdatedNavigation(newNavigation);
  }, [pathname]);

  return (
    <>
      {/* デスクトップ用トップナビゲーション */}
      <div className="hidden sm:block bg-white shadow-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-primary text-xl font-bold">
                読書記録
              </Link>
            </div>
            <div className="flex space-x-4">
              {updatedNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-500 hover:text-primary hover:border-b-2 hover:border-primary-300',
                    'px-3 py-2 text-sm font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* モバイル用ボトムタブナビゲーション */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
        <div className="grid grid-cols-3">
          {updatedNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? 'text-primary'
                    : 'text-gray-500',
                  'flex flex-col items-center justify-center py-2'
                )}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* モバイル用ヘッダー（タイトルのみ） */}
      <div className="sm:hidden bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-center">
          <div className="text-primary text-lg font-bold">読書記録</div>
        </div>
      </div>
    </>
  );
}
