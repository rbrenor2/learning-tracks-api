import { IsOptional, IsArray, IsString, ArrayMinSize, IsBoolean } from "class-validator"
import { CustomErrorMessages } from "src/common/enums/custom-error-messages.enum"

export class UpdateContentDto {
    @IsBoolean({ message: CustomErrorMessages.completedMustBeBoolean })
    completed: boolean

    @IsOptional()
    @IsArray({ message: CustomErrorMessages.tracksIsArray })
    @IsString({ each: true, message: CustomErrorMessages.trackMustBeString })
    @ArrayMinSize(1, { message: CustomErrorMessages.atLeastOneTrack })
    tracks?: string[]
}
