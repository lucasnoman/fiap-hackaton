import { describe, it, expect } from 'vitest';
import { User } from '@/core/domain/authentication/entities/user';

describe('User Entity', () => {
  it('should create a user with valid properties', () => {
    const user = new User('1', 'exampleUser', 'user@example.com', 'hashedPassword');
    
    
    expect(user).toBeDefined();
    expect(user.id).toBe('1');
    expect(user.username).toBe('exampleUser');
    expect(user.email).toBe('user@example.com');
    expect(user.passwordHash).toBe('hashedPassword');
  });

  it('should throw an error if missing required properties', () => {
    
    try {
      new User('', '', '', '');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should correctly compare user instances by id', () => {
    const user1 = new User('1', 'exampleUser', 'user@example.com', 'hashedPassword');
    const user2 = new User('1', 'exampleUser2', 'user2@example.com', 'hashedPassword');
    
    
    expect(user1.id).toBe(user2.id); 
  });
});