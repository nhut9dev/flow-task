import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    data: [],
    success: true,
    message: 'Folder projects fetched successfully',
  });
}
