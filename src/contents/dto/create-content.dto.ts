import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { CustomErrorMessages } from "src/common/enums/custom-error-messages.enum"

export class CreateContentDto {
    @IsNotEmpty({ message: CustomErrorMessages.videoIdIsRequired })
    @IsString()
    videoId: string

    @IsOptional()
    @IsArray({ message: CustomErrorMessages.tracksIsArray })
    @IsString({ each: true, message: CustomErrorMessages.trackMustBeString })
    @ArrayMinSize(1, { message: CustomErrorMessages.atLeastOneTrack })
    tracks?: string[]
}
