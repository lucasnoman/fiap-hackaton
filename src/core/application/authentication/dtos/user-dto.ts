import { validateSync } from 'class-validator';

export class UserDTO {
  username: string;
  password: string;
  email: string;

  constructor(username: string, password: string, email: string) {
    this.username = username;
    this.password = password;
    this.email = email;
  }
}


function validateUser(dto: UserDTO) {
  const errors = validateSync(dto);
  if (errors.length > 0) {
    errors.forEach(error => {
      console.log('Validation failed. Errors: ', error.constraints);
    });
  } else {
    console.log('Validation succeeded');
  }
}


const userDto = new UserDTO('exampleUser', 'examplePassword', 'user@example.com');
validateUser(userDto);