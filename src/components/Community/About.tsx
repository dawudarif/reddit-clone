import React, { useRef, useState } from 'react';
import { Community, communityState } from '../../atoms/communitiesAtom';
import {
  Flex,
  Text,
  Box,
  Icon,
  Stack,
  Divider,
  Button,
  Image,
  Spinner,
} from '@chakra-ui/react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { RiCakeLine } from 'react-icons/ri';
import moment, { isMoment } from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore, storage } from '../../firebase/clientApp';
import { FaReddit } from 'react-icons/fa';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { useSetRecoilState } from 'recoil';
import useCommunityData from '../../hooks/useCommunityData';
import useSelectFile from '../../hooks/useSelectFile';

type AboutProps = {
  communityData: Community;
};

const About: React.FC<AboutProps> = ({ communityData }) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const selectedFileRef = useRef<HTMLInputElement>(null);
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const [uploadingImage, setUploadingImage] = useState(false);
  const setCommunityStateValue = useSetRecoilState(communityState);
  const { communityStateValue, onJoinOrLeaveCommunity, loading } =
    useCommunityData();

  const onUpdateImage = async () => {
    if (!selectedFile) return;
    setUploadingImage(true);
    try {
      const imageRef = ref(storage, `communities/${communityData.id}/image`);
      await uploadString(imageRef, selectedFile, 'data_url');
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(firestore, 'communities', communityData.id), {
        imageURL: downloadURL,
      });
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          imageURL: downloadURL,
        } as Community,
      }));
      setUploadingImage(false);
      setSelectedFile('');
    } catch (error) {
      console.log('onUpdateImage error', error);
    }
  };
  // console.log(communityData);
  // console.log(user?.uid);
  return (
    <Box position='sticky' top='14px'>
      <Flex
        bg='blue.400'
        p={3}
        color='white'
        borderRadius='4px 4px 0px 0px'
        justify='space-between'
        align='center'
      >
        <Text fontSize='10pt' fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} />
      </Flex>
      <Flex direction='column' p={3} borderRadius='0px 0px 4px 4px' bg='white'>
        <Stack>
          <Flex width='100%' p={2} fontSize='10pt' fontWeight={700}>
            <Flex direction='column' flexGrow={1}>
              <Text>{communityData.numberOfMembers}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction='column' flexGrow={1}>
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex
            align='center'
            width='100%'
            fontWeight={500}
            fontSize='10pt'
            p={1}
          >
            <Icon as={RiCakeLine} mr={1} />
            {communityData.createdAt && (
              <Text>
                Created{` `}
                {moment(
                  new Date(communityData.createdAt?.seconds * 1000)
                ).format('MMM DD,YYYY')}
              </Text>
            )}
          </Flex>
          <Link href={`/r/${communityData.id}/submit`}>
            <Button mt={3} height='30px'>
              Create Post
            </Button>
          </Link>
          {user?.uid === communityData.creatorId && (
            <>
              <Divider />
              <Stack spacing={1} fontSize='10pt'>
                <Text fontWeight={400}>Admin</Text>
                <Flex align='center' justify='space-between'>
                  <Text
                    color='blue.500'
                    cursor='pointer'
                    _hover={{ textDecoration: 'underline' }}
                    onClick={() => selectedFileRef.current?.click()}
                  >
                    Change Image
                  </Text>

                  {communityData.imageURL || selectedFile ? (
                    <Image
                      src={
                        selectedFile ||
                        communityStateValue.currentCommunity?.imageURL
                      }
                      borderRadius='full'
                      boxSize='40px'
                      alt='community image'
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize={40}
                      color='brand.100'
                      mr={2}
                    />
                  )}
                </Flex>
                {selectedFile &&
                  (uploadingImage ? (
                    <Spinner />
                  ) : (
                    <Text
                      cursor='pointer'
                      onClick={onUpdateImage}
                      color='red.500'
                      // fontWeight={400}
                    >
                      Save Changes
                    </Text>
                  ))}
                <input
                  ref={selectedFileRef}
                  type='file'
                  hidden
                  onChange={onSelectFile}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};
export default About;
