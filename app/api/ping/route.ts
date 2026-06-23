import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const commit = process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_GITHUB_COMMIT_SHA || null;
    return NextResponse.json({ ok: true, commit });
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'failed' }, { status: 500 });
  }
}
