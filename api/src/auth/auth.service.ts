import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RegisterDto } from './auth.dto';
import * as argon2 from 'argon2';
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async register(data: RegisterDto) {
    const existEmail = await this.userService.search(data.email);
    if (existEmail) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await argon2.hash(data.password);
    return await this.userService.add({
      ...data,
      password: hashedPassword,
    });
  }
}
