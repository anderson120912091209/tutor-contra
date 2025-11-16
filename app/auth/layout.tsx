export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

// Disable static generation for auth pages
export const dynamic = 'force-dynamic';

