import NaverLogin from '@react-native-seoul/naver-login';
import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { checkIfUserExists } from '../lib';
import Toast from 'react-native-toast-message';
import { emailLogin, emailSignUp } from '../api';

export const useNaverLogin = () => {
  const navigation = useNavigation();

  return useCallback(async () => {
    try {
      const { failureResponse, successResponse } = await NaverLogin.login();
      if (successResponse) {
        let userId = '';

        const profileResult = await NaverLogin.getProfile(
          successResponse!.accessToken,
        );

        const { user: loginUser } = await emailLogin(
          profileResult.response.email,
          `${process.env.NAVER_USER_PASSWORD}${profileResult.response.id}`,
        );

        if (!loginUser) {
          const { user: signUpUser } = await emailSignUp(
            profileResult.response.email,
            `${process.env.NAVER_USER_PASSWORD}${profileResult.response.id}`,
            profileResult.response.name,
          );

          if (!signUpUser) {
            Toast.show({
              type: 'error',
              text1: '이미 가입한 이메일입니다. 다른 방법으로 로그인 해주세요.',
            });

            return;
          }

          userId = signUpUser.id;
        } else {
          userId = loginUser.id;
        }

        const isUserExists = await checkIfUserExists(userId);
        navigation.navigate(isUserExists ? 'Home' : 'PhoneAuth', {
          platform: 'naver',
        });
      } else {
        console.error(failureResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
};
