import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetProps,
} from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { TouchableOpacity, Text } from "react-native";

interface IBottomSheetField extends BottomSheetProps {
  children: React.ReactNode;
  label: string;
  value: string;
  handleChange: () => void;
}

export const BottomSheetField = React.memo(
  ({ children, handleChange, label, value, ...props }: IBottomSheetField) => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    return (
      <>
        <TouchableOpacity
          onPress={() => bottomSheetRef.current?.expand()}
          className="flex flex-row flex-wrap items-start justify-between w-full p-4 border-b border-gray-300"
        >
          <Text className="mr-4 text-xl">{label}</Text>
          {value && <Text className="text-xl">{value}</Text>}
        </TouchableOpacity>

        <BottomSheet
          index={-1}
          snapPoints={props.snapPoints}
          ref={bottomSheetRef}
          onChange={props.onChange}
          enablePanDownToClose={true}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
            />
          )}
        >
          {children}
        </BottomSheet>
      </>
    );
  }
);
