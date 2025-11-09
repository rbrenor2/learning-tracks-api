import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { CustomErrorMessages } from "src/common/enums/custom-error-messages.enum"

export class CreateUserDto {
    @ApiProperty({
        description: 'Full name of the user',
        example: 'John Doe',
        minLength: 1,
        maxLength: 100
    })
    @IsNotEmpty({ message: CustomErrorMessages.nameIsRequired })
    @IsString()
    name: string

    @ApiProperty({
        description: 'User email address (must be unique)',
        example: 'john.doe@example.com',
        format: 'email'
    })
    @IsNotEmpty({ message: CustomErrorMessages.emailIsRequired })
    @IsEmail({}, { message: CustomErrorMessages.invalidEmailAddress })
    email: string

    @ApiProperty({
        description: 'User password (minimum 8 characters)',
        example: 'MySecurePassword123!',
        minLength: 8,
        maxLength: 128,
        format: 'password'
    })
    @IsNotEmpty({ message: CustomErrorMessages.passwordIsRequired })
    @IsString()
    @MinLength(8, { message: CustomErrorMessages.passwordMinLength })
    @MaxLength(128, { message: CustomErrorMessages.passwordMaxLength })
    password: string
}