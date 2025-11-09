import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TracksModule } from 'src/modules/tracks/tracks.module';
import { YoutubeModule } from 'src/modules/youtube/youtube.module';
import { ContentsTracksService } from './contents-tracks.service';
import { ContentsController } from './contents.controller';
import { ContentsService } from './contents.service';
import { ContentTrack } from './entities/content-track.entity';
import { Content } from './entities/content.entity';

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
