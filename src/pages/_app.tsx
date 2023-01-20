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
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ja';
dayjs.locale('ja');
dayjs.extend(relativeTime);

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
      <div className="w-full h-full">
        <div className="fixed top-0 w-full">
          <TopNav />
        </div>
        <div className="w-ful h-full">
          <Component {...pageProps} />
        </div>
      </div>
      <ToastContainer />
    </SessionProvider>,
  );
}) as AppType;

export default trpc.withTRPC(MyApp);
