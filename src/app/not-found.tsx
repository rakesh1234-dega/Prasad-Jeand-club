import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <span className="text-8xl block mb-4">🔍</span>
        <h1 className="text-6xl font-poppins font-bold text-primary mb-2">404</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-secondary text-white font-medium rounded-xl hover:bg-secondary-dark transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/shop"
            className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Shop Products
          </Link>
        </div>
      </div>
    </div>
  );
}
