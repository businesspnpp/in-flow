import LoginClient from '@/app/login/LoginClient';

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ mode?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const initialMode = resolvedSearchParams?.mode === 'signup' ? 'signup' : 'signin';

  return <LoginClient initialMode={initialMode} />;
}
