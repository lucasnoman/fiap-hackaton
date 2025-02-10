// src/core/application/authentication/routes/auth-routes.ts

import { Router, Request, Response } from 'express';
import { AuthController } from '@/core/application/authentication/controllers/auth-controller'
import { AuthUseCase } from '@/core/application/authentication/use-cases/auth-use-case'
import { UserRepository } from '../../../../infra/adapter/output/auth-repository'


const userRepository = new UserRepository();

const authUseCase = new AuthUseCase(userRepository);

const authController = new AuthController(authUseCase);

const authRouter = Router();


authRouter.post('/authenticate', async (req: Request, res: Response) => {
	try {
		await authController.authenticate(req, res);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).send('An unknown error occurred');
		}
	}
});


export default authRouter;
