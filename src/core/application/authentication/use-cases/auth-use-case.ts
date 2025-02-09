import { User } from '@/core/domain/authentication/entities/user'; 

export interface AuthResponse {
  token: string;
  user: User;
}

export class AuthUseCase {


  async authenticateUser(username: string, password: string): Promise<AuthResponse | null> {
    const user = await this.findUserByUsernameAndPassword(username, password);

    if (!user) {
      return null; 
    }

    const token = this.generateToken(user);

    return { token, user };
  }

  private findUserByUsernameAndPassword(username: string, password: string): User | null {
    const user = new User('1', username, 'user@example.com', 'hashedPassword');
    
    if (user.passwordHash === 'hashedPassword') {
      return user;
    }

    return null;
  }

  private generateToken(user: User): string {
    return `fake-token-for-${user.username}`;
  }
}