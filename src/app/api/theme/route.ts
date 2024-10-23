import { NextResponse } from 'next/server';
import { handleCreate, handleGetAllThemes } from './handler';
import { handleError } from '../utils/request';
import { themeSchema } from '@/app/validators/theme.validator';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const request = themeSchema.parse(body);

    const theme = await handleCreate(request);

    return NextResponse.json({ theme }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(req: Request) {
  try {
    const themes = await handleGetAllThemes();

    return NextResponse.json({ themes }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
