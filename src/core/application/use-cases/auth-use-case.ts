import { compare } from 'bcryptjs'

import { UserRepository } from '@/domain/repositories/user-repository'

import { TokenGenerator } from '../ports/token-generator'

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials')
  }
}

interface AuthUseCaseRequest {
  email: string
  password: string
}

interface AuthUseCaseResponse {
  token: string
  user: {
    id: number
    email: string
  }
}

export class AuthUseCase {
  constructor(
    private userRepository: UserRepository,
    private tokenGenerator: TokenGenerator,
  ) {}

  async execute({
    email,
    password,
  }: AuthUseCaseRequest): Promise<AuthUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatch = await compare(password, user.password)

    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError()
    }

    const token = await this.tokenGenerator.generate({
      sub: user.id!,
      email: user.email,
    })

    return {
      token,
      user: {
        id: user.id!,
        email: user.email,
      },
    }
  }
}
