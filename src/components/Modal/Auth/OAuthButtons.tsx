import { Button, Flex, Image, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useSignInWithFacebook } from 'react-firebase-hooks/auth';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../../firebase/clientApp';
import { doc, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, userCredGoogle, loadingGoogle, errorGoogle] =
    useSignInWithGoogle(auth);
  const [signInWithFacebook, userCredFacebook, loadingFacebook, errorFacebook] =
    useSignInWithFacebook(auth);

  const createUserDocument = async (user: User) => {
    const userDocRef = doc(firestore, 'users', user.uid);
    await setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
  };

  useEffect(() => {
    if (userCredGoogle) {
      createUserDocument(userCredGoogle.user);
    }
    if (userCredFacebook) {
      createUserDocument(userCredFacebook.user);
    }
  });

  return (
    <Flex direction='column' width='100%' mb={4}>
      <Button
        variant='oauth'
        mb={2}
        isLoading={loadingGoogle}
        onClick={() => signInWithGoogle()}
      >
        <Image src='/images/googlelogo.png' height='20px' alt='google' mr={4} />
        Continue with Google
      </Button>
      <Button
        variant='oauth'
        isLoading={loadingFacebook}
        onClick={() => signInWithFacebook()}
      >
        <Image src='/images/facebook.png' height='20px' alt='facebook' mr={4} />
        Continue with Facebook
      </Button>
      {/* {errorFacebook && <Text>{errorFacebook.message}</Text>} */}
      {/* {errorGoogle && <Text>{errorGoogle.message}</Text>} */}
    </Flex>
  );
};
export default OAuthButtons;
