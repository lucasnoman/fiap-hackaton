export class User {
  id: string;
  username: string;
  email: string;
  passwordHash: string; 

  constructor(id: string, username: string, email: string, passwordHash: string) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash; 
  }
}