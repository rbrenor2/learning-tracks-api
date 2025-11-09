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
    validate(value: string | string[], _args: ValidationArguments) {
        const regex = /[!@#$%^&*()_+=[\]{};':"\\|,.<>/?~`]/;

        // Handle single string
        if (typeof value === 'string') {
            return !regex.test(value);
        }

        // Handle array of strings
        if (Array.isArray(value)) {
            return value.every((item) => {
                if (typeof item !== 'string') return true;
                return !regex.test(item);
            });
        }

        // For any other type, pass validation (let other validators handle type checking)
        return true;
    }

    defaultMessage(_args: ValidationArguments) {
        return CustomErrorMessages.unallowedChars;
    }
}

export function NoSpecialChars(validationOptions?: ValidationOptions) {
    return Validate(NoSpecialCharsConstraint, validationOptions);
}