import {
    Validate,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { CustomErrorMessages } from '../enums/custom-error-messages.enum';

@ValidatorConstraint({ name: 'NoSpecialChars', async: false })
export class NoSpecialCharsConstraint implements ValidatorConstraintInterface {
    validate(tracks: string[], _args: ValidationArguments) {
        if (!Array.isArray(tracks)) return true;

        const regex = /[!@#$%^&*()_+=[\]{};':"\\|,.<>/?~`]/;

        return tracks.every((track) => {
            if (typeof track !== 'string') return true;
            return !regex.test(track);
        });
    }

    defaultMessage(_args: ValidationArguments) {
        return CustomErrorMessages.unallowedChars;
    }
}

export function NoSpecialChars(validationOptions?: ValidationOptions) {
    return Validate(NoSpecialCharsConstraint, validationOptions);
}