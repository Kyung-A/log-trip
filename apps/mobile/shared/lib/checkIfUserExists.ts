import { getUserProfile } from "../api/getUserProfile";

export const checkIfUserExists = async (id: string) => {
  const data = await getUserProfile(id);
  return data ? true : false;
};
