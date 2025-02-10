  import { User } from '@/core/domain/authentication/entities/user';  // Ajuste o caminho conforme necessário

  export class UserDTO {
    id: string;
    username: string;
    email: string;
    password: string; // Agora o campo password é usado no DTO
  
    constructor(id: string, username: string, email: string, password: string) {
      this.id = id;
      this.username = username;
      this.email = email;
      this.password = password;  // Agora o campo 'password' é que está presente
    }
  
    // Método para converter UserDTO em uma instância de User
    toDomain(passwordHash: string): User {
      return new User(
        this.id,
        this.username,
        this.email,
        passwordHash  // Passando o passwordHash para o User
      );
    }
  
    // Método para validar os dados do DTO
    validate(): string[] {
      const errors: string[] = [];
  
      if (!this.username || this.username.length < 3) {
        errors.push('Username must be at least 3 characters long');
      }
  
      if (!this.email || !this.email.includes('@')) {
        errors.push('Invalid email format');
      }
  
      if (!this.password || this.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
      }
  
      return errors;
    }
  }