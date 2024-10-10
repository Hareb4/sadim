import Image from "next/image";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";

import Particles from "@/components/magicui/particles";
import BlurFade from "@/components/magicui/blur-fade";

// If loading a variable font, you don't need to specify the font weight
const inter = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["100", "500"],
});

const arabicDataset = {
  name: "سديم",
  heroaction: "استكشف الكون اللامحدود لأفكارك.",
  herotext: "أفكارك أصبحت أقرب",
  subhero: "الغوص في سديم أفكارك يبدأ هنا.",
  new: "جديد",
  signin: "تسجيل دخول",
  register: "مستخدم جديد",
  signout: "تسجيل خروج",
  docs: "الدليل",
  watchvideo: "شاهد كيف تتشكل الأفكار في سديم.",
  feature1: "اختصارات مفتاحية",
  learnmore: "اكتشف عالماً جديداً من الإبداع.",
};

// Array of quotes for the background
const quotes = [
  "الإبداع هو رؤية الأشياء بطريقة جديدة.",
  "كل فكرة جديدة تبدأ بفضول.",
  "الفن هو وسيلة التعبير عن النفس.",
  "النجاح هو القدرة على الانتقال من فشل إلى فشل دون فقدان الحماس.",
  "الإلهام يأتي من كل شيء حولنا.",
];

export default function Home() {
  const t = useTranslations("HomePage");
  return (
    <div
      className={`bg-black text-white ${inter.className} rtl relative`}
      dir="rtl"
    >
      <div className="flex flex-row sm:flex-row justify-between items-center mx-3 bg-opacity-20 p-2 rounded-md">
        <div className="flex flex-col sm:flex-row gap-4 items-baseline">
          <p className="font-bold text-lg text-fca311">{arabicDataset.name}</p>
          <div className="hidden sm:flex sm:flex-row-reverse sm:justify-between sm:items-center sm:gap-4">
            <p dir="rtl" className="text-e5e5e5">
              {arabicDataset.docs}
            </p>
          </div>
        </div>
        <Link
          href={"/login"}
          className="mt-2 sm:mt-0 bg-[#fca311] text-black px-2 py-1 rounded transition-colors duration-150 hover:bg-white"
        >
          {arabicDataset.signin}
        </Link>
      </div>

      <section className="relative overflow-hidden">
        {/* Pattern grid */}
        <Particles
          className="absolute inset-0"
          quantity={4000}
          ease={80}
          color="#ffffff"
          refresh
        />
        {/* Hero section */}
        <div className="relative z-20 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <BlurFade delay={0.25} inView>
              <h1 className="text-4xl tracking-tight text-white sm:text-6xl lg:text-7xl sm:leading-normal lg:leading-normal mt-10">
                {arabicDataset.herotext}
              </h1>
            </BlurFade>
            <BlurFade delay={0.25 * 2} inView>
              <h2 className="mt-6 text-lg leading-8 text-e5e5e5">
                {arabicDataset.subhero}
              </h2>
            </BlurFade>
            <BlurFade delay={0.25 * 3} inView>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#fca311] px-4 py-3 text-sm text-black shadow-sm transition-all duration-150 hover:bg-white hover:border-in-2 hover:border-[#fca311] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fca311"
                  href={"/register"}
                >
                  {arabicDataset.learnmore}
                  <ArrowLeftIcon />
                </Link>
              </div>
            </BlurFade>
          </div>
          <div className="relative mx-auto mt-10 max-w-lg">
            <Image
              src="/noteview-dark.png" // Update with the actual path
              alt="App visual representation"
              width={300}
              height={200}
              layout="responsive"
              className="w-full rounded-2xl border border-e5e5e5 shadow"
            />
          </div>
        </div>
      </section>

      <footer className="bg-black text-white py-6 mt-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm">© 2024 سديم. جميع الحقوق محفوظة.</p>
            <div className="mt-4 flex flex-col sm:flex-row justify-center gap-4">
              <a href="#" className="text-e5e5e5 hover:text-white">
                الخصوصية
              </a>
              <a href="#" className="text-e5e5e5 hover:text-white">
                الشروط والأحكام
              </a>
              <a href="#" className="text-e5e5e5 hover:text-white">
                اتصل بنا
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
