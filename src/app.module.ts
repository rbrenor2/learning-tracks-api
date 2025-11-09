import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ContentsModule } from './modules/contents/contents.module';
import { ContentTrack } from './modules/contents/entities/content-track.entity';
import { Content } from './modules/contents/entities/content.entity';
import { Track } from './modules/tracks/entities/track.entity';
import { TracksModule } from './modules/tracks/tracks.module';
import { User } from './modules/users/entities/user.entity';
import { UsersModule } from './modules/users/users.module';

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
