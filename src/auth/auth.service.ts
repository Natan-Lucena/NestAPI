import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dtos';
import * as argon from 'argon2';

@Injectable()
export class Authservice {
  constructor(private prisma: PrismaService) {}

  async singUp({ email, password }: AuthDTO) {
    const hash = await argon.hash(password);
    const user = await this.prisma.user.create({
      data: { email, hash },
    });
    delete user.hash;
    return user;
  }
  signIn() {}
}
