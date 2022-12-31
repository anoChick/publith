import { router, publicProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { authUser } from '../utils/authUser';

export type Field = {
  type: 'text';
  name: string;
  title: string;
  description: string;
  default: string;
  sample: string;
};

export type FormType = {
  id: string | null;
  title: string;
  html: string;
  fields: Field[];
};

const defaultData = {
  title: 'テンプレ',
  html: '<div style="background-color:#ff0; width: 100%; height: 100%;">{{field1}}</div>',
  fields: [
    {
      type: 'text',
      name: 'field1',
      title: '新規フィールド',
      description: '',
      default: '',
      sample: 'サンプルデータ',
    },
  ],
};

export const templateRouter = router({
  templates: publicProcedure.query(async () => {
    const templates = await prisma.template.findMany();

    return { templates };
  }),

  create: publicProcedure.mutation(async ({ ctx: { session } }) => {
    console.log('===');
    const user = session?.user;
    if (!user) throw new Error('');

    const template = await prisma.template.create({
      data: {
        ...defaultData,
        userId: user.id,
      },
    });
    return {
      id: template.id,
    };
  }),
  template: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id } }) => {
      const template = await prisma.template.findUnique({ where: { id } });

      return { template };
    }),
  save: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(32),
        html: z.string().min(1).max(65534),
        fields: z.array(
          z.object({
            type: z.string(),
            name: z.string(),
            title: z.string(),
            description: z.string(),
            default: z.string(),
            sample: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await authUser(ctx);

      const template = await prisma.template.updateMany({
        data: input,
        where: {
          id: input.id,
          userId: user.id,
        },
      });
      return { template };
    }),
});
