import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { authUser } from '../utils/authUser';
const defaultData = {
  title: 'テンプレ',
  html: `<div class='flex w-full h-full bg-black text-white  items-center justify-center'>
  <div class="flex w-[50%] text-[24px] p-8">
    {{text}}
  </div>
    <div class="flex w-[50%] h-full">
    <img class='w-full h-full ' src="{{{imageUrl}}}">
  </div>
</div>`,
  description: 'テンプレの初期状態です。',
  publicationStatus: 'PRIVATE',
  popularity: 0,
  fields: [
    {
      name: 'imageUrl',
      type: 'text',
      title: '画像URL',
      sample:
        'https://pbs.twimg.com/media/Fi5bH1XagAAHICO?format=jpg&name=large',
      default: '',
      description: '',
    },
    {
      name: 'text',
      type: 'text',
      title: 'メインテキスト',
      sample: 'サンプルです。',
      default: '',
      description: '',
    },
    {
      name: '__PUBLITH_IMAGE_SIZE__',
      type: 'select',
      title: '新規フィールド',
      sample: '800x400',
      default: '',
      options: [
        {
          title: '横長',
          value: '800x400',
        },
        {
          title: '普通',
          value: '600x400',
        },
        {
          title: '正方形',
          value: '600x600',
        },
      ],
      description: '',
    },
  ],
};
export const myTemplateRouter = router({
  create: publicProcedure.mutation(async ({ ctx }) => {
    const user = await authUser(ctx);

    const template = await prisma.template.create({
      data: {
        ...defaultData,
        userId: user.id,
        lastEditedAt: new Date(),
      },
    });
    return {
      id: template.id,
    };
  }),
  template: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const user = await authUser(ctx);
      const template = await prisma.template.findFirst({
        where: { userId: user.id, id: input.id },
      });

      return {
        template,
      };
    }),
  templates: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const user = await authUser(ctx);
      const limit = input.limit ?? 10;
      const { cursor } = input;
      const templates = await prisma.template.findMany({
        take: limit + 1,
        where: {
          userId: user.id,
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          lastEditedAt: 'desc',
        },
      });
      let nextCursor: typeof cursor | null = null;
      if (templates.length > limit) {
        const nextItem = templates.pop();
        nextCursor = nextItem?.id ?? null;
      }
      return {
        templates,
        nextCursor,
      };
    }),
  save: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(32),
        description: z.string().min(0).max(2000),
        html: z.string().min(1).max(65534),
        publicationStatus: z.string(),
        fields: z.array(
          z.object({
            type: z.string(),
            name: z.string(),
            title: z.string(),
            options: z
              .array(
                z.object({
                  title: z.string(),
                  value: z.string(),
                }),
              )
              .optional(),
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
        data: { ...input, lastEditedAt: new Date() },
        where: {
          id: input.id,
          userId: user.id,
        },
      });
      return { template };
    }),
});
