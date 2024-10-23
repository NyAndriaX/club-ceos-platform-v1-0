import { NextResponse } from 'next/server';
import { User } from '@prisma/client';
import { editUserSchema } from '@/app/validators/user.validator';
import { handleGetUser, handlePutUser } from './handler';
import { handleError } from '../../utils/request';

export async function GET(
  req: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const { userId } = params;

    const user = await handleGetUser(parseInt(userId) as number);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const body = await req.json();
    const { userId } = params;

    await editUserSchema.parse(body);

    const user = await handlePutUser(
      parseInt(userId) as number,
      body as (Partial<User> & { currentPassword: string, confirmPassword: string, newPassword: string }),
    );

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
