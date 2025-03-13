'use client';

import { Fragment, useState, useEffect } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// モバイル版のナビゲーション
const navigation = [
  { name: 'ホーム', href: '/', current: true },
  { name: '読書記録', href: '/reading-records', current: false },
  { name: '本の管理', href: '/books', current: false },
  { name: '分析', href: '/analytics', current: false },
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
    <Disclosure as="nav" className="bg-white shadow-sm sticky top-0 z-10">
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
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {updatedNavigation.map((item) => (
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
