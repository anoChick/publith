import { NextPageWithLayout } from '../../_app';
import { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { prisma } from '~/server/prisma';
import { ImageGenerator } from '~/components/organisms/ImageGenerator';
import Head from 'next/head';
import Link from 'next/link';

const Page: NextPageWithLayout = (
  // eslint-disable-next-line prettier/prettier
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) => {
  const { template } = JSON.parse(
    props?.data ?? JSON.stringify({ template: null }),
  );
  if (!template)
    return (
      <div className="mt-24">
        <div className="bg-stone-100 m-4 rounded-xl p-4">
          対象のテンプレが見つかりませんでした.
        </div>
        <div className="pt-8 text-center">
          <Link
            href="/"
            className="bg-white font-bold text-orange-400 hover:bg-orange-50 m-4 rounded-xl p-4"
          >
            トップページへ
          </Link>
        </div>
      </div>
    );

  const url = `${process.env.NEXT_PUBLIC_ROOT_URL}/templates.${template.id}`;
  const imageUrl = `${process.env.NEXT_PUBLIC_ROOT_URL}/i/${template.id}`;
  return (
    <div>
      <Head>
        <link rel="icon" href="favicon.ico" />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <title>{template.title} - 簡単画像生成アプリPublith</title>
        <meta name="description" content={template.description} />
        <meta
          property="og:title"
          content={`${template.title} - 簡単画像生成アプリPublith`}
        />
        <meta property="og:description" content={template.description} />
        <meta property="og:image" content={imageUrl} />
        <meta
          name="twitter:title"
          content={`${template.title} - 簡単画像生成アプリPublith`}
        />
        <meta name="twitter:description" content={template.description} />
        <meta name="twitter:image" content={imageUrl} />
      </Head>
      <ImageGenerator template={template} />
    </div>
  );
};

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res, params } = context;
  res.setHeader('Cache-Control', `s-maxage=60, stale-while-revalidate`);

  const template = await prisma.template.findFirst({
    where: {
      id: `${params?.id}`,
      publicationStatus: { in: ['PUBLIC', 'LIMIT'] },
    },
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
        template,
      }),
    },
  };
};
