import {
  Dimensions,
  PanResponder,
  Pressable,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import {
  Canvas,
  CanvasRef,
  Path,
  Skia,
  SkPath,
  Image as SkImage,
  useImage,
} from '@shopify/react-native-skia';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Swiper from 'react-native-web-swiper';

interface IColoredPath {
  path: SkPath;
  color: string;
}

interface IDrawingProps {
  setOpenDrawing: React.Dispatch<React.SetStateAction<boolean>>;
  canvasRef: React.RefObject<CanvasRef>;
  isOpenDrawing: boolean;
  handleCapture: () => void;
  setShowTopBar: React.Dispatch<React.SetStateAction<boolean>>;
}

const COLORS = {
  red: '#ef4444',
  yellow: '#facc15',
  orange: '#fb923c',
  green: '#15803d',
  blue: '#3b82f6',
  purple: '#a855f7',
  pink: '#ec4899',
  gray: '#78716c',
  black: '#000',
};

const BG = {
  bg1: require('@/assets/bg1.jpg'),
  bg2: require('@/assets/bg2.jpg'),
  bg3: require('@/assets/bg3.jpg'),
  bg4: require('@/assets/bg4.jpg'),
  bg5: require('@/assets/bg5.jpg'),
};

export default function Drawing({
  setOpenDrawing,
  canvasRef,
  isOpenDrawing,
  handleCapture,
  setShowTopBar,
}: IDrawingProps) {
  const currentPath = useRef<SkPath>(Skia.Path.Make());
  const currentColor = useRef<string>(COLORS.black);
  const currentTool = useRef<string>('pen');

  const [paths, setPaths] = useState<IColoredPath[]>([]);
  const [bgImage, setBgImage] = useState(null);
  const image = useImage(bgImage);
  const [, setTick] = useState(0);

  const forceRender = () => setTick(t => t + 1);

  const eraseAtPoint = (x: number, y: number) => {
    const padding = 10;

    const currentBounds = currentPath.current.getBounds();
    const currentLeft = currentBounds.x - padding;
    const currentRight = currentBounds.x + currentBounds.width + padding;
    const currentTop = currentBounds.y - padding;
    const currentBottom = currentBounds.y + currentBounds.height + padding;

    const isInCurrentPath =
      x >= currentLeft &&
      x <= currentRight &&
      y >= currentTop &&
      y <= currentBottom;

    if (isInCurrentPath) {
      currentPath.current = Skia.Path.Make();
      forceRender();
    }

    setPaths(prev =>
      prev.filter(({ path }) => {
        const bounds = path.getBounds();
        const left = bounds.x - padding;
        const right = bounds.x + bounds.width + padding;
        const top = bounds.y - padding;
        const bottom = bounds.y + bounds.height + padding;

        return !(x >= left && x <= right && y >= top && y <= bottom);
      }),
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: e => {
        const { locationX, locationY } = e.nativeEvent;

        if (currentTool.current === 'eraser') {
          eraseAtPoint(locationX, locationY);
          return;
        }

        currentPath.current = Skia.Path.Make();
        currentPath.current.moveTo(locationX, locationY);
      },
      onPanResponderMove: e => {
        const { locationX, locationY } = e.nativeEvent;

        if (currentTool.current === 'eraser') {
          eraseAtPoint(locationX, locationY);
          return;
        }

        currentPath.current.lineTo(locationX, locationY);
        forceRender();
      },
      onPanResponderRelease: () => {
        if (currentTool.current === 'eraser') return;
        setPaths(prev => [
          ...prev,
          {
            path: currentPath.current.copy(),
            color: currentColor.current,
          },
        ]);
      },
    }),
  ).current;

  const handleChangeColor = (color: string) => {
    currentColor.current = color;
    currentTool.current = 'pen';
  };

  const handleAllClear = useCallback(() => {
    setPaths([]);
    currentPath.current = Skia.Path.Make();
    forceRender();
  }, []);

  return (
    <Modal
      visible={isOpenDrawing}
      animationType="slide"
      className="items-center justify-center flex-1 bg-white"
    >
      <View {...panResponder.panHandlers}>
        <Canvas
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height - 220,
          }}
          ref={canvasRef}
        >
          <SkImage
            image={image}
            x={0}
            y={0}
            width={Dimensions.get('window').width}
            height={Dimensions.get('window').height - 220}
            fit="fill"
          />
          {paths.map((p, index) => (
            <Path
              key={`draw-${index}`}
              path={p.path}
              color={p.color}
              style="stroke"
              strokeWidth={3}
            />
          ))}
          <Path
            path={currentPath.current}
            color={currentColor.current}
            style="stroke"
            strokeWidth={3}
          />
        </Canvas>
      </View>

      <View className="w-full px-4 pt-4 border-t border-gray-300">
        <View className="flex flex-row items-end gap-x-3">
          <TouchableOpacity onPress={() => (currentTool.current = 'eraser')}>
            <Fontisto name="eraser" size={24} color="#707070" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAllClear}>
            <Text className="text-xl font-semibold text-[#707070]">AC</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setOpenDrawing(false);
              setShowTopBar(true);
              handleCapture();
            }}
          >
            <Text className="text-xl font-semibold text-blue-500">
              그리기 완료
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex flex-row items-end mt-2 gap-x-2">
          {Object.entries(COLORS).map(([key, color]) => (
            <Pressable
              key={key}
              onPress={() => handleChangeColor(color)}
              style={{ backgroundColor: color }}
              className="w-8 h-8 rounded-full"
            />
          ))}
          {/* <Pressable className="flex flex-col items-center justify-center ml-auto border-2 border-white rounded-full shadow w-14 h-14 bg-rose-400">
            <Fontisto name="plus-a" size={30} color="#fff" />
          </Pressable> */}
        </View>

        <View className="flex-row items-center mt-3 gap-x-2">
          <Swiper
            key="my"
            loop
            containerStyle={{
              width: '100%',
              height: 80,
            }}
            slideWrapperStyle={{
              width: 80,
            }}
            controlsProps={{
              prevPos: false,
              nextPos: false,
            }}
          >
            <Pressable
              onPress={() => setBgImage(null)}
              className="items-center justify-center w-20 h-20 border border-gray-300"
            >
              <Fontisto name="close-a" size={24} color="#ccc" />
            </Pressable>
            {Object.entries(BG).map(([key, value]) => (
              <Pressable
                onPress={() => setBgImage(value)}
                key={key}
                className="w-20 h-20"
              >
                <Image source={value} className="w-full h-full object-fit" />
              </Pressable>
            ))}
          </Swiper>
        </View>
      </View>
    </Modal>
  );
}
