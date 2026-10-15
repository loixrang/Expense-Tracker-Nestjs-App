import { SetMetadata } from '@nestjs/common';
import { ROLES } from '../auth/roles/role.enum.js';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: ROLES[]) => SetMetadata(ROLES_KEY, roles);
