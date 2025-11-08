import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { EntityManager, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { buildDbErrorMessage, handleHttpError } from 'src/common/helpers/errors.helper';
import { FindDto } from 'src/common/dto/find.dto';
import { buildPaginationOptions } from 'src/common/helpers/pagination.helper';
import { hasSpecialChars } from 'src/common/helpers/string.helper';
import { CustomErrorMessages } from 'src/common/enums/custom-error-messages.enum';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private readonly repo: Repository<Track>
  ) { }

  async create({ names }: CreateTrackDto) {
    const foundSpecialChars = names.find((track: string) => hasSpecialChars(track))

    if (foundSpecialChars) handleHttpError(400, CustomErrorMessages.unallowedChars)

    const tracks = names.map((track: string) => this.repo.create({ name: track }))

    try {
      await this.repo.createQueryBuilder().insert().values(tracks).execute();
    } catch (error) {
      handleHttpError(409, buildDbErrorMessage(error))
    }
    return
  }

  async findAll({ _q, _pageNumber, _pageSize }: FindDto) {
    const where = _q && _q.trim() !== '' ? [
      { name: ILike(`%${_q}%`) },
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
      handleHttpError(404)
    }

    return result;
  }

  async update(id: number, updateTrackDto: UpdateTrackDto) {
    const { affected } = await this.repo.update({ id }, {
      name: updateTrackDto.name
    })
    if (!affected) handleHttpError(404)

    return;
  }

  async remove(id: number) {
    const { affected } = await this.repo.delete(id)

    if (!affected) handleHttpError(404)

    return;
  }

  async createWithTransaction(names: string[], manager: EntityManager) {
    const tracks = names.map((track: string) => manager.create(Track, { name: track }))

    await manager.createQueryBuilder()
      .insert()
      .into(Track)
      .values(tracks)
      .orIgnore()
      .execute()

    const allTrackIds = await manager.find(Track, {
      where: names.map(name => ({ name })),
      select: ['id']
    })

    return allTrackIds
  }
}
