import {HttpErrors} from '@loopback/rest';
import isemail from 'isemail';

interface Credentials {
  email: string;
  password: string;
}

export const validateUser = (user: Credentials): void => {
  if (!isemail.validate(user.email)) {
    throw new HttpErrors.UnprocessableEntity('Invalid Email!');
  }

  if (!user.password || user.password.length < 6) {
    throw new HttpErrors.UnprocessableEntity(
      'Password Must Be Min. Of 6 Chars!',
    );
  }
};
