import { AuthController } from '@/core/application/authentication/controllers/auth-controller';
import { AuthUseCase } from '@/core/application/authentication/use-cases/auth-use-case';
import { Request, Response } from 'express';
import { vi, expect, describe, it, beforeEach } from 'vitest';

describe('AuthController', () => {
  let authController: AuthController;
  let authUseCase: AuthUseCase;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    authUseCase = {
      changePassword: vi.fn(), 
    } as unknown as AuthUseCase;

    authController = new AuthController(authUseCase);

    req = {
      body: { userId: '1', oldPassword: 'oldPass123', newPassword: 'newPass123' },
    };

    res = {
      status: vi.fn().mockReturnThis(), 
      json: vi.fn(), 
    };
  });

  it('should return 200 with success message when password is changed', async () => {
    authUseCase.changePassword = vi.fn().mockResolvedValue(undefined); 

    await authController.changePassword(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200); 
    expect(res.json).toHaveBeenCalledWith({ message: 'Password changed successfully' }); 
  });

  it('should return 400 with error message when password change fails due to incorrect old password', async () => {
    const error = new Error('Incorrect old password');
    authUseCase.changePassword = vi.fn().mockRejectedValue(error); 

    await authController.changePassword(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400); 
    expect(res.json).toHaveBeenCalledWith({ message: 'Incorrect old password' }); 
  });

  it('should return 400 with generic error message for unknown errors', async () => {
    const error = new Error('An unknown error occurred');
    authUseCase.changePassword = vi.fn().mockRejectedValue(error); 

    await authController.changePassword(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400); 
    expect(res.json).toHaveBeenCalledWith({ message: 'An unknown error occurred' }); 
  });
});