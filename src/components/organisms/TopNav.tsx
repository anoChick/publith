import { Menu, Transition } from '@headlessui/react';
import { Icon } from '@iconify-icon/react';
import classNames from 'classnames';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { toast } from 'react-toastify';
import { trpc } from '~/utils/trpc';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

export const TopNav: React.FC<Props> = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const createTemplateMutation = trpc.myTemplate.create.useMutation({
    onSuccess: (output) => {
      toast.success('新しいテンプレを作成しました.');
      router.push(`/my/templates/${output.id}`);
    },
  });
  return (
    <div className="border-b bg-white border-stone-100 p-1 flex ">
      <div className="flex-1 ">
        <Link
          href="/"
          className="hover:bg-stone-200 rounded-xl block h-12 w-12 "
        >
          <img src="/publith.png" className=" " />
        </Link>
      </div>
      {session ? (
        <div>
          <button
            className="bg-orange-400 px-4 py-2 text-white rounded-lg"
            onClick={() => {
              createTemplateMutation.mutate();
            }}
          >
            テンプレ作成
          </button>
          <div className="inline-block ml-2">
            <Menu
              as="div"
              className="relative inline-block text-left hover:bg-stone-200  rounded-xl"
            >
              <div>
                <Menu.Button className="inline-flex w-full justify-center rounded-md pr-2 m-2">
                  <span className="text-lg pt-0.5">{session?.user?.name}</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src={session?.user?.image ?? ''}
                  />
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
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/my/templates"
                          className={`${
                            active
                              ? 'bg-orange-400 text-white'
                              : 'text-gray-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          マイテンプレ
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      <div className="my-1 border-b border-stone-100"></div>
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => signOut()}
                          className={`${
                            active
                              ? 'bg-orange-400 text-white'
                              : 'text-gray-900'
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          ログアウト
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      ) : (
        <button
          className={classNames(
            'bg-[#00aced] text-white max-h-10 mt-1 mr-1 px-4 rounded-xl',
            status !== 'loading' ? '' : 'hidden',
          )}
          onClick={() => signIn('twitter')}
        >
          <Icon
            icon="mdi:twitter"
            className="inline-block text-xl mr-1 pt-[1px] align-top"
          />
          <span className="">ログイン</span>
        </button>
      )}
    </div>
  );
};
