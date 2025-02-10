import bcrypt from 'bcryptjs';
import { UserDTO } from '@/core/application/authentication/dtos/user-dto';
import { v4 as uuidv4 } from 'uuid'; 

export class User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;

  constructor(id: string, username: string, email: string, passwordHash: string) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
  }


  static createFromDTO(userDto: UserDTO, passwordHash: string): User {
    return new User(
      uuidv4(), 
      userDto.username,
      userDto.email,
      passwordHash
    );
  }

  
  async isPasswordValid(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash); 
  }

  
  clearSensitiveData(): void {
    this.passwordHash = '';
  }
}

