import { useEmailSignUp } from '@/features/auth';
import { supabase } from '@/shared';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, Text, TextInput, Pressable, Linking, Alert } from 'react-native';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function EmailSignUpScreen() {
  const { control, handleSubmit, getValues } = useForm();
  const signUp = useEmailSignUp();

  const [selected, setSelected] = useState<boolean>(false);
  const [duplicateCheck, setDuplicateCheck] = useState<boolean>(false);

  const handleDuplicateCheck = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('email', getValues('email'))
        .single();

      if (data) {
        Toast.show({
          type: 'error',
          text1: '이미 존재하는 이메일입니다.',
        });
        return;
      }

      setDuplicateCheck(true);
    } catch (error) {
      console.error(error);
    }
  }, [getValues]);

  const handleLogin = handleSubmit(
    async formData => {
      if (!duplicateCheck) {
        Toast.show({
          type: 'error',
          text1: '이메일 중복 체크는 필수입니다.',
        });

        return;
      }

      if (!selected) {
        Toast.show({
          type: 'error',
          text1: '개인정보보호 및 이용약관 동의는 필수입니다.',
        });

        return;
      }

      await signUp(formData.email, formData.password);
    },
    error => {
      Toast.show({
        type: 'error',
        text1: Object.values(error)[0].message as string,
      });
    },
  );

  const openExternal = useCallback(async () => {
    try {
      await Linking.openURL(
        'https://useful-shield-356.notion.site/2636f7963e8d80f994c6c32a77d53e6a',
      );
    } catch (e) {
      Alert.alert('링크 열기에 실패했어요.', String(e));
    }
  }, []);

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
            <View className="flex-row items-center mt-1.5 justify-between gap-x-2">
              <TextInput
                className="flex-1 px-3 py-4 text-lg leading-6 border border-gray-300 rounded-md"
                placeholder="이메일 입력"
                onChangeText={onChange}
                value={value}
              />
              <Pressable
                onPress={handleDuplicateCheck}
                className={`box-border justify-center border rounded-md ${duplicateCheck ? 'border-gray-200 bg-gray-200' : 'border-blue-500'}`}
                disabled={duplicateCheck}
              >
                <Text
                  className={`px-3 py-[17px] font-semibold text-center ${duplicateCheck ? 'text-gray-400' : 'text-blue-500'}`}
                >
                  중복 확인
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      />
      <Controller
        control={control}
        name="password"
        rules={{
          required: '비밀번호는 필수입니다.',
          minLength: { value: 6, message: '6자 이상 입력해주세요.' },
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
      <Controller
        control={control}
        name="password2"
        rules={{
          required: '비밀번호 확인은 필수입니다.',
          validate: v =>
            v === getValues('password') || '비밀번호가 서로 일치하지 않습니다.',
        }}
        render={({ field: { onChange, value } }) => (
          <View>
            <Text className="text-lg font-semibold">비밀번호 확인</Text>
            <TextInput
              className="px-3 text-lg py-4 leading-6 mt-1.5 border border-gray-300 rounded-md"
              placeholder="비밀번호 확인 입력"
              onChangeText={onChange}
              value={value}
              secureTextEntry={true}
            />
          </View>
        )}
      />

      <Pressable
        onPress={openExternal}
        className="flex-row items-center gap-x-2"
      >
        <MaterialCommunityIcons
          onPress={() => setSelected(prev => !prev)}
          name={selected ? 'checkbox-marked' : 'checkbox-blank-outline'}
          size={28}
          color={selected ? '#000' : '#ccc'}
        />
        <Text className="text-base text-gray-600">
          개인정보보호 및 이용약관 동의 (필수)
        </Text>
      </Pressable>

      <Pressable
        onPress={handleLogin}
        className="justify-center bg-blue-200 rounded-md"
      >
        <Text className="py-3 text-lg font-semibold text-center text-blue-500">
          회원가입
        </Text>
      </Pressable>
    </View>
  );
}
