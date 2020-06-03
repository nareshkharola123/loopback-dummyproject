import {securityId, UserProfile} from '@loopback/security';
import {User} from '../models';

export const convertToUserProfile = (user: User): UserProfile => {
  const userProfile = {
    [securityId]: `${user.id}`,
    name: user.name,
    id: user.id,
    // roles: user.roles,
  };

  return userProfile;
};
