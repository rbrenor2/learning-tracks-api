import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';
import { handleHttpError } from 'src/common/helpers/errors.helper';
import { CustomErrorMessages } from 'src/common/enums/custom-error-messages.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private readonly secret: string

    constructor(private userService: UsersService, private jwtService: JwtService, private configService: ConfigService) {
        this.secret = this.configService.getOrThrow<string>('JWT_SECRET');
    }

    async login({ email, password }: AuthDto) {
        const user = await this.userService.findOne(email)
        if (!user) return handleHttpError(401, CustomErrorMessages.invalidUsernameOrPassword)

        const hasPasswordMatch = await bcrypt.compare(password, user?.password)
        if (!hasPasswordMatch) return handleHttpError(401, CustomErrorMessages.invalidUsernameOrPassword)

        const payload = { email: email }
        const token = this.jwtService.sign(payload, { secret: this.secret })

        return {
            access_token: token
        }
    }
}
