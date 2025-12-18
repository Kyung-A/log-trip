import { getUserProfile } from "../api";

export const checkIfUserExists = async (id: string) => {
  const data = await getUserProfile(id);
  return data ? true : false;
};
