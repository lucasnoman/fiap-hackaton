import { AuthenticationRepository } from '../../../core/domain/authentication/ports/auth-port';
import { User } from '../../../core/domain/authentication/entities/user';

const usersDb: User[] = [];

export class UserRepository extends AuthenticationRepository {
  async createUser(username: string, passwordHash: string): Promise<User> {
    // Verificando se o username ou o passwordHash estão vazios ou inválidos
    if (!username || !passwordHash) {
      throw new Error('Invalid data: username and passwordHash are required.');
    }
    
    // Usando um valor fictício para o email (substitua conforme necessário)
    const email = `${username}@example.com`;
    
    // Criando o usuário com todos os 4 parâmetros
    const user = new User(Date.now().toString(), username, email, passwordHash);
    
    usersDb.push(user);
    return user;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    return usersDb.find(user => user.username === username) || null;
  }

  async validatePassword(username: string, password: string): Promise<boolean> {
    const user = await this.getUserByUsername(username);
    return user ? user.passwordHash === password : false;
  }
}