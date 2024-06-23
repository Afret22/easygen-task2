import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  UserTokens,
  User,
  UserTokensWithEmail,
} from 'src/interfaces/user.interface';
import { UserService } from 'src/user/user.service';
import { PasswordService } from './password.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}
  async validateUser(userId: string): Promise<User> {
    return this.userService.findOne(userId);
  }

  verifyAccessToken(token: string) {
    try {
      const out = this.jwtService.verify(token);
      return Boolean(out);
    } catch (error) {
      return false;
    }
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET || 'refresh',
      expiresIn: process.env.REFRESH_EXPIRES_IN || '7d',
    });
  }

  generateTokens(payload: { userId: string }): UserTokens {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: process.env.REFRESH_SECRET,
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async login(loginDto: LoginDto): Promise<UserTokensWithEmail> {
    const user = await this.userService.findOneByEmail(loginDto.email);

    if (!user) {
      throw new NotFoundException(`No user found for email: ${loginDto.email}`);
    }

    const passwordValid = this.passwordService.validatePassword(
      loginDto.password,
      user.password,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    return {
      ...this.generateTokens({
        userId: user.id,
      }),
      email: user.email,
    };
  }

  async signup(payload: CreateUserDto): Promise<UserTokens> {
    const hashedPasswordResult = await this.passwordService.hashPassword(
      payload.password,
    );

    // check if user already exists
    const userExists = await this.userService.findOneByEmail(payload.email);

    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    try {
      const user = await this.userService.createOne({
        email: payload.email,
        password: hashedPasswordResult.hashedPassword,
      });

      return this.generateTokens({
        userId: user.id,
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}
