import React, { useState } from 'react';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import { BiPoll } from 'react-icons/bi';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react';
import TabItems from './TabItems';
import TextInputs from './PostForm/TextInputs';
import ImageUpload from './PostForm/ImageUpload';
import { Post } from '../../atoms/postsAtom';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import {
  Timestamp,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { firestore, storage } from '../../firebase/clientApp';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import useSelectFile from '../../hooks/useSelectFile';

type NewPostFormProps = {
  user: User;
  communityImageURL?: string;
};

const formTabs: TabItem[] = [
  {
    title: 'Post',
    icon: IoDocumentText,
  },
  {
    title: 'Images & Video',
    icon: IoImageOutline,
  },
  {
    title: 'Link',
    icon: BsLink45Deg,
  },
  {
    title: 'Poll',
    icon: BiPoll,
  },
  {
    title: 'Talk',
    icon: BsMic,
  },
];

export type TabItem = {
  title: string;
  icon: typeof Icon.arguments;
};

const NewPostForm: React.FC<NewPostFormProps> = ({
  user,
  communityImageURL,
}) => {
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: '',
    body: '',
  });
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  // console.log(user);

  const handleCreatePost = async () => {
    const { communityId } = router.query;
    // check new post object
    const newPost: Post = {
      // id: user?.uid as string,
      communityId: communityId as string,
      creatorId: user?.uid,
      creatorDisplayName: user.email!.split('@')[0],
      title: textInputs.title,
      body: textInputs.body,
      numberOfComments: 0,
      voteStatus: 0,
      // imageURL?: string;
      communityImageURL: communityImageURL || '',
      createdAt: serverTimestamp() as Timestamp,
    };
    // store post in db

    setLoading(true);
    try {
      const postDocRef = await addDoc(collection(firestore, 'posts'), newPost);
      // check for selectedFile

      if (selectedFile) {
        /// store in storage => getdownload return(imageURL)
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, 'data_url');
        const downloadURL = await getDownloadURL(imageRef);

        /// update post doc by adding imageURL
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
      }

      // redirect the user back to communityPage using the router
      router.back();
    } catch (error: any) {
      console.log('handleCreatePost error', error.message);
      setError(true);
    }
    setLoading(false);
  };

  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Flex direction='column' bg='white' borderRadius={4} mt={2}>
      <Flex width='100%'>
        {formTabs.map((item) => (
          <>
            <TabItems
              key={item.title}
              item={item}
              selected={item.title === selectedTab}
              setSelectedTab={setSelectedTab}
            />
          </>
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === 'Post' && (
          <TextInputs
            textInputs={textInputs}
            handleCreatePost={handleCreatePost}
            onChange={onTextChange}
            loading={loading}
          />
        )}
        {selectedTab === 'Images & Video' && (
          <ImageUpload
            setSelectedFile={setSelectedFile}
            selectedFile={selectedFile}
            setSelectedTab={setSelectedTab}
            onSelectImage={onSelectFile}
          />
        )}
      </Flex>
      {error && (
        <Alert status='error'>
          <AlertIcon />
          <Text mr={2}>Error creating post</Text>
        </Alert>
      )}
    </Flex>
  );
};
export default NewPostForm;
