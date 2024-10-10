import LoginPageComponent from "@/components/auth/LoginPage";
import { login, signup } from "./actions";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Google } from "@mui/icons-material";

export default function LoginPage() {
  return (
    <div
      className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#000000]"
      dir="rtl"
    >
      <div>
        <Button variant="ghost" asChild>
          <Link href="/register" className="">
            إنشاء حساب جديد
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/" className="">
            الصفحة الرئيسية
          </Link>
        </Button>
      </div>
      <form className="flex flex-col gap-2 w-4/5 max-w-md bg-[#212023] rounded text-[#e5e5e5] p-4">
        <h1 className="mb-2">تسجيل الدخول</h1>
        <div className="contents">
          <Label htmlFor="email" className="text-[#e5e5e5]">
            البريد الإلكتروني
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            className="bg-[#000000] text-[#ffffff]"
            placeholder="example@example.com"
            required
          />
        </div>
        <div className="contents">
          <Label htmlFor="password" className="text-[#e5e5e5]">
            كلمة المرور
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="1234567"
            className="bg-[#000000] text-[#ffffff]"
            required
          />
        </div>
        <Button
          formAction={login}
          className="w-full bg-[#fca311] text-[#000000]"
        >
          تسجيل الدخول
        </Button>
        <Button
          variant="outline"
          className="w-full bg-[#e5e5e5] text-[#000000]"
          disabled
        >
          <Google className="mr-2" />
          تسجيل الدخول باستخدام Google
        </Button>
      </form>
      {/* <div
        className="min-h-screen flex items-center justify-center p-4"
      >
        <form
          className="flex flex-col max-w-md bg-[#121212] text-[#e5e5e5] space-y-4"

        >
          <div className="contents">
            <label htmlFor="email" className="text-[#e5e5e5]">
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="bg-[#000000] text-[#ffffff]"
            />
          </div>
          <label htmlFor="password" className="text-[#e5e5e5]">
            Password:
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="bg-[#000000] text-[#ffffff]"
          />
          <button
            formAction={login}
            className="w-full bg-[#fca311] text-[#000000]"
          >
            Log in
          </button>
          <button formAction={signup}>Sign up</button>
        </form>
      </div> */}
    </div>
  );
}
