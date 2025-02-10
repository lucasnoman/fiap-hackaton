import { UserDTO } from '../../../application/authentication/dtos/user-dto';

export interface AuthenticationRepository {

  
  createUser(username: string, passwordHash: string): Promise<UserDTO>;

  getUserByUsername(username: string): Promise<UserDTO | null>;
  
  getUserById(id: string): Promise<UserDTO | null>;

  getPasswordHashByUsername(username: string): Promise<string | null>;

  validatePassword(userId: string, password: string): Promise<boolean>;

  updatePassword(userId: string, newPasswordHash: string): Promise<void>;
}
