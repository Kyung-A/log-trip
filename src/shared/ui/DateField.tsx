import React from "react";

const DateField = React.memo(() => {
  return (
    <Pressable
      onPress={() => setOpenDateModal(true)}
      className="flex flex-row flex-wrap items-start justify-between w-full p-4 border-b border-gray-300"
    >
      <Text className="mr-4 text-xl">모집 마감일</Text>
      {date && (
        <Text className="text-xl">
          {dayjs(date).format("YYYY-MM-DD hh:mm")}
        </Text>
      )}
      <DatePicker
        modal
        mode="datetime"
        open={openDateModal}
        date={date || new Date()}
        locale="ko-KR"
        onConfirm={(date) => {
          setOpenDateModal(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpenDateModal(false);
        }}
      />
    </Pressable>
  );
});
