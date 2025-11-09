import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CustomErrorMessages } from '../../../common/enums/custom-error-messages.enum';
import { UpdateContentDto } from './update-content.dto';

describe('UpdateContentDto', () => {
    const createDto = (data: any): UpdateContentDto => {
        return plainToInstance(UpdateContentDto, data);
    };

    const validateDto = async (dto: UpdateContentDto) => {
        return await validate(dto);
    };

    describe('completed property', () => {
        it('should pass validation with boolean true', async () => {
            const dto = createDto({
                completed: true
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should pass validation with boolean false', async () => {
            const dto = createDto({
                completed: false
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should fail validation when completed is undefined', async () => {
            const dto = createDto({});
            const errors = await validateDto(dto);

            const completedErrors = errors.filter(error => error.property === 'completed');
            expect(completedErrors).toHaveLength(1);
            expect(completedErrors[0].constraints?.isBoolean).toBe(CustomErrorMessages.completedMustBeBoolean);
        });

        it('should fail validation when completed is a string', async () => {
            const dto = createDto({
                completed: 'true'
            });
            const errors = await validateDto(dto);

            const completedErrors = errors.filter(error => error.property === 'completed');
            expect(completedErrors).toHaveLength(1);
            expect(completedErrors[0].constraints?.isBoolean).toBe(CustomErrorMessages.completedMustBeBoolean);
        });

        it('should fail validation when completed is a number', async () => {
            const dto = createDto({
                completed: 1
            });
            const errors = await validateDto(dto);

            const completedErrors = errors.filter(error => error.property === 'completed');
            expect(completedErrors).toHaveLength(1);
            expect(completedErrors[0].constraints?.isBoolean).toBe(CustomErrorMessages.completedMustBeBoolean);
        });
    });

    describe('tracks property', () => {
        it('should pass validation when tracks is undefined (optional)', async () => {
            const dto = createDto({
                completed: true
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should pass validation with valid track array', async () => {
            const dto = createDto({
                completed: true,
                tracks: ['Advanced JavaScript', 'React Basics', 'Node Tutorial']
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should fail validation when tracks is not an array', async () => {
            const dto = createDto({
                completed: true,
                tracks: 'not an array'
            });
            const errors = await validateDto(dto);

            const tracksErrors = errors.filter(error => error.property === 'tracks');
            expect(tracksErrors).toHaveLength(1);
            expect(tracksErrors[0].constraints?.isArray).toBe(CustomErrorMessages.tracksIsArray);
        });

        it('should fail validation when tracks array is empty', async () => {
            const dto = createDto({
                completed: true,
                tracks: []
            });
            const errors = await validateDto(dto);

            const tracksErrors = errors.filter(error => error.property === 'tracks');
            expect(tracksErrors).toHaveLength(1);
            expect(tracksErrors[0].constraints?.arrayMinSize).toBe(CustomErrorMessages.atLeastOneTrack);
        });

        it('should fail validation when track items are not strings', async () => {
            const dto = createDto({
                completed: true,
                tracks: [123, 'Valid Track', null, undefined]
            });
            const errors = await validateDto(dto);

            const tracksErrors = errors.filter(error => error.property === 'tracks');
            expect(tracksErrors).toHaveLength(1);
            expect(tracksErrors[0].constraints?.isString).toBe(CustomErrorMessages.trackMustBeString);
        });

        it('should fail validation when tracks contain special characters', async () => {
            const dto = createDto({
                completed: false,
                tracks: ['Valid Track', 'Invalid@Track', 'Another#Invalid']
            });
            const errors = await validateDto(dto);

            const tracksErrors = errors.filter(error => error.property === 'tracks');
            expect(tracksErrors).toHaveLength(1);
            expect(tracksErrors[0].constraints?.NoSpecialChars).toBe(CustomErrorMessages.unallowedChars);
        });

        it('should pass validation with single valid track', async () => {
            const dto = createDto({
                completed: false,
                tracks: ['Single Track']
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should pass validation with tracks containing numbers and spaces', async () => {
            const dto = createDto({
                completed: true,
                tracks: ['React 18 Advanced', 'JavaScript ES2023', 'TypeScript 5']
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });
    });

    describe('combined validation', () => {
        it('should pass validation with both valid properties', async () => {
            const dto = createDto({
                completed: true,
                tracks: ['Full Stack Development', 'Database Design', 'API Development']
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should pass validation with only required completed property', async () => {
            const dto = createDto({
                completed: false
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should fail validation when completed is missing', async () => {
            const dto = createDto({
                tracks: ['Valid Track']
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(1);
            expect(errors[0].property).toBe('completed');
            expect(errors[0].constraints?.isBoolean).toBe(CustomErrorMessages.completedMustBeBoolean);
        });

        it('should fail validation with multiple invalid properties', async () => {
            const dto = createDto({
                completed: 'invalid',
                tracks: 'not an array'
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(2);

            const propertyNames = errors.map(error => error.property);
            expect(propertyNames).toContain('completed');
            expect(propertyNames).toContain('tracks');
        });

        it('should fail validation with invalid completed and empty tracks array', async () => {
            const dto = createDto({
                completed: 1,
                tracks: []
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(2);

            const completedError = errors.find(error => error.property === 'completed');
            const tracksError = errors.find(error => error.property === 'tracks');

            expect(completedError?.constraints?.isBoolean).toBe(CustomErrorMessages.completedMustBeBoolean);
            expect(tracksError?.constraints?.arrayMinSize).toBe(CustomErrorMessages.atLeastOneTrack);
        });

        it('should fail validation with valid completed but special characters in tracks', async () => {
            const dto = createDto({
                completed: true,
                tracks: ['Valid Track', 'Track with @ symbol', 'Track with # hash']
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(1);
            expect(errors[0].property).toBe('tracks');
            expect(errors[0].constraints?.NoSpecialChars).toBe(CustomErrorMessages.unallowedChars);
        });

        it('should validate tracks with mixed constraint violations', async () => {
            const dto = createDto({
                completed: true,
                tracks: [123, 'Valid Track'] // Non-string and valid track
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(1);
            expect(errors[0].property).toBe('tracks');
            expect(errors[0].constraints?.isString).toBe(CustomErrorMessages.trackMustBeString);
        });
    });
});