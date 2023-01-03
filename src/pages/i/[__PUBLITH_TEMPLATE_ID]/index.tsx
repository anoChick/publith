import { Resvg } from '@resvg/resvg-js';
import Mustache from 'mustache';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import satori from 'satori';
import { html } from 'satori-html';
import { prisma } from '~/server/prisma';
import { render } from '~/utils/render';

export const getServerSideProps = async ({
  res,
  req,
  query,
}: GetServerSidePropsContext) => {
  const id = `${query.__PUBLITH_TEMPLATE_ID}`;
  const template = await prisma.template.findUnique({ where: { id } });
  await prisma.template.update({
    where: { id },
    data: { popularity: { increment: 1 } },
  });
  if (!template) {
    res.end('');
    return {
      props: {},
    };
  }
  const sampleData: any = {};
  (template.fields as any).forEach((field: any) => {
    sampleData[field.name] = field.sample;
  });

  for (const q in query) {
    sampleData[q] = query[q];
  }

  const svg = await render(template.html, sampleData);

  const resvg = new Resvg(svg ?? '<svg></svg>');
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  res.statusCode = 200;
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');
  res.setHeader('Content-Type', 'image/png');
  res.end(pngBuffer);

  return {
    props: {},
  };
};

const Page = (props: InferGetServerSidePropsType<typeof getServerSideProps>) =>
  null;
export default Page;
