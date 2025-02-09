import { User } from '../entities/user';

export class AuthenticationRepository {
  async createUser(username: string, passwordHash: string): Promise<User> {
    throw new Error("Method not implemented.");
  }

  async getUserByUsername(username: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
}