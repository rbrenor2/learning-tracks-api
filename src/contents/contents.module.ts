import { Module } from '@nestjs/common';
import { ContentsService } from './contents.service';
import { ContentsController } from './contents.controller';
import { YoutubeModule } from 'src/youtube/youtube.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Content]),
    YoutubeModule
  ],
  controllers: [ContentsController],
  providers: [ContentsService],
})
export class ContentsModule { }
