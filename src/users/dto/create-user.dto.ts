import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"
import { CustomErrorMessages } from "src/common/enums/custom-error-messages.enum"

export class CreateUserDto {
    @IsNotEmpty({ message: CustomErrorMessages.nameIsRequired })
    @IsString()
    name: string

    @IsNotEmpty({ message: CustomErrorMessages.emailIsRequired })
    @IsEmail({}, { message: CustomErrorMessages.invalidEmailAddress })
    email: string

    @IsNotEmpty({ message: CustomErrorMessages.passwordIsRequired })
    @IsString()
    @MinLength(8, { message: CustomErrorMessages.passwordMinLength })
    @MaxLength(128, { message: CustomErrorMessages.passwordMaxLength })
    password: string
}