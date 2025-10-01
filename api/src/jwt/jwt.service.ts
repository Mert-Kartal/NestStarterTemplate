import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../shared/interface/jwt-payload';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}
  private splitToken(header: string) {
    const token = header.split(' ')[1];
    return token;
  }
  async generateToken(payload: JwtPayload) {
    const accessToken = jwt.sign(
      payload,
      this.configService.get('JWT_ACCESS_SECRET') as string,
      { expiresIn: '1h' },
    );
    const refreshTokenRecord = await this.prisma.token.create({
      data: {
        userId: payload.userId,
      },
    });
    const refreshToken = jwt.sign(
      { ...payload, jti: refreshTokenRecord.id },
      this.configService.get('JWT_REFRESH_SECRET') as string,
      { expiresIn: '7d' },
    );
    return { accessToken, refreshToken };
  }
  verifyToken(token: string, secret: string) {
    return jwt.verify(token, secret);
  }
}
