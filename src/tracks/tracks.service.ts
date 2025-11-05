import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hasSpecialChars } from 'src/common/helpers/string.helper';
import { handleHttpError } from 'src/common/helpers/errors.helper';

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

  findAll() {
    return `This action returns all tracks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} track`;
  }

  update(id: number, updateTrackDto: UpdateTrackDto) {
    return `This action updates a #${id} track`;
  }

  remove(id: number) {
    return `This action removes a #${id} track`;
  }
}
