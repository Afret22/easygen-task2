import Link from "next/link";

import { BackgroundBoxes } from "@/components/BackgroundBoxes";
import { ToastContainer } from "react-toastify";
import LoginForm from "@/components/LoginForm";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { LoadingCard } from "@/components/LoadingCard";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (session) router.push("/"); // Redirect if authenticated
  }, [session, status, router]);

  if (status === "loading" || session) {
    return <LoadingCard />;
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] lg:h-[inherit]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>
            <LoginForm />
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden bg-muted lg:block">
          <BackgroundBoxes />
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        closeOnClick
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
