import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { supabase } from './supabase';

export async function registerPushToken(userId) {
  if (!Device.isDevice) throw new Error('실기기에서만 사용 가능');

  const perm = await Notifications.getPermissionsAsync();
  let status = perm.status;

  if (status !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }

  if (status !== 'granted') throw new Error('권한 거부됨');

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ||
    Constants.easConfig?.projectId;
  if (!projectId) throw new Error('EAS projectId 필요 (eas init)');

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

  await supabase
    .from('users')
    .update({ expo_push_token: token })
    .eq('id', userId);

  return token;
}
