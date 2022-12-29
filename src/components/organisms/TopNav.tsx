import { signIn, signOut, useSession } from 'next-auth/react';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

export const TopNav: React.FC<Props> = () => {
  const { data: session } = useSession();
  return (
    <div>
      {session ? (
        <div>
          {session?.user?.name}
          <button onClick={() => signOut()}>ログアウト</button>
        </div>
      ) : (
        <button onClick={() => signIn('twitter')}>ログイン</button>
      )}
    </div>
  );
};
