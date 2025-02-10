import { AuthenticationRepository } from '@/core/domain/authentication/ports/auth-port';
import { User } from '@/core/domain/authentication/entities/user';
import { UserDTO } from '@/core/application/authentication/dtos/user-dto';
import bcrypt from 'bcrypt';

const usersDb: User[] = []; 

export class UserRepository implements AuthenticationRepository {
 
  async createUser(username: string, passwordHash: string): Promise<UserDTO> {
    if (!username || !passwordHash) {
      throw new Error('Invalid data: username and passwordHash are required.');
    }

    const existingUser = usersDb.find(user => user.username === username);
    if (existingUser) {
      throw new Error('User already exists.');
    }

    const email = `${username}@example.com`;
    const user = new User(Date.now().toString(), username, email, passwordHash); 
    usersDb.push(user);
    
    
    return new UserDTO(user.id, user.username, user.email, '');
  }

  
  async getUserByUsername(username: string): Promise<UserDTO | null> {
    const user = usersDb.find(user => user.username === username);
    if (!user) {
      return null;
    }

    
    return new UserDTO(user.id, user.username, user.email, '');
  }


  async getUserById(id: string): Promise<UserDTO | null> {
    const user = usersDb.find(user => user.id === id);
    if (!user) {
      return null;
    }

    
    return new UserDTO(user.id, user.username, user.email, '');
  }

  
  async validatePassword(userId: string, password: string): Promise<boolean> {
    const userDto = await this.getUserById(userId);
    if (!userDto) {
      throw new Error('User not found.');
    }

    
    const user = usersDb.find(u => u.id === userDto.id);
    if (!user) {
      throw new Error('User not found.');
    }

    return bcrypt.compare(password, user.passwordHash); 
  }

  
  async deleteUser(userId: string): Promise<void> {
    const userIndex = usersDb.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found.');
    }
    usersDb.splice(userIndex, 1);
  }

  
  async getPasswordHashByUsername(username: string): Promise<string | null> {
    const user = usersDb.find(user => user.username === username);
    if (!user) {
      return null;
    }

    return user.passwordHash; 
  }

  
  async updatePassword(userId: string, newPasswordHash: string): Promise<void> {
    const user = usersDb.find(user => user.id === userId);
    if (!user) {
      throw new Error('User not found.');
    }

    user.passwordHash = newPasswordHash; 
  }
}
