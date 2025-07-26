import axios from "axios";

export const sendSMS = async (phone: string) => {
  try {
    const { data } = await axios.post(
      `${process.env.SUPABASE_API_ENDPOINT}/send-sms`,
      { phone },
      {
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_API_KEY}`,
        },
      }
    );
    return data;
  } catch (error) {
    return error;
  }
};
