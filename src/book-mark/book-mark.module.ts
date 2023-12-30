import { Module } from '@nestjs/common';
import { BookMarkController } from './book-mark.controller';
import { BookMarkService } from './book-mark.service';

@Module({
  controllers: [BookMarkController],
  providers: [BookMarkService]
})
export class BookMarkModule {}
