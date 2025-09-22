import { getUser } from '@/entities/auth';
import { registerPushToken, supabase } from '@/shared';
import { PickerIOS } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const OPTIONS = [
  'SKT',
  'KT',
  'LG U+',
  'SKT 알뜰폰',
  'KT 알뜰폰',
  'LG U+ 알뜰폰',
];

const DEFAULT_VALUES = {
  name: '',
  year_of_birth: '',
  gender: '',
  mobileCarrier: '',
  phone: '',
};

// TODO: 주석처리 한 부분은 추후 추가예정
export default function PhoneAuthScreen({ navigation }) {
  const route = useRoute();

  // const [selected, setSelected] = useState<string | null>(null);
  // const [visible, setVisible] = useState(false);
  // const [timeLeft, setTimeLeft] = useState<number>(0);
  // const [errorVerifyCode, setErrorVerifyCode] = useState<boolean>(false);

  const { control, watch, getValues } = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  const createUser = async () => {
    const user = await getUser();

    const formData = getValues();
    const { platform } = route.params as any;

    await supabase.from('users').insert({
      id: user.id,
      email: user.email,
      nickname: formData.name,
      name: formData.name,
      year_of_birth: formData.year_of_birth,
      gender: formData.gender,
      platform: platform || 'email',
      // phone: formData.phone,
      // mobile_carrier: formData.mobileCarrier,
    });

    await registerPushToken(user.id);
    navigation.navigate('Home');
  };

  // const handleSendSMS = handleSubmit(
  //   async formData => {
  //     if (formData.phone.length !== 11) {
  //       Toast.show({
  //         type: 'error',
  //         text1: '올바른 휴대폰 번호가 아닙니다.',
  //       });
  //       return;
  //     }
  //     if (!formData.mobileCarrier) {
  //       Toast.show({
  //         type: 'error',
  //         text1: '이동통신사 선액은 필수입니다.',
  //       });
  //       return;
  //     }

  //     const result = await sendSMS(formData.phone);
  //     if (result.statusCode === '2000') {
  //       setTimeLeft(180);
  //     }
  //   },
  //   error => {
  //     Toast.show({
  //       type: 'error',
  //       text1: Object.values(error)[0].message as string,
  //     });
  //   },
  // );

  // const handleVerifyCode = useCallback(async (code: string) => {
  //   const phone = getValues('phone');

  //   const reislt = await verifyCode({ phone: phone, code: code });

  //   if (reislt.status === 200) {
  //     return await createUser();
  //   } else {
  //     setErrorVerifyCode(true);
  //   }
  // }, []);

  // const onSelect = useCallback((option: string) => {
  //   setSelected(option);
  //   setValue('mobileCarrier', option);
  //   setVisible(false);
  // }, []);

  // const minutes = Math.floor(timeLeft / 60);
  // const seconds = timeLeft % 60;

  // useEffect(() => {
  //   if (timeLeft <= 0) return;

  //   const interval = setInterval(() => {
  //     setTimeLeft(prev => prev - 1);
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, [timeLeft]);

  return (
    <>
      <View className="flex-1 px-6 py-10 bg-white gap-y-6">
        <Controller
          control={control}
          name="name"
          rules={{
            required: '이름은 필수입니다.',
          }}
          render={({ field: { onChange, value } }) => (
            <View>
              <Text className="text-lg font-semibold">이름</Text>
              <TextInput
                className="px-3 text-lg py-4 leading-6 mt-1.5 border border-gray-300 rounded-md"
                placeholder="이름 입력"
                onChangeText={onChange}
                value={value}
                // editable={timeLeft <= 0}
              />
            </View>
          )}
        />

        <View>
          <Text className="text-lg font-semibold">성별</Text>
          <Controller
            control={control}
            name="gender"
            rules={{
              required: '성별은 필수입니다.',
            }}
            render={({ field: { onChange, value } }) => (
              <View className="flex-row items-center gap-x-6 mt-1.5">
                <TouchableOpacity
                  onPress={() => {
                    if (!value || value === 'M') {
                      onChange('F');
                    }
                  }}
                  className="flex-row items-center gap-x-1"
                >
                  <MaterialCommunityIcons
                    name={
                      value === 'F'
                        ? 'checkbox-marked'
                        : 'checkbox-blank-outline'
                    }
                    size={24}
                    color={value === 'F' ? '#000' : '#ccc'}
                  />
                  <Text>여성</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (!value || value === 'F') {
                      onChange('M');
                    }
                  }}
                  className="flex-row items-center gap-x-1"
                >
                  <MaterialCommunityIcons
                    name={
                      value === 'M'
                        ? 'checkbox-marked'
                        : 'checkbox-blank-outline'
                    }
                    size={24}
                    color={value === 'M' ? '#000' : '#ccc'}
                  />
                  <Text>남성</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <View>
          <Text className="text-lg font-semibold">태어난 연도</Text>
          <Controller
            control={control}
            name="year_of_birth"
            rules={{
              required: '태어난 연도는 필수입니다.',
            }}
            render={({ field: { onChange, value } }) => {
              const curYear = dayjs().get('year');
              const minYear = 1900;
              const maxYear = curYear - 18;

              const years = [];
              for (let y = maxYear; y >= minYear; y--) {
                years.push(y);
              }

              return (
                <View className="w-full">
                  <PickerIOS
                    selectedValue={value}
                    onValueChange={onChange}
                    style={{ height: 180 }}
                  >
                    {years?.map(year => (
                      <PickerIOS.Item
                        key={year}
                        label={`${year}`}
                        value={year}
                      />
                    ))}
                  </PickerIOS>
                </View>
              );
            }}
          />
        </View>

        {/* <View>
          <Text className="text-lg font-semibold">휴대폰 번호</Text>
          <Pressable
            onPress={() => setVisible(true)}
            className="w-full px-3 text-lg py-4 leading-6 border border-gray-300 rounded-md mt-1.5"
            disabled={timeLeft > 0}
          >
            <Text style={{ color: selected ? '#000' : '#999' }}>
              {selected || '통신사 선택'}
            </Text>
          </Pressable>

          <View className="mt-1.5 flex-row items-stretch justify-between gap-x-2">
            <Controller
              control={control}
              name="phone"
              rules={{
                required: '휴대폰 번호는 필수입니다.',
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="px-3 py-4 text-lg leading-6 border border-gray-300 rounded-md flex-[2]"
                  placeholder="'-'빼고 휴대폰 번호 입력"
                  onChangeText={onChange}
                  value={value}
                  editable={timeLeft <= 0}
                />
              )}
            />

            <Pressable
              onPress={handleSendSMS}
              className="justify-center flex-1 bg-blue-200 rounded-md disabled:bg-gray-300"
              disabled={
                timeLeft > 0 || Object.values(watch()).some(v => v === '')
              }
            >
              <Text
                className={`font-bold text-lg text-center ${
                  timeLeft > 0 || Object.values(watch()).some(v => v === '')
                    ? 'text-gray-400'
                    : 'text-blue-500'
                }`}
              >
                인증하기
              </Text>
            </Pressable>
          </View>
        </View> */}

        {/* {timeLeft > 0 && (
          <View>
            <Text className="mb-1 font-semibold text-red-500">
              {String(minutes).padStart(2, '0')}:
              {String(seconds).padStart(2, '0')}
            </Text>
            <TextInput
              className="px-3 py-4 text-lg leading-6 border border-gray-300 rounded-md"
              placeholder="인증번호 4자리 입력"
              onChangeText={value => {
                setErrorVerifyCode(false);
                if (value.length === 6) {
                  handleVerifyCode(value);
                }
              }}
              maxLength={6}
            />
            {errorVerifyCode && (
              <Text className="mb-1 font-semibold text-red-500">
                인증번호가 일치하지 않습니다
              </Text>
            )}
          </View>
        )} */}
        <TouchableOpacity
          onPress={createUser}
          className={`justify-center rounded-md ${
            watch('name') === '' ||
            watch('year_of_birth') === '' ||
            watch('gender') === ''
              ? 'bg-gray-200 '
              : 'bg-blue-200'
          }`}
          disabled={
            watch('name') === '' ||
            watch('year_of_birth') === '' ||
            watch('gender') === ''
          }
        >
          <Text
            className={`py-3 text-lg font-semibold text-center ${
              watch('name') === '' ||
              watch('year_of_birth') === '' ||
              watch('gender') === ''
                ? 'text-gray-400'
                : 'text-blue-500'
            }`}
          >
            완료
          </Text>
        </TouchableOpacity>
      </View>

      {/* <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          className="flex-1 bg-[#00000076] items-center justify-center"
          onPress={() => setVisible(false)}
        >
          <View className="bg-white rounded-md w-80">
            <FlatList
              data={OPTIONS}
              keyExtractor={item => item}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => onSelect(item)}
                  className={`px-4 py-3 border-gray-300 ${index === 5 ? '' : 'border-b'}`}
                >
                  <Text className="text-lg">{item}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal> */}
    </>
  );
}
