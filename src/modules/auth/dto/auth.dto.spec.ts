

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CustomErrorMessages } from '../../../common/enums/custom-error-messages.enum';
import { AuthDto } from './auth.dto';

describe('AuthDto', () => {
    const createDto = (data: any): AuthDto => {
        return plainToInstance(AuthDto, data);
    };

    const validateDto = async (dto: AuthDto) => {
        return await validate(dto);
    };

    describe('email property', () => {
        it('should pass validation with valid email string', async () => {
            const dto = createDto({
                email: 'user@example.com',
                password: 'password123'
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should fail validation when email is empty string', async () => {
            const dto = createDto({
                email: '',
                password: 'password123'
            });
            const errors = await validateDto(dto);

            const emailErrors = errors.filter(error => error.property === 'email');
            expect(emailErrors).toHaveLength(1);
            expect(emailErrors[0].constraints?.isNotEmpty).toBe(CustomErrorMessages.emailIsRequired);
        });

        it('should fail validation when email is undefined', async () => {
            const dto = createDto({
                password: 'password123'
            });
            const errors = await validateDto(dto);

            const emailErrors = errors.filter(error => error.property === 'email');
            expect(emailErrors).toHaveLength(1);
            expect(emailErrors[0].constraints?.isNotEmpty).toBe(CustomErrorMessages.emailIsRequired);
        });

        it('should fail validation when email is null', async () => {
            const dto = createDto({
                email: null,
                password: 'password123'
            });
            const errors = await validateDto(dto);

            const emailErrors = errors.filter(error => error.property === 'email');
            expect(emailErrors).toHaveLength(1);
            expect(emailErrors[0].constraints?.isNotEmpty).toBe(CustomErrorMessages.emailIsRequired);
        });

        it('should fail validation when email is not a string', async () => {
            const dto = createDto({
                email: 123,
                password: 'password123'
            });
            const errors = await validateDto(dto);

            const emailErrors = errors.filter(error => error.property === 'email');
            expect(emailErrors).toHaveLength(1);
            expect(emailErrors[0].constraints?.isString).toBeDefined();
        });

        it('should pass validation with any string format (no email format validation)', async () => {
            const dto = createDto({
                email: 'not-an-email-format',
                password: 'password123'
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });
    });

    describe('password property', () => {
        it('should pass validation with valid password string', async () => {
            const dto = createDto({
                email: 'user@example.com',
                password: 'mypassword123'
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should fail validation when password is empty string', async () => {
            const dto = createDto({
                email: 'user@example.com',
                password: ''
            });
            const errors = await validateDto(dto);

            const passwordErrors = errors.filter(error => error.property === 'password');
            expect(passwordErrors).toHaveLength(1);
            expect(passwordErrors[0].constraints?.isNotEmpty).toBe(CustomErrorMessages.passwordIsRequired);
        });

        it('should fail validation when password is undefined', async () => {
            const dto = createDto({
                email: 'user@example.com'
            });
            const errors = await validateDto(dto);

            const passwordErrors = errors.filter(error => error.property === 'password');
            expect(passwordErrors).toHaveLength(1);
            expect(passwordErrors[0].constraints?.isNotEmpty).toBe(CustomErrorMessages.passwordIsRequired);
        });

        it('should fail validation when password is null', async () => {
            const dto = createDto({
                email: 'user@example.com',
                password: null
            });
            const errors = await validateDto(dto);

            const passwordErrors = errors.filter(error => error.property === 'password');
            expect(passwordErrors).toHaveLength(1);
            expect(passwordErrors[0].constraints?.isNotEmpty).toBe(CustomErrorMessages.passwordIsRequired);
        });

        it('should fail validation when password is not a string', async () => {
            const dto = createDto({
                email: 'user@example.com',
                password: 123456
            });
            const errors = await validateDto(dto);

            const passwordErrors = errors.filter(error => error.property === 'password');
            expect(passwordErrors).toHaveLength(1);
            expect(passwordErrors[0].constraints?.isString).toBeDefined();
        });

        it('should pass validation with any string password (no length validation)', async () => {
            const dto = createDto({
                email: 'user@example.com',
                password: 'a'
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });
    });

    describe('combined validation', () => {
        it('should pass validation with both valid properties', async () => {
            const dto = createDto({
                email: 'admin@example.com',
                password: 'securepassword123'
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should fail validation when both properties are missing', async () => {
            const dto = createDto({});
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(2);

            const propertyNames = errors.map(error => error.property);
            expect(propertyNames).toContain('email');
            expect(propertyNames).toContain('password');
        });

        it('should fail validation when both properties are empty strings', async () => {
            const dto = createDto({
                email: '',
                password: ''
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(2);

            const emailError = errors.find(error => error.property === 'email');
            const passwordError = errors.find(error => error.property === 'password');

            expect(emailError?.constraints?.isNotEmpty).toBe(CustomErrorMessages.emailIsRequired);
            expect(passwordError?.constraints?.isNotEmpty).toBe(CustomErrorMessages.passwordIsRequired);
        });

        it('should fail validation when both properties have wrong types', async () => {
            const dto = createDto({
                email: 123,
                password: 456
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(2);

            const propertyNames = errors.map(error => error.property);
            expect(propertyNames).toContain('email');
            expect(propertyNames).toContain('password');

            errors.forEach(error => {
                expect(error.constraints?.isString).toBeDefined();
            });
        });
    });
});