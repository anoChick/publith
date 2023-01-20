import { router, publicProcedure } from '../trpc';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '~/server/prisma';
import { authUser } from '../utils/authUser';

export type Field =
  | {
      type: 'text';
      name: string;
      title: string;
      description: string;
      default: string;
      sample: string;
    }
  | {
      type: 'select';
      options: { title: string; value: string }[];
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

export const templateRouter = router({
  templates: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 10;
      const { cursor } = input;
      const templates = await prisma.template.findMany({
        take: limit + 1,
        where: {
          publicationStatus: 'PUBLIC',
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          popularity: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              image: true,
              name: true,
            },
          },
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
});
