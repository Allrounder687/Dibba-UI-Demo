"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Lock, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Authentication failed");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error while signing in");
      setLoading(false);
    }
  }

  return (
    <div className="dark-surface flex min-h-screen flex-col items-center justify-center bg-[#071426] px-4 py-12 text-[#F5F7FA]">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-white/15 bg-[#0A2240]/80 p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center space-y-3">
          <Image
            src="/assets/dibba-fc-logo-glossly-750.png"
            alt="Dibba SCC"
            width={56}
            height={56}
            className="h-14 w-14 object-contain"
          />
          <div>
            <h1 className="text-xl font-extrabold text-white">Dibba SCC CMS Portal</h1>
            <p className="text-xs text-[#F5F7FA]/65">
              Authorized Club Administration & Content Operations
            </p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#F5F7FA]/80">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@dibbaclub.ae"
              className="w-full rounded-lg border border-white/15 bg-[#071426] px-3.5 py-2.5 text-sm text-white focus:border-[#2678FF] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#F5F7FA]/80">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/15 bg-[#071426] px-3.5 py-2.5 text-sm text-white focus:border-[#2678FF] focus:outline-none"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            <span>{loading ? "Authenticating..." : "Sign In"}</span>
          </Button>
        </form>

        <div className="border-t border-white/10 pt-4 text-center">
          <Link
            href="/en"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#66A3FF] hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
