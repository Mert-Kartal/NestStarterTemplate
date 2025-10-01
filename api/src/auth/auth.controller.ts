import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() data: RegisterDto) {
    return await this.authService.register(data);
  }
  @Post('login')
  async login(@Body() data: LoginDto) {
    return await this.authService.login(data);
  }
}
