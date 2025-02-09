import { Request, Response } from 'express';
import { AuthUseCase } from '../use-cases/auth-use-case'
import { UserDTO } from '../dtos/user-dto'

export class AuthController {
  private authUseCase: AuthUseCase;

  constructor() {
    this.authUseCase = new AuthUseCase();
  }

  async authenticate(req: Request, res: Response): Promise<Response> {
    try {
        const { username, password }: UserDTO = req.body; 
  
      
        const validationResult = await this.authUseCase.authenticateUser(username, password);
        
        if (!validationResult) {
          return res.status(401).json({ message: 'Invalid credentials' }); 
        }
        
        
        return res.status(200).json({ message: 'Authentication successful', token: validationResult.token });
      } catch (error: unknown) {
        
        if (error instanceof Error) {
          
          console.error('Authentication error:', error.message);
          return res.status(500).json({ message: `An error occurred: ${error.message}` });
        } else {
          
          console.error('Unknown error occurred');
          return res.status(500).json({ message: 'An unexpected error occurred' });
        }
      }
    }
  }