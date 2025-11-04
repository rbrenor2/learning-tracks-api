import { Injectable } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { YoutubeService } from 'src/youtube/youtube.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from './entities/content.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContentsService {
  constructor(
    private youtubeService: YoutubeService,
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>
  ) { }

  async create(createContentDto: CreateContentDto) {
    const videoData = await this.youtubeService.fetchVideoData(createContentDto.videoId)
    const parsedDuration = this.parseISO8601ToSeconds(videoData.duration)

    const content = this.contentRepository.create({
      ...videoData,
      duration: parsedDuration
    })

    return await this.contentRepository.save(content);
  }

  findAll() {
    return `This action returns all contents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} content`;
  }

  update(id: number, updateContentDto: UpdateContentDto) {
    return `This action updates a #${id} content`;
  }

  remove(id: number) {
    return `This action removes a #${id} content`;
  }

  private parseISO8601ToSeconds(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    const hours = parseInt(match?.[1] || '0', 10);
    const minutes = parseInt(match?.[2] || '0', 10);
    const seconds = parseInt(match?.[3] || '0', 10);

    return hours * 3600 + minutes * 60 + seconds;
  }
}
