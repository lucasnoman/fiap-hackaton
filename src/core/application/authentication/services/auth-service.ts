import { UserRepository } from '@/infra/adapter/output/auth-repository';
import { User } from '@/core/domain/authentication/entities/user';
import bcrypt from 'bcryptjs';
import { UserDTO } from '@/core/application/authentication/dtos/user-dto';
import jwt from 'jsonwebtoken';


export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async authenticate(username: string, password: string): Promise<{ token: string } | null> {
    const userDTO = await this.userRepository.getUserByUsername(username);

    if (!userDTO) {
      throw new Error('User not found');
    }

    const user = new User(userDTO.id, userDTO.username, userDTO.email, userDTO.password); 

    const isPasswordValid = await user.isPasswordValid(password); 
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

   
    user.clearSensitiveData();

   
    const token = this.generateToken(user);

    return { token }; 
  }

  
  private generateToken(user: User): string {
    const expirationTime = process.env.JWT_EXPIRATION_TIME; 

    
    if (!expirationTime || isNaN(Number(expirationTime))) {
      throw new Error('Invalid expiration time in environment variables');
    }

    

    const secretKey = process.env.JWT_SECRET_KEY;

    if (!secretKey) {
      throw new Error('JWT secret key is not defined in environment variables');
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      secretKey,
      {
        expiresIn: Number(expirationTime), 
      }
    );

    return token;
  }


  async createUser(userDTO: UserDTO): Promise<UserDTO> {
    
    const validationErrors = userDTO.validate();
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }

    
    const passwordHash = await bcrypt.hash(userDTO.password, 10);

    
    const user = User.createFromDTO(userDTO, passwordHash);

    
    await this.userRepository.createUser(userDTO.username, passwordHash); 

    
    return new UserDTO(user.id, user.username, user.email, ''); 
  }

  
  async deleteUser(userId: string): Promise<void> {
    await this.userRepository.deleteUser(userId);
  }

  
}