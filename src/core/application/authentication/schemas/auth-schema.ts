import { IsString, IsNotEmpty, MinLength, MaxLength, Matches, validate } from 'class-validator';

class AuthSchema {
  username: string;
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}


async function validateAuthInput(input: AuthSchema) {
  const errors: string[] = [];

  
  if (!input.username || input.username.length < 3 || input.username.length > 50) {
    errors.push('Username must be between 3 and 50 characters');
  }

  
  if (!input.password || input.password.length < 6 || !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/.test(input.password)) {
    errors.push('Password must be at least 6 characters and contain at least one letter and one number');
  }

  
  const validationErrors = await validate(input);
  validationErrors.forEach(error => errors.push(error.toString()));

  if (errors.length > 0) {
    throw new Error(errors.join(', '));
  }

  return true;
}


(async () => {
  const input = new AuthSchema('user123', 'password123');

  try {
    await validateAuthInput(input);
    console.log('Validation passed!');
  } catch (err) {
    console.error('Validation failed:', err);
  }
})();