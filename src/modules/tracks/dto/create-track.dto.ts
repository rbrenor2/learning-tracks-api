import { ArrayMinSize, IsArray, IsOptional, IsString } from "class-validator";
import { CustomErrorMessages } from "../../../common/enums/custom-error-messages.enum";
import { NoSpecialChars } from "../../../common/validators/no-special-chars.validator";

export class CreateTrackDto {
    @IsOptional()
    @IsArray({ message: CustomErrorMessages.tracksIsArray })
    @IsString({ each: true, message: CustomErrorMessages.trackMustBeString })
    @ArrayMinSize(1, { message: CustomErrorMessages.atLeastOneTrack })
    @NoSpecialChars({ message: CustomErrorMessages.unallowedChars })
    names: string[]
}