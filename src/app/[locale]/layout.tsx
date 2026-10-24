import "@/app/globals.css";
import { type ReactNode } from "react";
import { type Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { MswProvider } from "@/components/providers/MswProvider";
import { DevRoleSwitcher } from "@/components/providers/DevRoleSwitcher";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Padel Tunisia",
    template: "%s | Padel Tunisia",
  },
  description:
    "Plateforme de réservation et gestion de padel en Tunisie — clubs, matchs, tournois, coaching.",
};

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <QueryProvider>
              <MswProvider>
                {children}
                <Toaster position={dir === "rtl" ? "top-left" : "top-right"} richColors />
                <DevRoleSwitcher />
              </MswProvider>
            </QueryProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
