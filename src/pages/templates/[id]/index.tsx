import { TemplateEditor } from '~/components/organisms/TemplateEditor';
import { NextPageWithLayout } from '../../_app';
import {
  InferGetStaticPropsType,
  InferGetServerSidePropsType,
  GetServerSideProps,
} from 'next';
import { prisma } from '~/server/prisma';

const Page: NextPageWithLayout = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  return <div>s </div>;
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res, params } = context;
  res.setHeader('Cache-Control', `s-maxage=60, stale-while-revalidate`);

  const template = await prisma.template.findUnique({
    where: { id: `${params?.id}` },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  console.log(template);
  return {
    props: {
      data: JSON.stringify({
        a: 2,
      }),
    },
  };
};
