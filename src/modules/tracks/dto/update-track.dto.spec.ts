import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CustomErrorMessages } from '../../../common/enums/custom-error-messages.enum';
import { UpdateTrackDto } from './update-track.dto';

describe('UpdateTrackDto', () => {
    const createDto = (data: any): UpdateTrackDto => {
        return plainToInstance(UpdateTrackDto, data);
    };

    const validateDto = async (dto: UpdateTrackDto) => {
        return await validate(dto);
    };

    describe('name property', () => {
        it('should pass validation with valid track name', async () => {
            const dto = createDto({
                name: 'Advanced React Patterns'
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should pass validation with track name containing numbers and spaces', async () => {
            const dto = createDto({
                name: 'React 18 Advanced Features'
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should pass validation with single character name', async () => {
            const dto = createDto({
                name: 'A'
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should pass validation with maximum length name', async () => {
            // Create a 100 character name
            const longName = 'A'.repeat(100);
            const dto = createDto({
                name: longName
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should pass validation with unicode characters', async () => {
            const dto = createDto({
                name: 'JavaScript 基础教程'
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should fail validation when name is empty string', async () => {
            const dto = createDto({
                name: ''
            });
            const errors = await validateDto(dto);

            const nameErrors = errors.filter(error => error.property === 'name');
            expect(nameErrors).toHaveLength(1);
            expect(nameErrors[0].constraints?.isNotEmpty).toBe(CustomErrorMessages.trackNameIsRequired);
        });

        it('should fail validation when name is undefined', async () => {
            const dto = createDto({});
            const errors = await validateDto(dto);

            const nameErrors = errors.filter(error => error.property === 'name');
            expect(nameErrors).toHaveLength(1);
            expect(nameErrors[0].constraints?.isNotEmpty).toBe(CustomErrorMessages.trackNameIsRequired);
        });

        it('should fail validation when name is null', async () => {
            const dto = createDto({
                name: null
            });
            const errors = await validateDto(dto);

            const nameErrors = errors.filter(error => error.property === 'name');
            expect(nameErrors).toHaveLength(1);
            expect(nameErrors[0].constraints?.isNotEmpty).toBe(CustomErrorMessages.trackNameIsRequired);
        });

        it('should fail validation when name is not a string', async () => {
            const dto = createDto({
                name: 123
            });
            const errors = await validateDto(dto);

            const nameErrors = errors.filter(error => error.property === 'name');
            expect(nameErrors).toHaveLength(1);
            expect(nameErrors[0].constraints?.isString).toBeDefined();
        });

        it('should fail validation when name is a boolean', async () => {
            const dto = createDto({
                name: true
            });
            const errors = await validateDto(dto);

            const nameErrors = errors.filter(error => error.property === 'name');
            expect(nameErrors).toHaveLength(1);
            expect(nameErrors[0].constraints?.isString).toBeDefined();
        });

        it('should fail validation when name is an array', async () => {
            const dto = createDto({
                name: ['Track Name']
            });
            const errors = await validateDto(dto);

            const nameErrors = errors.filter(error => error.property === 'name');
            expect(nameErrors).toHaveLength(1);
            expect(nameErrors[0].constraints?.isString).toBeDefined();
        });

        it('should fail validation when name is an object', async () => {
            const dto = createDto({
                name: { trackName: 'Advanced React' }
            });
            const errors = await validateDto(dto);

            const nameErrors = errors.filter(error => error.property === 'name');
            expect(nameErrors).toHaveLength(1);
            expect(nameErrors[0].constraints?.isString).toBeDefined();
        });

        it('should pass validation with whitespace-only name (IsNotEmpty allows whitespace)', async () => {
            const dto = createDto({
                name: '   '
            });
            const errors = await validateDto(dto);

            // IsNotEmpty allows whitespace-only strings
            expect(errors).toHaveLength(0);
        });

        it('should fail validation with special characters (NoSpecialChars validator active)', async () => {
            const dto = createDto({
                name: 'Advanced React @ 2024 #1 Course!'
            });
            const errors = await validateDto(dto);

            const nameErrors = errors.filter(error => error.property === 'name');
            expect(nameErrors).toHaveLength(1);
            expect(nameErrors[0].constraints?.NoSpecialChars).toBe(CustomErrorMessages.unallowedChars);
        });

        it('should pass validation with very long name (over 100 chars)', async () => {
            // Create a 150 character name
            const veryLongName = 'A'.repeat(150);
            const dto = createDto({
                name: veryLongName
            });
            const errors = await validateDto(dto);

            // No MaxLength validator, so this should pass
            expect(errors).toHaveLength(0);
        });
    });

    describe('edge cases and boundary conditions', () => {
        it('should handle names with leading and trailing whitespace', async () => {
            const dto = createDto({
                name: '  Advanced React Patterns  '
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should handle names with mixed whitespace characters', async () => {
            const dto = createDto({
                name: 'React\tTutorial\nAdvanced'
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should handle names with newline characters', async () => {
            const dto = createDto({
                name: 'Multi\nLine\nTrack\nName'
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should handle names with emoji and special unicode', async () => {
            const dto = createDto({
                name: '🚀 Advanced React Tutorial 💻'
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });
    });

    describe('validation combinations', () => {
        it('should validate proper track name updates', async () => {
            const validNames = [
                'JavaScript Basics',
                'React Advanced',
                'TypeScript Fundamentals',
                'Full Stack Development',
                'API Design Patterns'
            ];

            for (const name of validNames) {
                const dto = createDto({ name });
                const errors = await validateDto(dto);
                expect(errors).toHaveLength(0);
            }
        });

        it('should fail validation for names with special characters', async () => {
            const invalidNames = [
                'Node.js Development',  // Contains '.'
                'React@2024',          // Contains '@'
                'Vue#Framework',       // Contains '#'
                'Angular!Tutorial',    // Contains '!'
                'Express & Node'       // Contains '&'
            ];

            for (const name of invalidNames) {
                const dto = createDto({ name });
                const errors = await validateDto(dto);
                const nameErrors = errors.filter(error => error.property === 'name');
                expect(nameErrors.length).toBeGreaterThan(0);
                expect(nameErrors[0].constraints?.NoSpecialChars).toBe(CustomErrorMessages.unallowedChars);
            }
        });

        it('should fail validation for invalid inputs', async () => {
            const invalidInputs = [
                { name: '' },      // Empty string
                { name: null },    // Null
                { name: 123 },     // Number
                { name: true },    // Boolean
                { name: [] },      // Array
                { name: {} },      // Object
                {}                 // Missing property
            ];

            for (const invalidInput of invalidInputs) {
                const dto = createDto(invalidInput);
                const errors = await validateDto(dto);
                expect(errors.length).toBeGreaterThan(0);
            }
        });
    });
});