import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { YoutubeService } from 'src/youtube/youtube.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { ILike, Repository, DataSource, EntityManager } from 'typeorm';
import { buildPaginationOptions } from 'src/common/helpers/pagination.helper';
import { parseISO8601ToSeconds } from 'src/common/helpers/time.helper';
import { FindDto } from 'src/common/dto/find.dto';
import { TracksService } from 'src/tracks/tracks.service';
import { buildDbErrorMessage, handleHttpError } from 'src/common/helpers/errors.helper';
import { hasSpecialChars } from 'src/common/helpers/string.helper';
import { CustomErrorMessages } from 'src/common/enums/custom-error-messages.enum';
import { ContentsTracksService } from './contents-tracks.service';
import { Track } from 'src/tracks/entities/track.entity';

@Injectable()
export class ContentsService {
  constructor(
    private youtubeService: YoutubeService,
    private trackService: TracksService,
    private contentTrackService: ContentsTracksService,

    @InjectRepository(Content)
    private readonly repo: Repository<Content>,
    private dataSource: DataSource
  ) { }

  async create({ videoId, tracks }: CreateContentDto) {
    const videoData = await this.youtubeService.fetchVideoData(videoId)
    const parsedDuration = parseISO8601ToSeconds(videoData.duration)

    const content = this.repo.create({
      ...videoData,
      duration: parsedDuration
    })

    if (tracks && tracks.length > 0) {
      const foundSpecialChars = tracks.find((track: string) => hasSpecialChars(track))
      if (foundSpecialChars) handleHttpError(400, CustomErrorMessages.unallowedChars)
      return await this.createWithTransaction(content, tracks)
    }

    try {
      return this.repo.save(content)
    } catch (error) {
      handleHttpError(409, buildDbErrorMessage(error))
    }
  }

  async findAll({ _q, _pageNumber, _pageSize }: FindDto) {
    const where = _q && _q.trim() !== '' ? [
      { title: ILike(`%${_q}%`) },
      { description: ILike(`%${_q}%`) },
    ] : undefined

    const options = buildPaginationOptions({ pageNumber: _pageNumber, pageSize: _pageSize })

    const [results, total] = await this.repo.findAndCount(
      {
        where,
        take: options.take,
        skip: options.skip,
        order: { createdAt: 'DESC' }
      },
    )

    return { results, total };
  }

  async findOne(id: number) {
    const result = await this.repo.findOneBy({ id })

    if (!result) {
      throw new NotFoundException()
    }

    return result;
  }

  async update(id: number, { completed, tracks }: UpdateContentDto) {
    if (tracks) {
      const foundSpecialChars = tracks.find((track: string) => hasSpecialChars(track))
      if (foundSpecialChars) handleHttpError(400, CustomErrorMessages.unallowedChars)
      return await this.updateWithTransaction(id, completed, tracks)
    }

    try {
      const { affected } = await this.repo.update({ id }, {
        completed
      })
      if (!affected) handleHttpError(404)
    } catch (error) {
      handleHttpError(409, buildDbErrorMessage(error))
    }
  }

  async remove(id: number) {
    const { affected } = await this.repo.delete(id)

    if (!affected) throw new NotFoundException()

    return;
  }


  private async updateWithTransaction(id: number, completed: boolean, tracks: string[]) {
    try {
      return await this.dataSource.transaction(async manager => {
        await manager.update(Content, { id }, {
          completed
        })

        const content = await this.findOne(id)
        await this.createAndAssignTracksWithTransaction(content, tracks, manager)

        return;
      })
    } catch (error) {

      handleHttpError(409, buildDbErrorMessage(error))
    }
  }

  private async createWithTransaction(content: Content, tracks: string[]) {
    try {
      return await this.dataSource.transaction(async manager => {
        const savedContent = await manager.save(Content, content)
        await this.createAndAssignTracksWithTransaction(savedContent, tracks, manager)

        return savedContent
      })
    } catch (error) {
      handleHttpError(409, buildDbErrorMessage(error))
    }
  }

  private async createAndAssignTracksWithTransaction(content: Content, tracks: string[], manager: EntityManager) {
    const saved = await this.trackService.createWithTransaction(tracks, manager)
    const ids = saved.map((track: Partial<Track>) => track.id).filter((id: number | undefined) => id !== undefined)

    if (ids) {
      await this.contentTrackService.createWithTransaction(content.id, ids, manager)
    }
  }
}
