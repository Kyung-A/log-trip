import { useActionSheet } from "@expo/react-native-action-sheet";
import { useCallback, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";

export default function HomeScreen() {
  const { showActionSheetWithOptions } = useActionSheet();
  const [imgs, setImgs] = useState<string[] | null>(null);

  const handleDeleted = useCallback(
    (uri: string) => {
      const newValue = imgs.filter((v) => v !== uri);
      setImgs(newValue);
    },
    [imgs]
  );

  const handleResult = useCallback((res: ImagePicker.ImagePickerResult) => {
    if (!res.canceled) setImgs(res.assets.map((v) => v.uri));
  }, []);

  const pickFromLibrary = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.8,
    });

    handleResult(result);
  }, []);

  const takeWithCamera = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    handleResult(result);
  }, []);

  const onPress = useCallback(() => {
    const options = ["카메라 촬영", "앨범에서 선택", "취소"];

    showActionSheetWithOptions(
      {
        options,
      },
      (idx) => {
        if (idx === 0) takeWithCamera();
        else if (idx === 1) pickFromLibrary();
        else if (idx === 2) return;
      }
    );
  }, []);

  return (
    <View className="p-4">
      <Pressable onPress={onPress} style={styles.camera}>
        <EvilIcons name="camera" size={80} color="#666666" />
      </Pressable>
      <View style={styles.imgsContainer}>
        {imgs &&
          imgs.map((uri) => (
            <View key={uri} style={styles.imgWrap}>
              <Image source={{ uri }} style={styles.image} />
              <Pressable
                onPress={() => handleDeleted(uri)}
                style={styles.closeBtn}
              >
                <Ionicons name="close" size={20} color="#fff" />
              </Pressable>
            </View>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: "4%",
  },
  camera: {
    width: 120,
    height: 120,
    backgroundColor: "#d9d7d7",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 4,
  },
  imgsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  imgWrap: {
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    right: 4,
    top: 6,
    borderWidth: 1.5,
    borderColor: "#fff",
    borderRadius: 999,
    backgroundColor: "#00000099",
  },
});
