import { IsNotEmpty, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { CustomErrorMessages } from "src/common/enums/custom-error-messages.enum"

export class UpdateTrackDto {
    @ApiProperty({
        description: 'New name for the track',
        example: 'Advanced React Patterns',
        minLength: 1,
        maxLength: 100
    })
    @IsNotEmpty({ message: CustomErrorMessages.trackNameIsRequired })
    @IsString()
    name: string
}
