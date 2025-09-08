import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { emailSignUp } from '../api';
import Toast from 'react-native-toast-message';

export const useEmailSignUp = () => {
  const navigation = useNavigation();

  return useCallback(
    async (email: string, password: string) => {
      try {
        const response = await emailSignUp(email, password);
        if (response.data) {
          Toast.show({
            type: 'success',
            text1: '입력하신 이메일의 메일함을 확인해주세요.',
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    [navigation],
  );
};
