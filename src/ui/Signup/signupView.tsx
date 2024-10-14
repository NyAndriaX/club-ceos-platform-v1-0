'use client';

import React, { useState, useEffect } from 'react';
import { UserInput } from '@/typings';
import { useLocalStorage } from 'primereact/hooks';
import SignupForm from './components/signupForm';
import { SignupFormStepper } from './components/signupForm.stepper';

const SignupView = () => {
  const [formUserRegister, setFormUserRegister] = useLocalStorage<
    Partial<UserInput>
  >({}, 'formUserRegister');
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <main className="flex flex-col items-start gap-4 md:gap-20 px-4">
      <SignupFormStepper activeIndex={activeIndex} />
      <SignupForm
        formUserRegister={formUserRegister}
        setFormUserRegister={setFormUserRegister}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
    </main>
  );
};
export default SignupView;
