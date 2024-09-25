import { getUserLocale } from "@/services/locale";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // Provide a static locale, fetch a user setting,
  // read from `cookies()`, `headers()`, etc.
  const locale = getUserLocale();
  var updatedlocale = "ar";
  await locale.then((e) => {
    updatedlocale = e;
    console.log("1: ", updatedlocale);
  });
  console.log("2: ", updatedlocale);

  return {
    locale,
    messages: (await import(`../../messages/${updatedlocale}.json`)).default,
  };
});
