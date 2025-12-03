import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetProps,
} from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface IBottomSheetField extends BottomSheetProps {
  children: React.ReactNode;
  label: string;
  value: string;
  handleChange?: () => void;
}

export const BottomSheetField = React.memo(
  ({ children, handleChange, label, value, ...props }: IBottomSheetField) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    return (
      <>
        <TouchableOpacity
          onPress={() => bottomSheetRef.current?.present()}
          className="flex-row flex-wrap justify-between w-full px-4 py-3 border-b border-gray-300"
        >
          <Text className="mr-4 text-lg">{label}</Text>
          {value && <Text className="text-lg text-gray-500">{value}</Text>}
        </TouchableOpacity>

        <BottomSheetModal
          index={0}
          ref={bottomSheetRef}
          snapPoints={props.snapPoints}
          onChange={props.onChange}
          enablePanDownToClose={true}
          enableDynamicSizing={false}
          backdropComponent={props => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
            />
          )}
        >
          {children}
        </BottomSheetModal>
      </>
    );
  },
);
