"use server";

export const deleteUser = async (id?: string, platform?: string) => {
  try {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_API_ENDPOINT}/delete-user`,
      {
        method: "POST",
        body: JSON.stringify({ id, platform }),
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_API_KEY}`,
        },
      },
    );

    if (!resp.ok) throw new Error("삭제 실패");
    return await resp.json();
  } catch (error) {
    throw error;
  }
};
