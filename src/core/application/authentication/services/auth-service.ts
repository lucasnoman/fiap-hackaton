import { UserRepository } from '@/infra/adapter/output/auth-repository'; 
import { User } from '@/core/domain/authentication/entities/user'; 
import { AuthenticationRepository } from '@/core/domain/authentication/ports/auth-port'; 


const userRepository: AuthenticationRepository = new UserRepository();

export class AuthService {
  
  async authenticate(username: string, password: string): Promise<User | null> {
    const user = await userRepository.getUserByUsername(username);

    if (!user) {
      throw new Error('User not found');
    }

    
    return user;
  }

  
  async createUser(username: string, password: string): Promise<User> {
    
    const passwordHash = password; 
    const newUser = await userRepository.createUser(username, passwordHash);
    return newUser;
  }
}