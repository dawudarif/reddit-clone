import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { AuthModalState } from '../../../atoms/authModalAtom';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../../firebase/clientApp';
import { FIREBASE_ERRORS } from '../../../firebase/errors';
import { addDoc, collection } from 'firebase/firestore';
import { User } from 'firebase/auth';

const SignUp: React.FC = () => {
  const setAuthModalState = useSetRecoilState(AuthModalState);
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [userError, setUserError] = useState('');

  const [createUserWithEmailAndPassword, userCred, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  //   Firebase Logic
  const onSubmit = (event: React.FocusEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (error) setUserError('');
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setUserError('Passwords do not match');
      return;
    }
    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // update form state
    setSignUpForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const createUserDocument = async (user: User) => {
    await addDoc(
      collection(firestore, 'users'),
      JSON.parse(JSON.stringify(user))
    );
  };

  useEffect(() => {
    if (userCred) {
      createUserDocument(userCred.user);
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <Input
        required
        name='email'
        placeholder='Email'
        type='email'
        mb={2}
        _placeholder={{
          color: 'gray.500',
        }}
        _hover={{
          bg: 'white',
          boredr: '1px solid',
          borderColor: 'blue.500',
        }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        onChange={onChange}
      />
      <Input
        required
        name='password'
        placeholder='Password'
        type='password'
        mb={2}
        _placeholder={{
          color: 'gray.500',
        }}
        _hover={{
          bg: 'white',
          boredr: '1px solid',
          borderColor: 'blue.500',
        }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        onChange={onChange}
      />
      <Input
        required
        name='confirmPassword'
        placeholder='Confirm Password'
        type='password'
        mb={2}
        _placeholder={{
          color: 'gray.500',
        }}
        _hover={{
          bg: 'white',
          boredr: '1px solid',
          borderColor: 'blue.500',
        }}
        _focus={{
          outline: 'none',
          bg: 'white',
          border: '1px solid',
          borderColor: 'blue.500',
        }}
        onChange={onChange}
      />
      {(userError || error) && (
        <Text textAlign='center' color='red' fontSize='10pt '>
          {/* typecasting to a valid index of that object */}
          {userError ||
            FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
        </Text>
      )}
      <Button
        type='submit'
        w='100%'
        height='36px'
        mt={2}
        mb={2}
        isLoading={loading}
      >
        Sign Up
      </Button>
      <Flex fontSize='9pt' justifyContent='center'>
        <Text mr={1}>Already a Redditor?</Text>
        <Text
          color='blue.500'
          fontWeight={700}
          cursor='pointer'
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: 'login',
            }))
          }
        >
          LOG IN
        </Text>
      </Flex>
    </form>
  );
};
export default SignUp;
