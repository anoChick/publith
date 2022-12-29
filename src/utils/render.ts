import Mustache from 'mustache';
import satori from 'satori';
import { html } from 'satori-html';
import { parse } from 'node-html-parser';

const getImageSize = (params: { [key: string]: string }) => {
  try {
    const imageSizeString = params['__PUBLITH_IMAGE_SIZE__'];

    const [width, height] = imageSizeString?.split('x') ?? [];
    if (!width || !height) throw new Error();
    return { width: +width, height: +height };
  } catch {}

  return { width: 1200, height: 630 };
};

const getFontName = (params: { [key: string]: string }) => {
  return params['__PUBLITH_FONT_NAME__'] ?? 'Noto+Sans+JP';
};

const getFontData = async (
  htmlText: string,
  params: { [key: string]: string },
) => {
  const useDefault = !params['__PUBLITH_FONT_NAME__'];
  if (useDefault) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ROOT_URL}/fonts/BIZUDPGothic-Bold.ttf`,
    );
    const data = await res.arrayBuffer();

    return data;
  }

  const fontName = getFontName(params);
  const parsedHtml = parse(Mustache.render(htmlText, params));
  const fontUrl = `${
    process.env.NEXT_PUBLIC_ROOT_URL
  }/api/font?font=${encodeURIComponent(fontName)}&text=${encodeURIComponent(
    parsedHtml.textContent,
  )}`;
  const res = await fetch(fontUrl);
  return await res.arrayBuffer();
};

const loadFontFromSystem = async (text: string) => {
  return '';
};

export const render = async (
  htmlText: string,
  params: { [key: string]: string },
) => {
  const a = html(Mustache.render(htmlText, params));

  const fontData = await getFontData(htmlText, params);
  try {
    const imageSize = getImageSize(params);
    const s = await satori(a as any, {
      width: imageSize.width,
      height: imageSize.height,
      fonts: [
        {
          name: 'default',
          data: fontData,
        },
      ],
      loadAdditionalAsset: async (code: string, segment: string) => {
        if (code === 'emoji') {
          return `data:image/svg+xml;base64,...`;
        }

        return await loadFontFromSystem(code);
      },
    });

    return s;
  } catch (e) {
    console.error(e);

    return null;
  }
};
