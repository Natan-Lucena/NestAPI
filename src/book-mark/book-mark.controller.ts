import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from './../auth/guard';
import { BookMarkService } from './book-mark.service';
import { GetUser } from '../auth/decoretor';
import { CreateBookMarkDTO, EditBookMarkDTO } from './dtos';

@Controller('book-mark')
@UseGuards(JwtGuard)
export class BookMarkController {
  constructor(private bookMarksService: BookMarkService) {}
  @Post()
  createBookMark(
    @GetUser('id') userId: number,
    @Body() dto: CreateBookMarkDTO,
  ) {
    return this.bookMarksService.createBookMark(userId, dto);
  }

  @Get()
  getBookMarks(@GetUser('id') userId: number) {
    return this.bookMarksService.getBookMarks(userId);
  }

  @Get(':id')
  getBookMarkById(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookMarkId: number,
  ) {
    return this.bookMarksService.getBookMarkById(userId, bookMarkId);
  }

  @Patch(':id')
  editBookMarkById(
    @GetUser('id') userId: number,
    @Body() dto: EditBookMarkDTO,
    @Param('id', ParseIntPipe) bookMarkId: number,
  ) {
    return this.bookMarksService.editBookMarkById(userId, bookMarkId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  DeleteBookMark(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookMarkId: number,
  ) {
    return this.bookMarksService.deleteBookMark(userId, bookMarkId);
  }
}
