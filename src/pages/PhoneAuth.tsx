import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const OPTIONS = [
  "SKT",
  "KT",
  "LG U+",
  "SKT 알뜰폰",
  "KT 알뜰폰",
  "LG U+ 알뜰폰",
];

export default function PhoneAuthScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const onSelect = (option: string) => {
    setSelected(option);
    setVisible(false);
  };

  return (
    <>
      <View className="flex-1 px-6 py-10 bg-white gap-y-6">
        <View>
          <Text className="font-semibold">이름</Text>
          <TextInput
            className="p-3 mt-1.5 border border-gray-300 rounded"
            placeholder="휴대폰 명의자 입력"
          />
        </View>
        <View>
          <Text className="font-semibold">주민등록번호 앞 7자리</Text>
          <View className="flex-row items-center mt-1.5">
            <TextInput
              secureTextEntry={true}
              className="w-1/2 p-3 border border-gray-300 rounded"
              placeholder="●●●●●●"
              maxLength={6}
            />
            <Text className="mx-3 text-gray-700">-</Text>
            <TextInput
              className="w-10 p-3 border border-gray-300 rounded"
              placeholder="●"
            />
            <Text className="ml-3 tracking-[2px] text-gray-700">●●●●●●</Text>
          </View>
        </View>
        <View>
          <Text className="font-semibold">휴대폰 번호</Text>
          <Pressable
            onPress={() => setVisible(true)}
            className="w-full p-3 border border-gray-300 rounded mt-1.5"
          >
            <Text style={{ color: selected ? "#000" : "#999" }}>
              {selected || "통신사 선택"}
            </Text>
          </Pressable>
          <View className="mt-1.5 flex-row items-stretch justify-between">
            <TextInput
              className="w-3/4 p-3 border border-gray-300 rounded"
              placeholder="'-'빼고 휴대폰 번호 입력"
            />
            <Pressable className="justify-center px-4 bg-blue-200 rounded">
              <Text className="font-semibold text-center text-blue-500">
                인증하기
              </Text>
            </Pressable>
          </View>
        </View>
        <TextInput
          className="p-3 border border-gray-300 rounded"
          placeholder="인증번호 4자리 입력"
        />
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          className="flex-1 bg-[#0000005c] items-center justify-center"
          onPress={() => setVisible(false)}
        >
          <View className="bg-white rounded-md w-80">
            <FlatList
              data={OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => onSelect(item)}
                  className={`px-4 py-3 border-gray-300 ${index === 5 ? "" : "border-b"}`}
                >
                  <Text className="text-lg">{item}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
