'use client';

import React, { useState } from 'react';
import { User } from '@prisma/client';
import { useLocalStorage } from 'primereact/hooks';
import { SignupFormStepper } from '@/app/components/unrestricted/signup/signupForm.stepper';
import SignupForm from '@/app/components/unrestricted/signup/signupForm';

const SignupPage: React.FC = () => {
  const [formUserRegister, setFormUserRegister] = useLocalStorage<
    Partial<User>
  >({}, 'formUserRegister');
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <div className="flex flex-col items-start gap-4 md:gap-20 px-4">
      <SignupFormStepper activeIndex={activeIndex} />
      <SignupForm
        formUserRegister={formUserRegister}
        setFormUserRegister={setFormUserRegister}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
    </div>
  );
};

export default SignupPage;
