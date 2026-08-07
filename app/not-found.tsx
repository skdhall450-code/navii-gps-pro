import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <h1 className="text-7xl font-extrabold text-blue-700">
        404
      </h1>

      <h2 className="mt-4 text-3xl font-bold text-slate-900">
        Page Not Found
      </h2>

      <p className="mt-4 max-w-md text-slate-600">
        The page youre looking for doesnt exist or has been moved.
      </p>

      <Link
        href="/"
        className="mt-8 rounded-xl bg-blue-700 px-8 py-4 font-semibold text-white hover:bg-blue-800"
      >
        Back to Home
      </Link>
    </main>
  );
}