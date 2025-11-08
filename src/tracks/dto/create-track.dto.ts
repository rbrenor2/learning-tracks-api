import { IsOptional, IsArray, IsString, ArrayMinSize } from "class-validator";
import { CustomErrorMessages } from "src/common/enums/custom-error-messages.enum";

export class CreateTrackDto {
    @IsOptional()
    @IsArray({ message: CustomErrorMessages.tracksIsArray })
    @IsString({ each: true, message: CustomErrorMessages.trackMustBeString })
    @ArrayMinSize(1, { message: CustomErrorMessages.atLeastOneTrack })
    names: string[]
}