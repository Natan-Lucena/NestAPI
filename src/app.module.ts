import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookMarkModule } from './book-mark/book-mark.module';
import { PrismaModule } from './prisma/prisma.module';
@Module({
  imports: [AuthModule, UserModule, BookMarkModule, PrismaModule],
})
export class AppModule {}
