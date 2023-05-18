import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { AuthModalState } from '../../../atoms/authModalAtom';
import { TiHome } from 'react-icons/ti';
import Communities from './Communities';
import useDirectory from '../../../hooks/useDirectory';

const Directory: React.FC = () => {
  const setAuthModalState = useSetRecoilState(AuthModalState);
  const { directoryState, toggleMenuOpen } = useDirectory();

  return (
    <Menu isOpen={directoryState.isOpen}>
      <MenuButton
        cursor='pointer'
        padding='0px 6px'
        borderRadius={4}
        mr={2}
        ml={{ base: 0, md: 2 }}
        _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}
        onClick={toggleMenuOpen}
      >
        <Flex
          align='center'
          justify='space-between'
          width={{ base: 'auto', lg: '200px' }}
        >
          <Flex align='center'>
            {directoryState.selectedMenuItem.imageURL ? (
              <Image
                src={directoryState.selectedMenuItem.imageURL}
                alt='image'
                borderRadius='full'
                mr={2}
                boxSize='24px'
              />
            ) : (
              <Icon
                as={directoryState.selectedMenuItem.icon}
                color={directoryState.selectedMenuItem.iconColor}
                fontSize={24}
                mr={{ base: 1, md: 2 }}
              />
            )}
            <Flex display={{ base: 'none', lg: 'flex' }}>
              <Text fontWeight={600} fontSize='10pt'>
                {directoryState.selectedMenuItem.displayText}
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities />
      </MenuList>
    </Menu>
  );
};
export default Directory;
