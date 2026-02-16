// Blob 데이터 -> Base64 Data URL 변환
export const blobUrlToBase64 = async (blobUrl: string): Promise<string> => {
  const response = await fetch(blobUrl);
  if (!response.ok) {
    throw new Error(
      `Blob URL에서 데이터를 가져오지 못했습니다: ${response.statusText}`
    );
  }

  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("FileReader가 Base64 문자열을 생성하지 못했습니다."));
      }
    };

    reader.onerror = (error) => {
      reject(new Error(`FileReader 오류: ${error.target?.error}`));
    };

    reader.readAsDataURL(blob);
  });
};
