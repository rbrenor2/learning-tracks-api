import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { YoutubeService } from 'src/youtube/youtube.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { ILike, Repository } from 'typeorm';
import { FindContentDto } from './dto/find-content.dto';
import { buildPaginationOptions } from 'src/common/helpers/pagination.helper';
import { parseISO8601ToSeconds } from 'src/common/helpers/time.helper';

@Injectable()
export class ContentsService {
  constructor(
    private youtubeService: YoutubeService,
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>
  ) { }

  async create(createContentDto: CreateContentDto) {
    const videoData = await this.youtubeService.fetchVideoData(createContentDto.videoId)
    const parsedDuration = parseISO8601ToSeconds(videoData.duration)

    const content = this.contentRepository.create({
      ...videoData,
      duration: parsedDuration
    })

    return await this.contentRepository.save(content);
  }

  async findAll(dto: FindContentDto) {
    const where = dto.search && dto.search.trim() !== '' ? [
      { title: ILike(`%${dto.search}%`) },
      { description: ILike(`%${dto.search}%`) },
    ] : undefined

    const options = buildPaginationOptions({ pageNumber: dto.pageNumber, pageSize: dto.pageSize })

    const [results, total] = await this.contentRepository.findAndCount(
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
    const result = await this.contentRepository.findOneBy({ id })

    if (!result) {
      throw new NotFoundException()
    }

    return result;
  }

  update(id: number, updateContentDto: UpdateContentDto) {
    return `This action updates a #${id} content`;
  }

  async remove(id: number) {
    const { affected } = await this.contentRepository.delete(id)

    if (!affected) throw new NotFoundException()

    return;
  }
}
