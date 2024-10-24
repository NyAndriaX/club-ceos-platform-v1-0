'use client';

import React, { useEffect } from 'react';
import { User } from '@prisma/client';
import LazyLoad from 'react-lazyload';
import { SignupFormStepFour } from './signupForm.stepFour';
import { SignupFormStepThree } from './signupForm.stepThree';
import { SignupFormStepTwo } from './signupForm.stepTwo';
import { SignupFormStepOne } from './signupForm.stepOne';

type Props = {
  activeIndex: number;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  formUserRegister: Partial<User>;
  setFormUserRegister: React.Dispatch<React.SetStateAction<Partial<User>>>;
};

const SignupForm = ({
  activeIndex,
  setActiveIndex,
  formUserRegister,
  setFormUserRegister,
}: Props) => {
  const renderStep = () => {
    switch (activeIndex) {
      case 0:
        return (
          <SignupFormStepOne
            setActiveIndex={setActiveIndex}
            formUserRegister={formUserRegister}
            setFormUserRegister={setFormUserRegister}
          />
        );
      case 1:
        return (
          <SignupFormStepTwo
            setActiveIndex={setActiveIndex}
            formUserRegister={formUserRegister}
            setFormUserRegister={setFormUserRegister}
          />
        );
      case 2:
        return (
          <SignupFormStepThree
            setActiveIndex={setActiveIndex}
            formUserRegister={formUserRegister}
            setFormUserRegister={setFormUserRegister}
          />
        );
      case 3:
        return <SignupFormStepFour />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <LazyLoad>{renderStep()}</LazyLoad>
    </div>
  );
};

export default SignupForm;
