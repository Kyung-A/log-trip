import axios from "axios";

export const deleteUser = async (id: string) => {
  try {
    const { data } = await axios.post(
      `${process.env.SUPABASE_API_ENDPOINT}/delete-user`,
      { id },
      {
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_API_KEY}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};
