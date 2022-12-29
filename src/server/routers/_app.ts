import { router } from '../trpc';
import { postRouter } from './post';
import { templateRouter } from './template';

export const appRouter = router({
  template: templateRouter,
  post: postRouter,
});

export type AppRouter = typeof appRouter;
