import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from './jwt/jwt.module';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    JwtModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
