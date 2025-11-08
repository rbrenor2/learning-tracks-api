import { IsNotEmpty, IsString } from "class-validator"
import { CustomErrorMessages } from "src/common/enums/custom-error-messages.enum"

export class AuthDto {
    @IsNotEmpty({ message: CustomErrorMessages.emailIsRequired })
    @IsString()
    email: string

    @IsNotEmpty({ message: CustomErrorMessages.passwordIsRequired })
    @IsString()
    password: string
}