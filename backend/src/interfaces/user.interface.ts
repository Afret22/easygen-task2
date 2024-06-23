import { Document } from 'mongoose';

export interface User extends Document {
  readonly email: string;
  readonly password: string;
  readonly name: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}

export interface UserTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserTokensWithEmail {
  accessToken: string;
  refreshToken: string;
  email: string;
}
