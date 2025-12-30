"use client";

import { useFetchUserId, useFetchUserProfile } from "@/features/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Image from "next/image";
import { Camera, ChevronLeft, UserRound, X } from "lucide-react";
import {
  blobUrlToBase64,
  getImageUrl,
  imageUpload,
  navigateNative,
  supabase,
} from "@/shared";
import { v4 as uuidv4 } from "uuid";

export const ProfileUpdateClient = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qc = useQueryClient();

  const { data: userId } = useFetchUserId();
  const { data: profile } = useFetchUserProfile(userId);
  const { control, handleSubmit } = useForm({ defaultValues: profile });

  const [profileImg, setProfileImg] = useState<string | null>(null);

  const handleDeleted = useCallback(() => setProfileImg(null), []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files;

      if (!file || file.length === 0) return;

      const newImages = URL.createObjectURL(file[0]);

      setProfileImg(newImages);
      event.target.value = "";
    },
    []
  );

  const uploadAndGetUrlImage = async () => {
    if (!profileImg) return null;

    const path = `profiles/${userId}/${uuidv4()}.jpg`;

    const base64DataUrl = await blobUrlToBase64(profileImg);
    const buffer = Buffer.from(base64DataUrl, "base64");

    await supabase.storage.from("log-trip-images").remove([path]);
    await imageUpload("log-trip-images", path, buffer);
    const result = getImageUrl("log-trip-images", path);

    return result.publicUrl;
  };

  const handleSaveProfile = async (formData: {
    nickname: string | null;
    about: string | null;
    profile_image: string | null;
  }) => {
    try {
      const imageUrl = profileImg?.includes("blob:")
        ? profileImg
        : await uploadAndGetUrlImage();

      const data = {
        ...formData,
        profile_image: imageUrl,
      };

      const response = await supabase
        .from("users")
        .update(data)
        .eq("id", userId)
        .select();

      if (response.status === 200) {
        qc.invalidateQueries({
          queryKey: ["profile"],
          refetchType: "active",
          exact: true,
        });
        navigateNative("/mypage");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (profile?.profile_image) {
      requestAnimationFrame(() => {
        setProfileImg(profile.profile_image);
      });
    }
  }, [profile?.profile_image]);

  return (
    <>
      <header className="bg-white max-w-3xl fixed w-full py-2 border-b border-gray-200 flex items-center justify-between px-4">
        <button
          onClick={() => navigateNative("/mypage", "WINDOW_LOCATION")}
          className="flex items-center gap-x-1"
        >
          <ChevronLeft size={22} color="#646464" />
          <span className="text-lg">뒤로</span>
        </button>
        <button
          type="submit"
          className="text-lg text-blue-500"
          onClick={handleSubmit(handleSaveProfile)}
        >
          완료
        </button>
      </header>

      <main className="items-center flex flex-col w-full min-h-screen">
        <div className="relative w-32 h-32 mt-40 bg-[#d5b2a7] rounded-full">
          {profileImg ? (
            <button
              onClick={handleDeleted}
              className="absolute right-0 top-0 bg-[#cdc6c3] rounded-full w-10 h-10 flex items-center justify-center"
            >
              <X size={26} color="#fff" />
            </button>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-0 top-0 bg-[#cdc6c3] rounded-full w-10 h-10 flex items-center justify-center"
            >
              <Camera size={24} color="#fff" />
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          {profileImg ? (
            <Image
              src={profileImg}
              width={0}
              height={0}
              sizes="100vw"
              alt="profile image"
              className="object-cover w-full h-full rounded-full"
            />
          ) : (
            <div className="items-center flex justify-center w-full h-full">
              <UserRound size={60} color="#fff" />
            </div>
          )}
        </div>
        <Controller
          control={control}
          name="nickname"
          render={({ field: { onChange, value } }) => (
            <input
              className="w-40 mt-6 text-xl font-semibold text-center outline-0"
              placeholder="이름을 작성해주세요"
              onChange={onChange}
              value={value}
            />
          )}
        />
        <Controller
          control={control}
          name="about"
          render={({ field: { onChange, value } }) => (
            <input
              className="w-64 mt-4 text-center outline-0"
              placeholder="소개를 작성해주세요"
              onChange={onChange}
              value={value ?? ""}
              maxLength={30}
            />
          )}
        />
      </main>
    </>
  );
};
