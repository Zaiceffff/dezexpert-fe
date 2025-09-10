import { NextResponse } from 'next/server';
import { getApiUrl } from '@/lib/config';

// Временная заглушка для прямого обращения к /auth/login
export async function POST() {
  const apiUrl = getApiUrl('/api/auth/login');
  return NextResponse.redirect(apiUrl, 301);
}

export async function GET() {
  const apiUrl = getApiUrl('/api/auth/login');
  return NextResponse.redirect(apiUrl, 301);
}
