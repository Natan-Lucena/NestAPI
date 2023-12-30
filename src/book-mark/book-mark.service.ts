import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookMarkDTO, EditBookMarkDTO } from './dtos';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookMarkService {
  constructor(private prisma: PrismaService) {}
  async createBookMark(userId: number, dto: CreateBookMarkDTO) {
    const bookMark = await this.prisma.bookMark.create({
      data: { userId, ...dto },
    });
    return bookMark;
  }

  getBookMarks(userId: number) {
    return this.prisma.bookMark.findMany({ where: { userId } });
  }

  getBookMarkById(userId: number, bookMarkId: number) {
    return this.prisma.bookMark.findFirst({
      where: { id: bookMarkId, userId },
    });
  }

  async editBookMarkById(
    userId: number,
    bookMarkId: number,
    dto: EditBookMarkDTO,
  ) {
    const bookmark = await this.prisma.bookMark.findUnique({
      where: { id: bookMarkId },
    });
    if (!bookMarkId || bookmark.userId !== userId) {
      throw new ForbiddenException('Acess denied');
    }
    return this.prisma.bookMark.update({
      where: { id: bookMarkId },
      data: { ...dto },
    });
  }

  async deleteBookMark(userId: number, bookMarkId: number) {
    const bookmark = await this.prisma.bookMark.findUnique({
      where: { id: bookMarkId },
    });
    if (!bookMarkId || bookmark.userId !== userId) {
      throw new ForbiddenException('Acess denied');
    }
    await this.prisma.bookMark.delete({ where: { id: bookMarkId } });
  }
}
