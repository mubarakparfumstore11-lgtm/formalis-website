import { login } from "./actions";

export const metadata = { title: "Login Pengurus - FORMALIS" };

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-center text-2xl font-bold text-primary">
        Login Pengurus
      </h1>
      <p className="mt-1 text-center text-sm text-foreground/70">
        Khusus untuk pengurus FORMALIS
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form action={login} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-primary-dark">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-primary/20 px-3 py-2 focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-primary-dark">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded-lg border border-primary/20 px-3 py-2 focus:border-primary focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary py-2.5 font-semibold text-cream hover:bg-primary-light transition-colors"
        >
          Masuk
        </button>
      </form>
    </div>
  );
}
