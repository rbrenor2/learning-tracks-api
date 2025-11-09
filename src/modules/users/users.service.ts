import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { handleHttpError } from 'src/common/helpers/errors.helper';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>
    ) { }

    async create({ name, email, password }: CreateUserDto) {
        const user = this.repo.create({ name, email, password })
        return await this.repo.save(user)
    }

    async findOne(email: string) {
        const user = await this.repo.findOneBy({ email })
        if (!user) handleHttpError(404)

        return user;
    }
}
