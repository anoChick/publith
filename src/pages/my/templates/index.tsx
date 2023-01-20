import dayjs from 'dayjs';
import Link from 'next/link';
import { Fragment } from 'react';
import { NextPageWithLayout } from '~/pages/_app';
import { trpc } from '~/utils/trpc';
dayjs.locale('ja');

const Page: NextPageWithLayout = (props) => {
  const templatesQuery = trpc.myTemplate.templates.useInfiniteQuery(
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
        <div className="grid grid-cols-1 gap-2">
          {data?.pages.map((page, i) => {
            return (
              <Fragment key={i}>
                {page.templates.map((template) => {
                  return (
                    <Link
                      className="hover:bg-stone-100 rounded-xl p-2 flex"
                      href={`/my/templates/${template.id}`}
                      key={template.id}
                    >
                      <div className="flex-1 mr-2">
                        <div className="text-lg font-bold text-stone-500 ">
                          {template.publicationStatus === 'PUBLIC' && (
                            <span className="text-sm text-white bg-sky-400 py-1 px-3 rounded-full mr-2 align-top mb-1 inline-block">
                              公開
                            </span>
                          )}
                          {template.publicationStatus === 'LIMIT' && (
                            <span className="text-sm text-white bg-purple-400 py-1 px-3 rounded-full mr-2 align-top mb-1 inline-block">
                              限定公開
                            </span>
                          )}
                          {template.publicationStatus === 'PRIVATE' && (
                            <span className="text-sm text-white bg-red-400 py-1 px-3 rounded-full mr-2 align-top mb-1 inline-block">
                              非公開
                            </span>
                          )}
                          {template.title}
                        </div>
                        <div className="text-center sm:hidden block mb-4">
                          <img
                            src={`/i/${template.id}`}
                            className="rounded-lg inline-block object-cover  bg-stone-200"
                          />
                        </div>
                        <div className="bg-stone-100 rounded-lg min-h-[84px] p-2">
                          {template.description}
                        </div>
                        <div className="pt-1 text-sm text-right">
                          {dayjs(template.lastEditedAt).fromNow()}
                        </div>
                      </div>

                      <div className="text-center sm:block hidden">
                        <img
                          src={`/i/${template.id}`}
                          className="rounded-lg object-cover h-[140px] bg-stone-200"
                        />
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
