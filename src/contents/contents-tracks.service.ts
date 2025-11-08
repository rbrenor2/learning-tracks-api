import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ContentTrack } from './entities/content-track.entity';

@Injectable()
export class ContentsTracksService {
    constructor(@InjectRepository(ContentTrack) private repo: Repository<ContentTrack>) { }

    async createWithTransaction(contentId: number, tracksIds: number[], manager: EntityManager) {
        const contentTracks = tracksIds.map((trackId: number) => {
            return manager.create(ContentTrack, { idContent: contentId, idTrack: trackId })
        })

        const savedContentTracks = await manager.createQueryBuilder()
            .insert()
            .into(ContentTrack)
            .values(contentTracks)
            .orIgnore()
            .execute()

        return savedContentTracks
    }
}
