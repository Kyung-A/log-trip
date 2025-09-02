import { registerPushToken, supabase } from '@/shared';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { useCallback } from 'react';
import { checkIfUserExists } from '../lib';
import { getUser } from '@/entities/auth';
import { signInSNS } from '..';

export const useKakaoLogin = () => {
  const navigation = useNavigation();

  return useCallback(async () => {
    const { data, error } = await signInSNS('kakao');

    if (error || !data?.url) {
      console.error('Kakao OAuth error:', error.message);
      return;
    }

    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      process.env.AUTH_CALLBACK_URL,
    );

    if (result.type !== 'success') return;

    const rawUrl = result.url.replace('#', '?');
    const parsedUrl = new URL(rawUrl);
    const accessToken = parsedUrl.searchParams.get('access_token');
    const refreshToken = parsedUrl.searchParams.get('refresh_token');

    if (!accessToken || !refreshToken) return;

    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    const user = await getUser();
    const isUserExists = await checkIfUserExists(user.id);

    await registerPushToken(user.id);
    navigation.navigate(isUserExists ? 'Home' : 'PhoneAuth', {
      platform: 'kakao',
    });
  }, [navigation]);
};
