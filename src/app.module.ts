import { Module } from '@nestjs/common';
import { ContentsModule } from './contents/contents.module';
import { TracksModule } from './tracks/tracks.module';
import { YoutubeModule } from './youtube/youtube.module';

@Module({
  imports: [ContentsModule, TracksModule],
})
export class AppModule { }
