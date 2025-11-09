import { ValidationArguments } from 'class-validator';
import { CustomErrorMessages } from '../enums/custom-error-messages.enum';
import { NoSpecialCharsConstraint } from './no-special-chars.validator';

describe('NoSpecialCharsValidator', () => {
    let validator: NoSpecialCharsConstraint;
    let mockArgs: ValidationArguments;

    beforeEach(() => {
        validator = new NoSpecialCharsConstraint();
        mockArgs = {} as ValidationArguments; // Mock args since we don't use them
    });

    describe('validate', () => {
        it('should return true for valid track names without special characters', () => {
            const validTracks = ['JavaScript Basics', 'React Tutorial', 'Node Tutorial'];
            const result = validator.validate(validTracks, mockArgs);

            expect(result).toBe(true);
        });

        it('should return true for empty array', () => {
            const emptyTracks: string[] = [];
            const result = validator.validate(emptyTracks, mockArgs);

            expect(result).toBe(true);
        });

        it('should return false for track names with special characters', () => {
            const invalidTracks = ['React@Tutorial', 'Node.js Basics', 'Vue#Framework'];
            const result = validator.validate(invalidTracks, mockArgs);

            expect(result).toBe(false);
        });

        it('should return false if any track contains special characters', () => {
            const mixedTracks = ['Valid Track', 'Another Valid Track', 'Invalid@Track'];
            const result = validator.validate(mixedTracks, mockArgs);

            expect(result).toBe(false);
        });

        it('should return true for tracks with allowed characters (letters, numbers, spaces)', () => {
            const validTracks = ['React 18 Tutorial', 'JavaScript ES6', 'Node 20 Features'];
            const result = validator.validate(validTracks, mockArgs);

            expect(result).toBe(true);
        });

        it('should return true for non-array input (let other validators handle)', () => {
            const nonArray = 'not an array';

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const result = validator.validate(nonArray as any, mockArgs);

            expect(result).toBe(true);
        });

        it('should return true for array with non-string items (let other validators handle)', () => {
            const mixedArray = ['Valid Track', 123, null, undefined];

            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const result = validator.validate(mixedArray as any, mockArgs);

            expect(result).toBe(true);
        });

        it('should test all forbidden special characters', () => {
            const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', '=', '[', ']', '{', '}', ';', "'", ':', '"', '\\', '|', ',', '.', '<', '>', '/', '?', '~', '`'];

            specialChars.forEach(char => {
                const trackWithSpecialChar = [`Track with ${char} character`];
                const result = validator.validate(trackWithSpecialChar, mockArgs);
                expect(result).toBe(false);
            });
        });
    });

    describe('defaultMessage', () => {
        it('should return correct error message', () => {
            const message = validator.defaultMessage(mockArgs);

            expect(message).toBe(CustomErrorMessages.unallowedChars);
        });
    });
});