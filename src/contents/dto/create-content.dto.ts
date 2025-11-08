import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { CustomErrorMessages } from "src/common/enums/custom-error-messages.enum"

export class CreateContentDto {
    @ApiProperty({
        description: 'YouTube video ID (v query parameter in the url)',
        example: 'pXmBRK1BjLw',
    })
    @IsNotEmpty({ message: CustomErrorMessages.videoIdIsRequired })
    @IsString()
    videoId: string

    @ApiPropertyOptional({
        description: "Array of track names to associate with this content. If a track doesn't exist yet, it will be created.",
        example: ['JavaScript Basics', 'Web Development', 'Programming'],
        type: [String],
        minItems: 1
    })
    @IsOptional()
    @IsArray({ message: CustomErrorMessages.tracksIsArray })
    @IsString({ each: true, message: CustomErrorMessages.trackMustBeString })
    @ArrayMinSize(1, { message: CustomErrorMessages.atLeastOneTrack })
    tracks?: string[]
}
