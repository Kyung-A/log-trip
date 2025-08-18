import React, { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import DatePicker, { DatePickerProps } from "react-native-date-picker";

interface IDateField extends DatePickerProps {
  defaultLabel: string;
  valueLabel: string | null;
}

export const DateField = React.memo(
  ({
    defaultLabel,
    valueLabel,
    date,
    mode = "datetime",
    ...props
  }: IDateField) => {
    const [isOpenPicker, setOpenPicker] = useState<boolean>(false);

    return (
      <TouchableOpacity
        onPress={() => setOpenPicker(true)}
        className="flex flex-row flex-wrap items-start justify-between w-full p-4 border-b border-gray-300"
      >
        <Text className="mr-4 text-xl">{defaultLabel}</Text>
        {valueLabel && <Text className="text-xl">{valueLabel}</Text>}
        <DatePicker
          modal
          mode={mode}
          open={isOpenPicker}
          date={date || new Date()}
          locale="ko-KR"
          onConfirm={(date) => {
            setOpenPicker(false);
            if (props.onConfirm) props.onConfirm(date);
          }}
          onCancel={() => {
            setOpenPicker(false);
            if (props.onCancel) props.onCancel();
          }}
          confirmText="확인"
          cancelText="취소"
          {...props}
        />
      </TouchableOpacity>
    );
  }
);
