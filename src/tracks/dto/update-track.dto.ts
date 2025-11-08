import { IsNotEmpty, IsString } from "class-validator"
import { CustomErrorMessages } from "src/common/enums/custom-error-messages.enum"

export class UpdateTrackDto {
    @IsNotEmpty({ message: CustomErrorMessages.trackNameIsRequired })
    @IsString()
    name: string
}
