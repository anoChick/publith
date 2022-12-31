import type { NextApiRequest, NextApiResponse } from 'next';
import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const result = await fetch(`http://localhost:3000/api/t/a`);
  const json = await result.json();
  const markup = html(json.html);
  const fontData = await fetchFont();

  console.log(markup);
  const svg = await satori(markup as any, {
    width: 600,
    height: 400,
    fonts: [
      {
        name: 'Roboto',
        // Use `fs` (Node.js only) or `fetch` to read the font as Buffer/ArrayBuffer and provide `data` here.
        data: fontData,
        weight: 400,
        style: 'normal',
      },
    ],
  });

  const opts = {
    background: 'rgba(238, 235, 230, .9)',
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  };
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  res.setHeader('Content-Type', 'image/png');

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': pngBuffer.length,
  });
  res.end(pngBuffer);
};

const fetchFont = async () => {
  const fontData = await fetch(
    `${process.env.ROOT_URL}/fonts/NotoSansJP-Medium.otf`,
  ).then((res) => res.arrayBuffer());

  return fontData;
};
