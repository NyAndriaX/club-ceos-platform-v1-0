import React from 'react';
import { motion } from 'framer-motion';
import { CardMember } from './CardMember';
import { useWindow } from '@/app/hooks/useWindow';

export interface MemberState {
  picture?: string;
  firstName: string;
  lastName: string;
}

export const membersGroup: MemberState[] = [
  {
    picture: '/next.svg',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    picture: '/next.svg',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    picture: '/next.svg',
    firstName: 'John',
    lastName: 'Doe',
  },
];

export const membersGroup1: MemberState[] = [
  {
    picture: '/next.svg',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    picture: '/next.svg',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    picture: '/next.svg',
    firstName: 'John',
    lastName: 'Doe',
  },
];

export const membersGroup2: MemberState[] = [
  {
    picture: '/next.svg',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    picture: '/next.svg',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    picture: '/next.svg',
    firstName: 'John',
    lastName: 'Doe',
  },
];

export const membersGroup3: MemberState[] = [
  {
    picture: '/next.svg',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    picture: '/next.svg',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    picture: '/next.svg',
    firstName: 'John',
    lastName: 'Doe',
  },
];

const ANIMATION_DURATION = 50;

export const AnimatedMembersList: React.FC = () => {
  const { isMobile } = useWindow();

  const items = [...membersGroup, ...membersGroup];
  const items1 = [...membersGroup1, ...membersGroup1];
  const items2 = [...membersGroup2, ...membersGroup2];

  return (
    <div
      style={{ width: isMobile ? 'calc(100vw - 2rem)' : 'auto' }}
      className="flex flex-row gap-2 items-start overflow-hidden rounded-md justify-start transform -skew-x-6"
    >
      <div className="w-1/3 relative h-96 overflow-hidden">
        <motion.div
          className="flex flex-col space-y-4"
          animate={{ y: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            duration: ANIMATION_DURATION,
            ease: 'linear',
          }}
          style={{ transform: 'translateY(0)' }}
        >
          {items.map((item, index) => (
            <CardMember key={index} member={item} />
          ))}
        </motion.div>
      </div>
      <div className="w-1/3 relative h-96 overflow-hidden">
        <motion.div
          className="flex flex-col space-y-4"
          animate={{ y: ['-50%', '0%'] }}
          transition={{
            repeat: Infinity,
            duration: ANIMATION_DURATION,
            ease: 'linear',
          }}
        >
          {items1.map((item, index) => (
            <CardMember key={index} member={item} />
          ))}
        </motion.div>
      </div>
      <div className="w-1/3 relative h-96 overflow-hidden">
        <motion.div
          className="flex flex-col space-y-4"
          animate={{ y: ['0%', '-50%'] }}
          transition={{
            repeat: Infinity,
            duration: ANIMATION_DURATION,
            ease: 'linear',
          }}
          style={{ transform: 'translateY(0)' }}
        >
          {items2.map((item, index) => (
            <CardMember key={index} member={item} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};
