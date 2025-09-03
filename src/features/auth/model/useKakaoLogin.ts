import { registerPushToken, supabase } from '@/shared';
import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { checkIfUserExists } from '../lib';
import { login } from '@react-native-seoul/kakao-login';

export const useKakaoLogin = () => {
  const navigation = useNavigation();

  return useCallback(async () => {
    try {
      const { idToken } = await login();

      if (!idToken) {
        throw new Error('Failed to login with Kakao.');
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'kakao',
        token: idToken,
      });

      if (error) {
        throw new Error(error?.message);
      }

      const isUserExists = await checkIfUserExists(data.user.id);

      await registerPushToken(data.user.id);
      navigation.navigate(isUserExists ? 'Home' : 'PhoneAuth', {
        platform: 'kakao',
      });
    } catch (error) {
      console.error(error);
    }
  }, [navigation]);
};
