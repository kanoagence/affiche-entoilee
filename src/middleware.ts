import { defineMiddleware } from 'astro:middleware';
import { validateSession, getSessionUser } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/login') &&
    !pathname.startsWith('/admin/logout')
  ) {
    const sessionToken = context.cookies.get('session')?.value;
    const user = sessionToken ? validateSession(sessionToken) : null;

    if (!user) {
      return context.redirect('/admin/login');
    }

    const sessionData = sessionToken ? getSessionUser(sessionToken) : null;
    context.locals.user = user;
    // Store full session data for templates
    (context.locals as any).userName = sessionData?.name ?? user;
  }

  return next();
});
