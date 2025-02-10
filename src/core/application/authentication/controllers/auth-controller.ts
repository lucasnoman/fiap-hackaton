import { Request, Response } from 'express';
import { AuthUseCase } from '../use-cases/auth-use-case';


export class AuthController {
  constructor(private readonly authUseCase: AuthUseCase) {}

  async authenticate(req: Request, res: Response): Promise<void> {
    
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const { userId, oldPassword, newPassword } = req.body;
      await this.authUseCase.changePassword(userId, oldPassword, newPassword);
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'An unknown error occurred' });
      }
    }
  }
}

