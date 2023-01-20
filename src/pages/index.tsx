import { Icon } from '@iconify-icon/react';
import dayjs from 'dayjs';
import Link from 'next/link';
import { Fragment } from 'react';
import { NextPageWithLayout } from '~/pages/_app';
import { trpc } from '~/utils/trpc';
dayjs.locale('ja');

const Page: NextPageWithLayout = (props) => {
  const templatesQuery = trpc.template.templates.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );
  const { data, hasNextPage, fetchNextPage } = templatesQuery;
  return (
    <div className="h-full w-full pt-16">
      <div className="mx-2 pb-8">
        <div className="grid grid-cols-3 gap-2">
          {data?.pages.map((page, i) => {
            return (
              <Fragment key={i}>
                {page.templates.map((template) => {
                  return (
                    <Link href={`/templates/${template.id}`} key={template.id}>
                      <div className="text-center">
                        <img
                          src={`/i/${template.id}`}
                          className="rounded-xl object-cover h-48 w-full bg-stone-200"
                        />
                      </div>
                      <div className="mt-2 flex">
                        <div className="inline-flex flex-1">
                          <img
                            src={template.user.image ?? ''}
                            className="rounded-full w-7 h-7 mr-1.5"
                          />
                          <span className="text-sm font-bold pt-1">
                            {template.user.name}
                          </span>
                        </div>
                        <div className="text-stone-400 ">
                          <Icon
                            icon="material-symbols:star-rounded"
                            className="inline-block align-middle"
                          />
                          <span className="text-xs  inline-block ml-[2px] mt-0.5 align-middle">
                            {template.popularity}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </Fragment>
            );
          })}
        </div>

        {hasNextPage && (
          <div className="mt-8">
            <button
              className="p-3 font-bold w-full text-stone-500 bg-white border-stone-100 hover:bg-stone-100 hover:border-stone-200 border-2 rounded-xl"
              onClick={() => {
                fetchNextPage();
              }}
            >
              もっと見る
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
