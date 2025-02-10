import { UserDTO } from '@/core/application/authentication/dtos/user-dto';
import { AuthenticationRepository } from '@/core/domain/authentication/ports/auth-port';
import bcrypt from 'bcrypt';

export class AuthUseCase {
  constructor(private userRepository: AuthenticationRepository) {}
  
    async authenticateUser(username: string, password: string): Promise<{ token: string } | null> {
      
      return { token: 'dummy-token' }; 
    }

  
  async createUser(username: string, password: string): Promise<UserDTO> {
    const passwordHash = await bcrypt.hash(password, 10);
    return this.userRepository.createUser(username, passwordHash);
  }

  
  async login(username: string, password: string): Promise<UserDTO | null> {
    const userDto = await this.userRepository.getUserByUsername(username);
    if (!userDto) {
      throw new Error('User not found.');
    }

    const storedPasswordHash = await this.userRepository.getPasswordHashByUsername(username);
    if (!storedPasswordHash) {
      throw new Error('Password hash not found.');
    }

    const isValidPassword = await bcrypt.compare(password, storedPasswordHash);
    if (!isValidPassword) {
      throw new Error('Invalid password.');
    }

    return userDto;
  }


  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
   
    const isValidPassword = await this.userRepository.validatePassword(userId, oldPassword);
    if (!isValidPassword) {
      throw new Error('Invalid old password.');
    }

  
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    
    await this.userRepository.updatePassword(userId, newPasswordHash);
  }
}
