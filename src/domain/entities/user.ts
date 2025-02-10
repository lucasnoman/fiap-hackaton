export interface UserProps {
  id?: number
  email: string
  password: string
  createdAt?: Date
  updatedAt?: Date
}

export class User {
  private props: Required<UserProps>

  constructor(props: UserProps) {
    if (!props.email) {
      throw new Error('Email is required')
    }

    if (!props.password) {
      throw new Error('Password is required')
    }

    this.props = {
      id: props.id ?? 0,
      email: props.email,
      password: props.password,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    }
  }

  get id() {
    return this.props.id
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
