export interface TokenPayload {
  sub: number
  email: string
}

export interface TokenGenerator {
  generate(payload: TokenPayload): Promise<string>
}
