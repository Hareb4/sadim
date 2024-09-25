"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PasswordStrength } from "../customeui/PasswordStrength";

export default function RegisterPageComponent() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const checkIfUserExists = async (email) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: false,
      },
    });

    // If there's no error, it means the user exists
    return !error;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      setIsLoading(false);
      return;
    }

    try {
      // Check if the user already exists
      const userExists = await checkIfUserExists(email);
      if (userExists) {
        setError("هذا البريد الإلكتروني مسجل بالفعل");
        setIsLoading(false);
        return;
      }

      // Proceed with sign-up
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
            },
          },
        });

      if (signUpError) throw signUpError;

      // If the sign-up is successful, show the confirmation message
      if (signUpData.user) {
        setOpenModal(
          "تم إرسال رابط التأكيد إلى بريدك الإلكتروني. يرجى التحقق من بريدك الإلكتروني لإكمال التسجيل."
        );
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister2 = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      setIsLoading(false);
      return;
    }

    try {
      // Check if user already exists
      const userExists = await checkIfUserExists(email);
      if (userExists) {
        setError("هذا البريد الإلكتروني مسجل بالفعل");
        setIsLoading(false);
        return;
      }

      // If user doesn't exist, proceed with sign up
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
            },
          },
        });

      if (signUpError) throw signUpError;

      if (signUpData.user) {
        // Sign in the user after successful sign up
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (signInError) throw signInError;

        if (signInData.user) {
          router.push("/notes");
        }
      } else {
        // This case handles when sign up is successful but requires email confirmation
        setError(
          "تم إرسال رابط التأكيد إلى بريدك الإلكتروني. يرجى التحقق من بريدك الإلكتروني لإكمال التسجيل."
        );
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#000000] flex items-center justify-center p-4"
      dir="rtl"
    >
      <Card className="w-full max-w-md bg-[#121212] text-[#e5e5e5]">
        <CardHeader>
          <CardTitle>إنشاء حساب جديد</CardTitle>
          <CardDescription>سجل للوصول إلى تطبيق الملاحظات</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#e5e5e5]">
                الاسم
              </Label>
              <Input
                id="name"
                value={displayName}
                className="bg-[#000000] text-[#ffffff]"
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#e5e5e5]">
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                type="email"
                className="bg-[#000000] text-[#ffffff]"
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
            <PasswordStrength password={password} />
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#e5e5e5]">
                تأكيد كلمة المرور
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                className="bg-[#000000] text-[#ffffff]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#fca311] text-[#000000]"
              disabled={isLoading}
            >
              {isLoading ? "جاري التسجيل..." : "إنشاء الحساب"}
            </Button>
            {error && (
              <p className="bg-[#ffcccc] text-[#ff0000] p-2 w-full text-right rounded">
                {error}
              </p>
            )}
            {openModal && (
              // <p className="bg-[#ffcccc] text-[#ff0000] p-2 w-full text-right rounded">

              // </p>
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 m-0">
                <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
                <button onClick={() => router.push("/login")}>
                  اذهب إلى صفحة تسجيل الدخول
                </button>
                {/* <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="dark:bg-zinc-700 dark:text-white"
                  >
                    إلغاء
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteConfirmation}
                    className="dark:bg-red-700 dark:hover:bg-red-600"
                  >
                    حذف
                  </Button>
                </div> */}
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" asChild>
            <Link href="/login">تسجيل الدخول</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/">الصفحة الرئيسية</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
