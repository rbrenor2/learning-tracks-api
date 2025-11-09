import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"
import { CustomErrorMessages } from "../../../common/enums/custom-error-messages.enum"
import { NoSpecialChars } from "../../../common/validators/no-special-chars.validator"

export class UpdateTrackDto {
    @ApiProperty({
        description: 'New name for the track',
        example: 'Advanced React Patterns',
        minLength: 1,
        maxLength: 100
    })
    @IsNotEmpty({ message: CustomErrorMessages.trackNameIsRequired })
    @IsString()
    @NoSpecialChars({ message: CustomErrorMessages.unallowedChars })
    name: string
}
