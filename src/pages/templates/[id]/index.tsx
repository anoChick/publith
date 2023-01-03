import { NextPageWithLayout } from '../../_app';
import { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { prisma } from '~/server/prisma';
import { ImageGenerator } from '~/components/organisms/ImageGenerator';

const Page: NextPageWithLayout = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const { template } = JSON.parse(
    props?.data ?? JSON.stringify({ template: null }),
  );

  if (!template) return <div></div>;

  return (
    <div>
      <ImageGenerator />
    </div>
  );
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

  return {
    props: {
      data: JSON.stringify({
        template,
      }),
    },
  };
};
