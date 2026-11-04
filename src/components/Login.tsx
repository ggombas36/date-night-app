import { useState, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { BreakableSeal } from "./SealMark";
import Wordmark from "./Wordmark";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const ok = await login(username, password);
      if (!ok) setError("That didn't match. Check the name and password.");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[520px] items-center px-4 py-8">
      <form onSubmit={handleSubmit} className="w-full rounded-[20px] bg-surface p-6 shadow-sheet md:p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <BreakableSeal broken={false} size={96} />
          <h1 className="text-[28px] leading-tight">
            <Wordmark />
          </h1>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="login-name" className="label">
              Name
            </label>
            <input
              id="login-name"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="field"
              aria-describedby={error ? "login-error" : undefined}
              required
            />
          </div>
          <div>
            <label htmlFor="login-password" className="label">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field"
              aria-describedby={error ? "login-error" : undefined}
              required
            />
          </div>
          {error && (
            <p id="login-error" role="alert" className="text-accent">
              {error}
            </p>
          )}
          <button type="submit" disabled={isLoading} className="btn-primary w-full">
            {isLoading ? "Coming in..." : "Come in"}
          </button>
        </div>
      </form>
    </main>
  );
}
