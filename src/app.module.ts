import { Module } from '@nestjs/common';
import { ContentsModule } from './contents/contents.module';
import { TracksModule } from './tracks/tracks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ContentTrack } from './contents/entities/content-track.entity';
import { Content } from './contents/entities/content.entity';
import { Track } from './tracks/entities/track.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [ContentsModule, TracksModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [Content, Track, ContentTrack, User],
      synchronize: true,
      ssl: false,
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule { }
