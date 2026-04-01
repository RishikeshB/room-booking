import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { getServerSession } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession();

  if (session) {
    redirect(session.role === "admin" ? "/admin" : "/book");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-brand-50 to-white px-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-ink">Prithiv and Sangeetha</h1>
          <p className="mt-2 text-2xl font-semibold text-brand-700">Marriage Room Booking</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}

