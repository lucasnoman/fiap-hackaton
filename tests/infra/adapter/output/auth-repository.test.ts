import { describe, it, expect, beforeEach } from 'vitest';
import { UserRepository } from '../../../../src/infra/adapter/output/auth-repository';
import { User } from '../../../../src/core/domain/authentication/entities/user';

describe('AuthRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
  });

  it('should create a new user successfully', async () => {
    const username = 'testUser';
    const passwordHash = 'hashedPassword123';

    const user = await userRepository.createUser(username, passwordHash);

    expect(user).toBeInstanceOf(User);
    expect(user.username).toBe(username);
    expect(user.passwordHash).toBe(passwordHash);
  });

  it('should retrieve a user by username', async () => {
    const username = 'testUser';
    const passwordHash = 'hashedPassword123';
    await userRepository.createUser(username, passwordHash);

    const foundUser = await userRepository.getUserByUsername(username);

    expect(foundUser).not.toBeNull();
    if (foundUser) {
      expect(foundUser.username).toBe(username);
      expect(foundUser.passwordHash).toBe(passwordHash);
    }
  });

  it('should return null if user is not found', async () => {
    const username = 'nonExistentUser';

    const foundUser = await userRepository.getUserByUsername(username);

    expect(foundUser).toBeNull();
  });

  it('should throw an error when creating a user with invalid data', async () => {
    await expect(userRepository.createUser('', 'hashedPassword123')).rejects.toThrowError();
    await expect(userRepository.createUser('testUser', '')).rejects.toThrowError();
  });

  it('should return null when trying to get a non-existent user', async () => {
    const foundUser = await userRepository.getUserByUsername('nonExistentUser');
    expect(foundUser).toBeNull();
  });

  it('should validate user password correctly', async () => {
    const username = 'testUser';
    const passwordHash = 'hashedPassword123';
    const user = await userRepository.createUser(username, passwordHash);

    const isPasswordValid = await userRepository.validatePassword(user.username, 'hashedPassword123');
    expect(isPasswordValid).toBe(true);

    const isPasswordInvalid = await userRepository.validatePassword(user.username, 'wrongPassword');
    expect(isPasswordInvalid).toBe(false);
  });

});