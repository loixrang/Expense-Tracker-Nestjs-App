import 'express';
import { ROLES } from '../auth/roles/role.enum.ts';
export interface AuthUser {
  id: number,
  role: ROLES
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
