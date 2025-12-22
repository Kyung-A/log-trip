import { Controller } from "react-hook-form";
import Image from "next/image";

export const ContentEditor = ({
  isDrawing,
  capturedDrawingImage,
  imageSize,
  control,
}) => {
  return (
    <>
      {!isDrawing ? (
        <div className="p-4">
          <Controller
            control={control}
            name="title"
            rules={{
              ...(!isDrawing && { required: "제목은 필수입니다." }),
            }}
            render={({ field: { value, onChange } }) => (
              <input
                className="text-xl font-semibold w-full outline-0"
                placeholder="제목을 작성해주세요"
                onChange={onChange}
                value={value ?? ""}
              />
            )}
          />

          <Controller
            control={control}
            name="text_content"
            rules={{
              ...(!isDrawing && { required: "내용은 필수입니다." }),
            }}
            render={({ field: { value, onChange } }) => (
              <textarea
                className="pb-10 mt-4 text-lg min-h-56 w-full resize-none outline-0"
                placeholder="내용을 작성해주세요"
                onChange={onChange}
                value={value ?? ""}
              />
            )}
          />
        </div>
      ) : (
        capturedDrawingImage && (
          <Image
            src={capturedDrawingImage}
            width={imageSize.width}
            height={imageSize.height}
            className="w-full h-auto"
            sizes="100vw"
            alt="drawing image"
            style={{
              objectFit: "contain",
              width: "100%",
              height: "auto",
            }}
          />
        )
      )}
    </>
  );
};
