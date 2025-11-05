import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hasSpecialChars } from 'src/common/helpers/string.helper';
import { handleHttpError } from 'src/common/helpers/errors.helper';
import { FindDto } from 'src/common/dto/find.dto';
import { buildPaginationOptions } from 'src/common/helpers/pagination.helper';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private readonly repo: Repository<Track>
  ) { }
  async create(createTrackDto: CreateTrackDto) {
    if (hasSpecialChars(createTrackDto.name)) {
      handleHttpError(400, "Field contains unallowed characters")
    }

    const track = this.repo.create({ name: createTrackDto.name })

    return await this.repo.save(track);
  }

  async findAll(dto: FindDto) {
    const where = dto.q && dto.q.trim() !== '' ? [
      { name: ILike(`%${dto.q}%`) },
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
      handleHttpError(404, "Track not found")
    }

    return result;
  }

  async update(id: number, updateTrackDto: UpdateTrackDto) {
    const { affected } = await this.repo.update({ id }, {
      name: updateTrackDto.name
    })

    if (!affected) handleHttpError(404, "Track not found")

    return;
  }

  async remove(id: number) {
    const { affected } = await this.repo.delete(id)

    if (!affected) handleHttpError(404, "Track not found")

    return;
  }
}
