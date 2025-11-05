import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { YoutubeService } from 'src/youtube/youtube.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { ILike, Repository, DataSource } from 'typeorm';
import { buildPaginationOptions } from 'src/common/helpers/pagination.helper';
import { parseISO8601ToSeconds } from 'src/common/helpers/time.helper';
import { FindDto } from 'src/common/dto/find.dto';
import { TracksService } from 'src/tracks/tracks.service';
import { buildDbErrorMessage, handleHttpError } from 'src/common/helpers/errors.helper';
import { hasSpecialChars } from 'src/common/helpers/string.helper';

@Injectable()
export class ContentsService {
  constructor(
    private youtubeService: YoutubeService,
    private trackService: TracksService,
    @InjectRepository(Content)
    private readonly repo: Repository<Content>,
    private dataSource: DataSource
  ) { }

  async create(createContentDto: CreateContentDto) {
    const videoData = await this.youtubeService.fetchVideoData(createContentDto.videoId)
    const parsedDuration = parseISO8601ToSeconds(videoData.duration)

    const content = this.repo.create({
      ...videoData,
      duration: parsedDuration
    })

    if (createContentDto.tracks) {
      const foundSpecialChars = createContentDto.tracks.find((track: string) => hasSpecialChars(track))
      if (foundSpecialChars) handleHttpError(400, "Track contains unallowed characters")
    }

    try {
      return await this.dataSource.transaction(async manager => {
        const savedContent = await manager.save(Content, content)

        if (createContentDto.tracks && createContentDto.tracks.length > 0) {
          await this.trackService.createWithTransaction(createContentDto.tracks, manager)
        }

        return savedContent
      })
    } catch (error) {
      handleHttpError(409, buildDbErrorMessage(error))
    }
  }

  async findAll(dto: FindDto) {
    const where = dto.q && dto.q.trim() !== '' ? [
      { title: ILike(`%${dto.q}%`) },
      { description: ILike(`%${dto.q}%`) },
    ] : undefined

    const options = buildPaginationOptions({ pageNumber: dto.pageNumber, pageSize: dto.pageSize })

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

  update(id: number, updateContentDto: UpdateContentDto) {
    return `This action updates a #${id} content`;
  }

  async remove(id: number) {
    const { affected } = await this.repo.delete(id)

    if (!affected) throw new NotFoundException()

    return;
  }
}
