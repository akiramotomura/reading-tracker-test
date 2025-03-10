'use client';

import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

// ログイン済みユーザー向けナビゲーション
const authNavigation = [
  { name: 'ホーム', href: '/', current: true },
  { name: '読書記録', href: '/reading-records', current: false },
  { name: '本の管理', href: '/books', current: false },
  { name: '分析', href: '/analytics', current: false },
];

// 未ログインユーザー向けナビゲーション（LPのセクションへのリンク）
const publicNavigation = [
  { name: 'サービスの特徴', href: '/#features', current: false },
  { name: '主な機能', href: '/#functions', current: false },
  { name: 'よくある質問', href: '/#faq', current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface MenuItemProps {
  active: boolean;
}

interface DisclosureRenderProps {
  open: boolean;
}

export default function Navbar() {
  const { user, logout } = useAuth();

  // ユーザーの状態に応じてナビゲーションを選択
  const navigation = user ? authNavigation : publicNavigation;

  return (
    <Disclosure as="nav" className="bg-white shadow-sm">
      {({ open }: DisclosureRenderProps) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-full p-2 text-gray-500 hover:bg-primary-50 hover:text-primary focus:outline-none">
                  <span className="sr-only">メニューを開く</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link href="/" className="text-primary text-xl font-bold">
                    読書記録
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
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
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {user ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <span className="sr-only">ユーザーメニュー</span>
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
                          {user.email?.[0].toUpperCase()}
                        </div>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white py-2 shadow-card ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }: MenuItemProps) => (
                            <button
                              onClick={() => logout()}
                              className={classNames(
                                active ? 'bg-primary-50 text-primary' : 'text-gray-700',
                                'block w-full px-4 py-2 text-sm text-left'
                              )}
                            >
                              ログアウト
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <Link
                    href="/auth/login"
                    className="btn btn-primary"
                  >
                    ログイン
                  </Link>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-primary-50 text-primary'
                      : 'text-gray-500 hover:bg-primary-50 hover:text-primary',
                    'block rounded-xl px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
