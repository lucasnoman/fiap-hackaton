import { v4 as uuid } from 'uuid'
export const uniqueName = (prefix: string): string => `${prefix}-${uuid()}`
