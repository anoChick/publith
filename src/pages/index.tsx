import { NextPageWithLayout } from './_app';
import Link from 'next/link';

import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { prisma } from '~/server/prisma';
import { Icon } from '@iconify-icon/react';

const Page: NextPageWithLayout = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const { templates } = JSON.parse(
    props?.data ?? JSON.stringify({ templates: [] }),
  );

  return (
    <div className="mt-20 mx-4">
      <div className="grid grid-cols-4 gap-12">
        {templates.map((template: any) => (
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
                  src={template.user.image}
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
        ))}
      </div>
    </div>
  );
};

export default Page;
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res, params } = context;
  res.setHeader('Cache-Control', `s-maxage=60, stale-while-revalidate`);

  const templates = await prisma.template.findMany({
    include: {
      user: {
        select: {
          id: true,
          image: true,
          name: true,
        },
      },
    },
  });

  return {
    props: {
      data: JSON.stringify({
        templates,
      }),
    },
  };
};
