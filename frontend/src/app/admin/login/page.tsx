"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { setAuthCookie } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import { Loader2, LogIn } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await api.auth.login({ username, password });
      if (res.data?.token) {
        localStorage.setItem("admin_token", res.data.token);
        await setAuthCookie(res.data.token);
        router.push("/admin");
      }
    } catch (err) {
      setError("Invalid credentials");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 rounded-xl border bg-card shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full py-4 px-6 rounded-xl text-white font-semibold text-lg flex items-center justify-center space-x-2 transition-all duration-300 cursor-pointer",
              "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/40 ring-2 ring-blue-500/20 hover:shadow-blue-500/60",
              isLoading && "opacity-80 cursor-not-allowed scale-[0.98]"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span>Login</span>
                <LogIn className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
