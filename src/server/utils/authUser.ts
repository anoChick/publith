import { CreateContextOptions } from '../context';

export const authUser = async (ctx: CreateContextOptions) => {
  const user = ctx?.session?.user;
  if (!user) throw new Error('user notfound');

  return user as {
    name: string;
    id: string;
  };
};
