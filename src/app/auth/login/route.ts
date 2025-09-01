import { NextResponse } from 'next/server';

// Временная заглушка для прямого обращения к /auth/login
export async function POST() {
  return NextResponse.redirect('/api/auth/login', 301);
}

export async function GET() {
  return NextResponse.redirect('/api/auth/login', 301);
}
