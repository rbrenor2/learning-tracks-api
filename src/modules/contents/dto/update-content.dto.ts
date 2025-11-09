import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { ArrayMinSize, IsArray, IsBoolean, IsOptional, IsString } from "class-validator"
import { CustomErrorMessages } from "../../../common/enums/custom-error-messages.enum"
import { NoSpecialChars } from "../../../common/validators/no-special-chars.validator"

export class UpdateContentDto {
    @ApiProperty({
        description: 'Mark content as completed or not completed',
        example: true,
        type: Boolean
    })
    @IsBoolean({ message: CustomErrorMessages.completedMustBeBoolean })
    completed: boolean

    @ApiPropertyOptional({
        description: "Assign Tracks to this content. If they don't exist yet, they will be created.",
        example: ['Advanced JavaScript', 'React Basics'],
        type: [String],
        minItems: 1
    })
    @IsOptional()
    @IsArray({ message: CustomErrorMessages.tracksIsArray })
    @IsString({ each: true, message: CustomErrorMessages.trackMustBeString })
    @ArrayMinSize(1, { message: CustomErrorMessages.atLeastOneTrack })
    @NoSpecialChars({ message: CustomErrorMessages.unallowedChars })
    tracks?: string[]
}
