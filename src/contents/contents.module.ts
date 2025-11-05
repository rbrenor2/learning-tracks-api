import { Module } from '@nestjs/common';
import { ContentsService } from './contents.service';
import { ContentsController } from './contents.controller';
import { YoutubeModule } from 'src/youtube/youtube.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { TracksModule } from 'src/tracks/tracks.module';
import { ContentsTracksService } from './contents-tracks.service';
import { ContentTrack } from './entities/content-track.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Content]),
    TypeOrmModule.forFeature([ContentTrack]),
    YoutubeModule,
    TracksModule
  ],
  controllers: [ContentsController],
  providers: [ContentsService, ContentsTracksService],
})
export class ContentsModule { }
