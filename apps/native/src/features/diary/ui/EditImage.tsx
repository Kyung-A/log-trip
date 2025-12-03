import React from 'react';
import { Pressable, View, Image, Button, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Canvas, Image as SkImage } from '@shopify/react-native-skia';

const FRAMES = {
  frame1: require('@/assets/frame/frame1.png'),
  frame2: require('@/assets/frame/frame2.png'),
  frame3: require('@/assets/frame/frame3.png'),
};

export default function EditImage({
  isOpenEditMode,
  canvasRef,
  editImage,
  frameImg,
  setFrameImage,
  handleCloseEditMode,
  handleSaveEditMode,
}) {
  return (
    <Modal visible={isOpenEditMode} animationType="slide">
      <View className="flex-col items-center flex-1 bg-black gap-y-20">
        <View className="flex-row justify-between w-full px-4 pt-24">
          <Pressable onPress={handleCloseEditMode}>
            <Ionicons name="close" size={30} color="#fff" />
          </Pressable>
          <Button title="완료" onPress={handleSaveEditMode} />
        </View>

        <Canvas
          pointerEvents="none"
          style={{
            width: 350,
            height: 350,
            overflow: 'hidden',
          }}
          ref={canvasRef}
        >
          <SkImage
            image={editImage}
            x={0}
            y={0}
            width={350}
            height={350}
            fit="cover"
          />
          <SkImage
            image={frameImg}
            x={0}
            y={0}
            width={350}
            height={350}
            fit="cover"
          />
        </Canvas>

        <View className="flex-row items-center gap-x-3">
          <Pressable
            onPress={() => setFrameImage(null)}
            className="items-center justify-center w-20 h-20 border border-white"
          >
            <Ionicons name="close" size={24} color="#fff" />
          </Pressable>
          {Object.entries(FRAMES).map(([key, value]) => (
            <Pressable
              onPress={() => setFrameImage(value)}
              key={key}
              className="block w-20 h-20"
            >
              <Image source={value} className="w-full h-full object-fit" />
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}
