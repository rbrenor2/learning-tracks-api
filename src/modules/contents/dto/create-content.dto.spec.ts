import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CustomErrorMessages } from '../../../common/enums/custom-error-messages.enum';
import { CreateContentDto } from './create-content.dto';

describe('CreateContentDto', () => {
    const createDto = (data: any): CreateContentDto => {
        return plainToInstance(CreateContentDto, data);
    };

    const validateDto = async (dto: CreateContentDto) => {
        return await validate(dto);
    };

    describe('videoId property', () => {
        it('should pass validation with valid video ID', async () => {
            const dto = createDto({
                videoId: 'pXmBRK1BjLw'
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should fail validation when videoId is empty string', async () => {
            const dto = createDto({
                videoId: ''
            });
            const errors = await validateDto(dto);

            const videoIdErrors = errors.filter(error => error.property === 'videoId');
            expect(videoIdErrors).toHaveLength(1);
            expect(videoIdErrors[0].constraints?.isNotEmpty).toBe(CustomErrorMessages.videoIdIsRequired);
        });

        it('should fail validation when videoId is undefined', async () => {
            const dto = createDto({});
            const errors = await validateDto(dto);

            const videoIdErrors = errors.filter(error => error.property === 'videoId');
            expect(videoIdErrors).toHaveLength(1);
            expect(videoIdErrors[0].constraints?.isNotEmpty).toBe(CustomErrorMessages.videoIdIsRequired);
        });

        it('should fail validation when videoId is not a string', async () => {
            const dto = createDto({
                videoId: 123
            });
            const errors = await validateDto(dto);

            const videoIdErrors = errors.filter(error => error.property === 'videoId');
            expect(videoIdErrors).toHaveLength(1);
            expect(videoIdErrors[0].constraints?.isString).toBeDefined();
        });
    });

    describe('tracks property', () => {
        it('should pass validation when tracks is undefined (optional)', async () => {
            const dto = createDto({
                videoId: 'pXmBRK1BjLw'
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should pass validation with valid track array', async () => {
            const dto = createDto({
                videoId: 'pXmBRK1BjLw',
                tracks: ['JavaScript Basics', 'Web Development', 'Programming']
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should fail validation when tracks is not an array', async () => {
            const dto = createDto({
                videoId: 'pXmBRK1BjLw',
                tracks: 'not an array'
            });
            const errors = await validateDto(dto);

            const tracksErrors = errors.filter(error => error.property === 'tracks');
            expect(tracksErrors).toHaveLength(1);
            expect(tracksErrors[0].constraints?.isArray).toBe(CustomErrorMessages.tracksIsArray);
        });

        it('should fail validation when tracks array is empty', async () => {
            const dto = createDto({
                videoId: 'pXmBRK1BjLw',
                tracks: []
            });
            const errors = await validateDto(dto);

            const tracksErrors = errors.filter(error => error.property === 'tracks');
            expect(tracksErrors).toHaveLength(1);
            expect(tracksErrors[0].constraints?.arrayMinSize).toBe(CustomErrorMessages.atLeastOneTrack);
        });

        it('should fail validation when track items are not strings', async () => {
            const dto = createDto({
                videoId: 'pXmBRK1BjLw',
                tracks: [123, 'Valid Track', null]
            });
            const errors = await validateDto(dto);

            const tracksErrors = errors.filter(error => error.property === 'tracks');
            expect(tracksErrors).toHaveLength(1);
            expect(tracksErrors[0].constraints?.isString).toBe(CustomErrorMessages.trackMustBeString);
        });

        it('should fail validation when tracks contain special characters', async () => {
            const dto = createDto({
                videoId: 'pXmBRK1BjLw',
                tracks: ['Valid Track', 'Invalid@Track', 'Another#Invalid']
            });
            const errors = await validateDto(dto);

            const tracksErrors = errors.filter(error => error.property === 'tracks');
            expect(tracksErrors).toHaveLength(1);
            expect(tracksErrors[0].constraints?.NoSpecialChars).toBe(CustomErrorMessages.unallowedChars);
        });

        it('should pass validation with single valid track', async () => {
            const dto = createDto({
                videoId: 'pXmBRK1BjLw',
                tracks: ['Single Track']
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should pass validation with tracks containing numbers and spaces', async () => {
            const dto = createDto({
                videoId: 'pXmBRK1BjLw',
                tracks: ['React 18 Tutorial', 'JavaScript ES6', 'Node 20 Features']
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });
    });

    describe('combined validation', () => {
        it('should pass validation with all valid properties', async () => {
            const dto = createDto({
                videoId: 'dQw4w9WgXcQ',
                tracks: ['Music Video', 'Entertainment', 'Classic']
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should pass validation with only required videoId', async () => {
            const dto = createDto({
                videoId: 'abc123xyz'
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should fail validation with multiple invalid properties', async () => {
            const dto = createDto({
                videoId: '',
                tracks: 'not an array'
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(2);

            const propertyNames = errors.map(error => error.property);
            expect(propertyNames).toContain('videoId');
            expect(propertyNames).toContain('tracks');
        });

        it('should fail validation with invalid tracks array (multiple constraint violations)', async () => {
            const dto = createDto({
                videoId: 'validVideoId',
                tracks: []
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(1);
            expect(errors[0].property).toBe('tracks');
            expect(errors[0].constraints?.arrayMinSize).toBe(CustomErrorMessages.atLeastOneTrack);
        });

        it('should fail validation with special characters in tracks', async () => {
            const dto = createDto({
                videoId: 'validVideoId',
                tracks: ['Valid Track', 'Track with @ symbol', 'Track with # hash']
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(1);
            expect(errors[0].property).toBe('tracks');
            expect(errors[0].constraints?.NoSpecialChars).toBe(CustomErrorMessages.unallowedChars);
        });

        it('should validate all tracks constraints together', async () => {
            const dto = createDto({
                videoId: 'validVideoId',
                tracks: [123, 'Valid Track'] // Non-string and valid track
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(1);
            expect(errors[0].property).toBe('tracks');
            expect(errors[0].constraints?.isString).toBe(CustomErrorMessages.trackMustBeString);
        });
    });
});