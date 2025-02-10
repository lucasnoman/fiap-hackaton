import { User } from '@/domain/entities/user'
import { UserRepository } from '@/domain/repositories/user-repository'

import { prisma } from '../config/prisma'

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return null
    }

    return new User(user)
  }

  async create(user: User): Promise<User> {
    const data = {
      email: user.email,
      password: user.password,
    }

    const createdUser = await prisma.user.create({
      data,
    })

    return new User(createdUser)
  }
}
