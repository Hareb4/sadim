"use client"; // This directive makes sure the component runs on the client side

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Google } from "@mui/icons-material";

export default function LoginPageComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/notes"); // Redirect to notes page after successful login
    }
  };

  return (
    <div className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#000000] ">
      {/* Login Form */}
      <div
        className="min-h-screen flex items-center justify-center p-4"
        dir="rtl"
      >
        <Card className="w-full max-w-md bg-[#121212] text-[#e5e5e5]">
          <CardHeader>
            <CardTitle className="">تسجيل الدخول</CardTitle>
            <CardDescription>
              أدخل بيانات حسابك للوصول إلى ملاحظاتك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#e5e5e5]">
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="bg-[#000000] text-[#ffffff]"
                  placeholder="example@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#e5e5e5]">
                  كلمة المرور
                </Label>
                <Input
                  id="password"
                  type="password"
                  className="bg-[#000000] text-[#ffffff]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <Button
                type="submit"
                className="w-full bg-[#fca311] text-[#000000]"
              >
                تسجيل الدخول
              </Button>
            </form>
            <div className="mt-4">
              <Button
                variant="outline"
                className="w-full bg-[#e5e5e5] text-[#000000]"
                disabled
              >
                <Google className="mr-2" />
                تسجيل الدخول باستخدام Google
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
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
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
