import axios from "axios";

interface IProps {
  phone: string;
  code: string;
}

export const verifyCode = async (data: IProps) => {
  try {
    const response = await axios.post(
      `${process.env.SUPABASE_API_ENDPOINT}/verify-code`,
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_API_KEY}`,
        },
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};
