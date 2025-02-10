import bcrypt from 'bcrypt';
import { describe, it, expect, beforeAll } from 'vitest';

// Função auxiliar para gerar hash
const saltRounds = 10;

describe('Criptografia de Senha', () => {
  let plainPassword: string;
  let hashedPassword: string;

  beforeAll(async () => {
    // Senha de exemplo para testar
    plainPassword = 'senhaSecreta123';
    
    // Criptografa a senha com bcrypt
    hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  });

  it('deve criptografar a senha corretamente', async () => {
    // Verifica que a senha criptografada não é igual à senha simples
    expect(plainPassword).not.toBe(hashedPassword);
  });

  it('deve comparar a senha simples com a criptografada', async () => {
    // Verifica se a senha simples corresponde ao hash gerado
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    expect(isMatch).toBe(true);
  });

  it('não deve comparar uma senha incorreta com a criptografada', async () => {
    // Verifica que uma senha errada não corresponde ao hash
    const isMatch = await bcrypt.compare('senhaErrada', hashedPassword);
    expect(isMatch).toBe(false);
  });
});
