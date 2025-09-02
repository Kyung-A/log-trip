import { registerPushToken, supabase } from '@/shared';
import NaverLogin from '@react-native-seoul/naver-login';
import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { checkIfUserExists } from '../lib';

export const useNaverLogin = () => {
  const navigation = useNavigation();

  return useCallback(async () => {
    const { failureResponse, successResponse } = await NaverLogin.login();
    if (successResponse) {
      let userId = '';

      const profileResult = await NaverLogin.getProfile(
        successResponse!.accessToken,
      );

      const {
        data: { user: loginUser },
      } = await supabase.auth.signInWithPassword({
        email: profileResult.response.email,
        password: `${process.env.NAVER_USER_PASSWORD}${profileResult.response.id}`,
      });

      if (!loginUser) {
        const {
          data: { user: signUpUser },
        } = await supabase.auth.signUp({
          email: profileResult.response.email,
          password: `${process.env.NAVER_USER_PASSWORD}${profileResult.response.id}`,
          options: {
            data: {
              name: profileResult.response.name,
              email_verified: true,
              email: profileResult.response.email,
            },
          },
        });

        userId = signUpUser.id;
      } else {
        userId = loginUser.id;
      }

      const isUserExists = await checkIfUserExists(userId);

      await registerPushToken(userId);
      navigation.navigate(isUserExists ? 'Home' : 'PhoneAuth', {
        platform: 'naver',
      });
    } else {
      console.error(failureResponse);
    }
  }, []);
};
