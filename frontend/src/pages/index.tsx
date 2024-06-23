import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingCard } from "@/components/LoadingCard";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) router.push("/login"); // Redirect if not authenticated
  }, [session, status, router]);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  if (status === "loading" || !session)
    return (
      <LoadingCard />
    );

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl text-orange-500 mb-6">Welcome to the application.</h1>
      <button 
        onClick={handleLogout}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
      >
        Logout
      </button>
    </div>
  );
}
