import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import DatePicker, { DatePickerProps } from 'react-native-date-picker';

interface IDateField extends DatePickerProps {
  defaultLabel: string;
  valueLabel: string | null;
}

export const DateField = React.memo(
  ({
    defaultLabel,
    valueLabel,
    date,
    onConfirm,
    onCancel,
    mode = 'datetime',
    ...props
  }: IDateField) => {
    const [isOpenPicker, setOpenPicker] = useState<boolean>(false);

    return (
      <>
        <TouchableOpacity
          onPress={() => setOpenPicker(true)}
          className="flex flex-row flex-wrap items-start justify-between w-full px-4 py-3 border-b border-gray-300"
        >
          <Text className="mr-4 text-lg">{defaultLabel}</Text>
          {valueLabel && (
            <Text className="text-lg text-gray-500">{valueLabel}</Text>
          )}
        </TouchableOpacity>

        <DatePicker
          {...props}
          modal
          mode={mode}
          open={isOpenPicker}
          date={date || new Date()}
          locale="ko-KR"
          onConfirm={date => {
            setOpenPicker(false);
            onConfirm?.(date);
          }}
          onCancel={() => {
            setOpenPicker(false);
            onCancel?.();
          }}
          confirmText="확인"
          cancelText="취소"
        />
      </>
    );
  },
);
