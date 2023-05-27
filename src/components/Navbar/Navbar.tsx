import { Flex, Image } from '@chakra-ui/react';
import React from 'react';
import SearchInput from './SearchInput';
import RightContent from './RightContent/RightContent';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/clientApp';
import useDirectory from '../../hooks/useDirectory';
import Directory from './Directory/Directory';
import { defaultMenuItem } from '../../atoms/directoryMenuItem';

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const { onSelectMenuItem } = useDirectory();

  return (
    <Flex
      bg='white'
      height='44px'
      padding='6px 12px'
      justify={{ md: 'space-between' }}
    >
      <Flex
        align='center'
        m={1}
        width={{ base: '40px', md: 'auto' }}
        onClick={() => onSelectMenuItem(defaultMenuItem)}
        cursor='pointer'
      >
        <Image src='/images/redditFace.svg' height='30px' alt='reddit' />
        <Image
          src='/images/redditText.svg'
          height='30px'
          alt='reddit'
          display={{ base: 'none', md: 'unset' }}
        />
      </Flex>
      {user && <Directory />}
      <SearchInput user={user} />
      <RightContent loading={loading} user={user} />
    </Flex>
  );
};
export default Navbar;
