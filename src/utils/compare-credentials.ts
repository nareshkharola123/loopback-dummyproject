import {compare} from 'bcryptjs';

export const compareCredentials = async (
  storedPass: string,
  providedPass: string,
): Promise<boolean> => {
  console.log('store', storedPass);
  console.log('provid', providedPass);

  return compare(storedPass, providedPass);
};
