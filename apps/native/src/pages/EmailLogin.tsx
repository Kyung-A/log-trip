import { resendEmail, useEmailLogin } from '@/features/auth';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';

export default function EmailLoginScreen({ navigation }) {
  const [resendMail, setResendMail] = useState<boolean>(false);
  const { control, handleSubmit, getValues } = useForm();
  const login = useEmailLogin();

  const handleResendMail = useCallback(async () => {
    const email = getValues('email');
    await resendEmail(email);

    Toast.show({
      type: 'success',
      text1: '메일을 확인해주세요.',
    });
  }, [getValues]);

  const handleLogin = handleSubmit(
    async formData => {
      const result = await login(formData.email, formData.password);

      if (result?.includes('Invalid login credentials')) {
        Toast.show({
          type: 'error',
          text1: '잘못된 이메일 또는 비밀번호 입니다.',
        });
        return;
      }

      if (result?.includes('Email not confirmed')) {
        Toast.show({
          type: 'error',
          text1: '이메일 인증을 완료해주세요.',
        });
        setResendMail(true);
        return;
      }
    },
    error => {
      Toast.show({
        type: 'error',
        text1: Object.values(error)[0].message as string,
      });
    },
  );

  return (
    <View className="flex-1 px-6 py-10 bg-white gap-y-6">
      <Controller
        control={control}
        name="email"
        rules={{
          required: '이메일은 필수입니다.',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: '이메일 형식이 올바르지 않습니다.',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <View>
            <Text className="text-lg font-semibold">이메일</Text>
            <TextInput
              className="px-3 text-lg py-4 leading-6 mt-1.5 border border-gray-300 rounded-md"
              placeholder="이메일 입력"
              onChangeText={onChange}
              value={value}
            />
          </View>
        )}
      />
      <Controller
        control={control}
        name="password"
        rules={{
          required: '비밀번호는 필수입니다.',
        }}
        render={({ field: { onChange, value } }) => (
          <View>
            <Text className="text-lg font-semibold">비밀번호</Text>
            <TextInput
              className="px-3 text-lg py-4 leading-6 mt-1.5 border border-gray-300 rounded-md"
              placeholder="비밀번호 입력"
              onChangeText={onChange}
              value={value}
              secureTextEntry={true}
            />
          </View>
        )}
      />

      {resendMail && (
        <View className="py-2 mx-auto">
          <Text>인증 메일 다시 보내기</Text>
          <TouchableOpacity onPress={handleResendMail} className="mt-2">
            <Text className="py-2 font-semibold text-center text-orange-600">
              메일 재전송
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Pressable
        onPress={handleLogin}
        className="justify-center bg-blue-200 rounded-md"
      >
        <Text className="py-3 text-lg font-semibold text-center text-blue-500">
          로그인
        </Text>
      </Pressable>
      <TouchableOpacity onPress={() => navigation.navigate('EmailSignUp')}>
        <Text className="py-2 text-center">이메일로 회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}
