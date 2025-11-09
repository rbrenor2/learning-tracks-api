import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"
import { CustomErrorMessages } from "../../../common/enums/custom-error-messages.enum"

export class AuthDto {
    @ApiProperty({
        description: 'User email for authentication',
        example: 'user@example.com',
        format: 'email'
    })
    @IsNotEmpty({ message: CustomErrorMessages.emailIsRequired })
    @IsString()
    email: string

    @ApiProperty({
        description: 'User password for authentication',
        example: 'mypassword123',
        format: 'password'
    })
    @IsNotEmpty({ message: CustomErrorMessages.passwordIsRequired })
    @IsString()
    password: string
}