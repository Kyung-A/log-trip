import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { emailLogin } from '../api';
import { checkIfUserExists } from '../lib';

export const useEmailLogin = () => {
  const navigation = useNavigation();

  return useCallback(
    async (email: string, password: string) => {
      try {
        const {
          data: { user },
          error,
        } = await emailLogin(email, password);

        if (error?.message) {
          return error?.message;
        }

        const isUserExists = await checkIfUserExists(user.id);

        if (isUserExists) {
          navigation.navigate('Home');
        } else {
          navigation.navigate('PhoneAuth', {
            platform: 'email',
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    [navigation],
  );
};
