import { router } from '../trpc';
import { myTemplateRouter } from './myTemplate';
import { templateRouter } from './template';

export const appRouter = router({
  template: templateRouter,
  myTemplate: myTemplateRouter,
});

export type AppRouter = typeof appRouter;
