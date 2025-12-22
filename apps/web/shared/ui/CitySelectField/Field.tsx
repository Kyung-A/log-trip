import { Controller } from "react-hook-form";

export const Field = ({ onOpen, value, fieldName, control }) => {
  return (
    <>
      <button
        onClick={onOpen}
        className="flex flex-wrap items-start justify-between w-full px-4 py-3 border-b border-gray-300"
      >
        <p className="mr-4 text-lg pt-0.5">도시 선택</p>
        <div className="flex flex-wrap flex-1 gap-2">
          {value?.map((v) => (
            <p
              key={v.region_code}
              className="p-2 rounded bg-[#ebebeb] font-semibold"
            >
              {v.region_name}
            </p>
          ))}
        </div>
      </button>

      <Controller
        name={fieldName}
        control={control}
        rules={{
          validate: (v) => v.length > 0 || "도시를 선택해주세요",
        }}
        render={() => <></>}
      />
    </>
  );
};
