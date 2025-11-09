import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { ContentTrack } from '../modules/contents/entities/content-track.entity';
import { Content } from '../modules/contents/entities/content.entity';
import { Track } from '../modules/tracks/entities/track.entity';
import { User } from '../modules/users/entities/user.entity';

// Service
import { DatabaseSeederService } from './database-seeder.service';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [Content, Track, ContentTrack, User],
            synchronize: true,
            ssl: false,
        }),
        TypeOrmModule.forFeature([User, Track, Content, ContentTrack]),
    ],
    providers: [DatabaseSeederService],
    exports: [DatabaseSeederService],
})
export class DatabaseSeederModule { }