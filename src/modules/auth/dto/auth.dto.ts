import { IsNotEmpty, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { CustomErrorMessages } from "src/common/enums/custom-error-messages.enum"

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