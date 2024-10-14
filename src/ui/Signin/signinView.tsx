'use client';

import React, { useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import SigninForm from './components/signinForm';
import { Logo } from '../common/components/Logo/Logo';

const SigninView = () => {
  const toast = useRef<Toast>(null);
  const searchParams = useSearchParams();
  const paymentSuccess = searchParams.get('paymentSuccess');

  useEffect(() => {
    if (paymentSuccess === 'true') {
      toast.current?.show({
        severity: 'success',
        summary: 'Félicitations!',
        detail: 'Votre paiement a été effectué avec succès.',
        life: 3000,
      });
    }
  }, [paymentSuccess]);

  return (
    <>
      <Toast ref={toast} />
      <main className="flex flex-col items-center justify-center min-h-screen">
        <Card
          header={
            <div className="border-b border-gray-300 py-6">
              <Logo />
            </div>
          }
          className="card w-[30rem]"
        >
          <div className="flex flex-col gap-4 items-start px-4">
            <h2 className="text-2xl font-semibold text-blue-900">
              Se connecter
            </h2>
            <SigninForm />
          </div>
        </Card>
      </main>
    </>
  );
};
export default SigninView;
