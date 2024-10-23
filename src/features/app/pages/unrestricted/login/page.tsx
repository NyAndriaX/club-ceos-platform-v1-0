'use client';

import React from 'react';
import Link from 'next/link';
import { LoginForm } from '@/features/app/components/unrestricted/login/LoginForm';

const LoginPage = () => {
  return (
    <div className="flex flex-row items-center justify-center h-full">
      <div className="flex flex-col gap-8 items-center justify-center max-w-sm w-full">
        <LoginForm />
        <p className="text-gray-900 text-xs">
          Vous n&apos;êtes pas encore membre ?{' '}
          <Link href={'/'} className="text-blue-500 hover:underline">
            Rejoignez-nous dès aujourd'hui !
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
