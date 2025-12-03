import { supabase } from '@/shared';

export const resendEmail = async (email: string) => {
  try {
    const response = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};
