import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

// import { appWithTranslation } from "next-i18next";

const ibmarabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["200", "400", "700"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// export default appWithTranslation(RootLayout);
