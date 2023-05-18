import { Button, Flex, Menu } from '@chakra-ui/react';
import React from 'react';
import AuthButton from './AuthButton';
import AuthModal from '../../Modal/Auth/AuthModal';
import { User, signOut } from 'firebase/auth';
import { auth } from '../../../firebase/clientApp';
import Icons from './Icons';
import UserMenu from './UserMenu';

type RightContentProps = {
  user?: User | null;
  // ? is undefined, or the user is null
  loading: any;
};

const RightContent: React.FC<RightContentProps> = ({ user, loading }) => {
  return (
    <>
      <AuthModal />
      <Flex justify='centre' align='center'>
        {user ? <Icons /> : <AuthButton />}
        <UserMenu user={user} />
      </Flex>
    </>
  );
};
export default RightContent;
