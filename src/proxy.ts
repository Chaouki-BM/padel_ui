import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18n = createMiddleware(routing);

export default handleI18n;

export function proxy(...args: Parameters<typeof handleI18n>) {
  return handleI18n(...args);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|mockServiceWorker|.*\\..*).*)"],
};
