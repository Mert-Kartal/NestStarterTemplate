import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto, LoginDto } from './auth.dto';
import * as argon2 from 'argon2';
import { JwtService } from '../jwt/jwt.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async register(data: RegisterDto) {
    const existEmail = await this.userService.search(data.email);
    if (existEmail) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await argon2.hash(data.password);
    const user = await this.userService.add({
      ...data,
      password: hashedPassword,
    });
    const { accessToken, refreshToken } = await this.jwtService.generateToken({
      userId: user.id,
      role: user.role,
    });
    return { accessToken, refreshToken };
  }
  async login(data: LoginDto) {
    const user = await this.userService.search(data.email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const isPasswordValid = await argon2.verify(user.password, data.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }
    const { accessToken, refreshToken } = await this.jwtService.generateToken({
      userId: user.id,
      role: user.role,
    });
    return { accessToken, refreshToken };
  }
  async refresh(header: string) {
    return await this.jwtService.refresh(header);
  }
  async logout(header: string) {
    return await this.jwtService.logout(header);
  }
}
