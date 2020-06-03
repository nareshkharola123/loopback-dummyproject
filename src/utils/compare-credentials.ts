import {compare} from 'bcryptjs';

export const compareCredentials = async (
  storedPass: string,
  providedPass: string,
): Promise<boolean> => {
  return compare(storedPass, providedPass);
};
