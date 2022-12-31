import type { NextPage } from 'next';
import type { AppType, AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import { DefaultLayout } from '~/components/DefaultLayout';
import { trpc } from '~/utils/trpc';
import { SessionProvider } from 'next-auth/react';
import { TopNav } from '~/components/organisms/TopNav';
import 'react-toastify/dist/ReactToastify.css';

import './global.css';
import { ToastContainer } from 'react-toastify';

export type NextPageWithLayout<
  TProps = Record<string, unknown>,
  TInitialProps = TProps,
> = NextPage<TProps, TInitialProps> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = (({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return getLayout(
    <SessionProvider session={pageProps.session}>
      <div>
        <div>
          <TopNav />
        </div>
        <div>
          <Component {...pageProps} />
        </div>
      </div>
      <ToastContainer />
    </SessionProvider>,
  );
}) as AppType;

export default trpc.withTRPC(MyApp);
