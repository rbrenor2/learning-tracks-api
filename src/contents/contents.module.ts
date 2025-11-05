import { Module } from '@nestjs/common';
import { ContentsService } from './contents.service';
import { ContentsController } from './contents.controller';
import { YoutubeModule } from 'src/youtube/youtube.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { TracksModule } from 'src/tracks/tracks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Content]),
    YoutubeModule,
    TracksModule
  ],
  controllers: [ContentsController],
  providers: [ContentsService],
})
export class ContentsModule { }
