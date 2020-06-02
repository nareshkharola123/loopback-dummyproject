import {securityId, UserProfile} from '@loopback/security';
import {User} from '../models';

export const convertToUserProfile = (user: User): UserProfile => {
  // since first name and lastName are optional, no error is thrown if not provided

  const userProfile = {
    [securityId]: `${user.id}`,
    name: user.name,
    id: user.id,
    // roles: user.roles,
  };

  return userProfile;
};
