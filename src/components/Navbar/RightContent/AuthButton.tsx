import React from 'react';
import { Button } from '@chakra-ui/react';
import { useSetRecoilState } from 'recoil';
import { AuthModalState } from '../../../atoms/authModalAtom';

const AuthButton: React.FC = () => {
  const setAuthModalState = useSetRecoilState(AuthModalState);
  return (
    <>
      <Button
        variant='outline'
        height='28px'
        display={{ base: 'none', sm: 'flex' }}
        width={{ base: '70px', md: '110px' }}
        mr={2}
        onClick={() => setAuthModalState({ open: true, view: 'login' })}
      >
        Log In
      </Button>
      <Button
        variant='solid'
        height='28px'
        display={{ base: 'none', sm: 'flex' }}
        width={{ base: '70px', md: '110px' }}
        mr={2}
        onClick={() => setAuthModalState({ open: true, view: 'signup' })}
      >
        Sign Up
      </Button>
    </>
  );
};
export default AuthButton;
