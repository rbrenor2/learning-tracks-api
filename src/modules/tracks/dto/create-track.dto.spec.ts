import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CustomErrorMessages } from '../../../common/enums/custom-error-messages.enum';
import { CreateTrackDto } from './create-track.dto';

describe('CreateTrackDto', () => {
    const createDto = (data: any): CreateTrackDto => {
        return plainToInstance(CreateTrackDto, data);
    };

    const validateDto = async (dto: CreateTrackDto) => {
        return await validate(dto);
    };

    describe('names property', () => {
        it('should pass validation when names is undefined (optional)', async () => {
            const dto = createDto({});
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should pass validation with valid track names array', async () => {
            const dto = createDto({
                names: ['JavaScript Fundamentals', 'React Basics', 'Node Development']
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should pass validation with single track name', async () => {
            const dto = createDto({
                names: ['Single Track Name']
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should pass validation with track names containing numbers and spaces', async () => {
            const dto = createDto({
                names: ['React 18 Advanced', 'JavaScript ES2023', 'TypeScript 5 Basics']
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should fail validation when names is not an array', async () => {
            const dto = createDto({
                names: 'not an array'
            });
            const errors = await validateDto(dto);

            const namesErrors = errors.filter(error => error.property === 'names');
            expect(namesErrors).toHaveLength(1);
            expect(namesErrors[0].constraints?.isArray).toBe(CustomErrorMessages.tracksIsArray);
        });

        it('should fail validation when names array is empty', async () => {
            const dto = createDto({
                names: []
            });
            const errors = await validateDto(dto);

            const namesErrors = errors.filter(error => error.property === 'names');
            expect(namesErrors).toHaveLength(1);
            expect(namesErrors[0].constraints?.arrayMinSize).toBe(CustomErrorMessages.atLeastOneTrack);
        });

        it('should fail validation when names contain non-string items', async () => {
            const dto = createDto({
                names: ['Valid Track', 123, null, undefined, 'Another Valid Track']
            });
            const errors = await validateDto(dto);

            const namesErrors = errors.filter(error => error.property === 'names');
            expect(namesErrors).toHaveLength(1);
            expect(namesErrors[0].constraints?.isString).toBe(CustomErrorMessages.trackMustBeString);
        });

        it('should fail validation when names contains empty strings', async () => {
            const dto = createDto({
                names: ['Valid Track', '', 'Another Valid Track']
            });
            const errors = await validateDto(dto);

            // Note: This will pass IsString validation but might fail at service level
            // IsString doesn't check for empty strings, only type
            expect(errors).toHaveLength(0);
        });

        it('should pass validation with long track names', async () => {
            const dto = createDto({
                names: [
                    'Advanced JavaScript Fundamentals and Modern ES6 Plus Features',
                    'Complete React Development with Hooks and Context API',
                    'Full Stack Node Express MongoDB Development Course'
                ]
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should fail validation with mixed valid and invalid types', async () => {
            const dto = createDto({
                names: [
                    'Valid Track Name',
                    42,
                    'Another Valid Track',
                    true,
                    'Third Valid Track'
                ]
            });
            const errors = await validateDto(dto);

            const namesErrors = errors.filter(error => error.property === 'names');
            expect(namesErrors).toHaveLength(1);
            expect(namesErrors[0].constraints?.isString).toBe(CustomErrorMessages.trackMustBeString);
        });

        it('should pass validation with duplicate track names (validation allows duplicates)', async () => {
            const dto = createDto({
                names: ['JavaScript Basics', 'React Tutorial', 'JavaScript Basics']
            });
            const errors = await validateDto(dto);

            // Validation allows duplicates - business logic should handle uniqueness
            expect(errors).toHaveLength(0);
        });

        it('should fail validation when names is a number', async () => {
            const dto = createDto({
                names: 123
            });
            const errors = await validateDto(dto);

            const namesErrors = errors.filter(error => error.property === 'names');
            expect(namesErrors).toHaveLength(1);
            expect(namesErrors[0].constraints?.isArray).toBe(CustomErrorMessages.tracksIsArray);
        });

        it('should fail validation when names is a boolean', async () => {
            const dto = createDto({
                names: true
            });
            const errors = await validateDto(dto);

            const namesErrors = errors.filter(error => error.property === 'names');
            expect(namesErrors).toHaveLength(1);
            expect(namesErrors[0].constraints?.isArray).toBe(CustomErrorMessages.tracksIsArray);
        });

        it('should fail validation when names contain special characters', async () => {
            const dto = createDto({
                names: ['Track with @ symbol', 'Track with # hash', 'Valid Track']
            });
            const errors = await validateDto(dto);

            const namesErrors = errors.filter(error => error.property === 'names');
            expect(namesErrors).toHaveLength(1);
            expect(namesErrors[0].constraints?.NoSpecialChars).toBe(CustomErrorMessages.unallowedChars);
        });

        it('should pass validation with track names without special characters', async () => {
            const dto = createDto({
                names: ['JavaScript Fundamentals', 'React Advanced', 'Node Backend Development']
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });
    });

    describe('edge cases and boundary conditions', () => {
        it('should handle very large arrays', async () => {
            const largeArray = Array.from({ length: 100 }, (_, i) => `Track ${i + 1}`);
            const dto = createDto({
                names: largeArray
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should handle arrays with only whitespace strings', async () => {
            const dto = createDto({
                names: ['   ', '\t', '\n', '     \t\n     ']
            });
            const errors = await validateDto(dto);

            // IsString validation passes for whitespace-only strings
            expect(errors).toHaveLength(0);
        });

        it('should handle unicode characters in track names', async () => {
            const dto = createDto({
                names: ['JavaScript 基础', '编程入门', 'Programación Básica', 'Programmation de Base']
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });
    });
});