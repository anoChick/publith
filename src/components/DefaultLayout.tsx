import Head from 'next/head';
import { ReactNode } from 'react';

type DefaultLayoutProps = { children: ReactNode };

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <>
      <Head>
        <title>簡単画像生成アプリ Pablith</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full h-full">{children}</div>
    </>
  );
};
