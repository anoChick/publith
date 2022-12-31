import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};

export const TopNav: React.FC<Props> = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const createTemplateMutation = trpc.template.create.useMutation({
    onSuccess: (output) => {
      router.push(`/templates/${output.id}/edit`);
    },
  });
  return (
    <div>
      <button
        onClick={() => {
          createTemplateMutation.mutate();
        }}
      >
        テンプレ作成
      </button>

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
