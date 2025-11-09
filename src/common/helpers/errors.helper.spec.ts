import { BadRequestException, ConflictException, ForbiddenException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { buildDbErrorMessage, handleHttpError } from './errors.helper';

describe('ErrorsHelper', () => {
    describe('handleHttpError', () => {
        it('should throw BadRequestException for status code 400', () => {
            const message = 'Bad request message';
            expect(() => handleHttpError(400, message)).toThrow(new BadRequestException(message));
        });

        it('should throw ForbiddenException for status code 403', () => {
            const message = 'Access forbidden';
            expect(() => handleHttpError(403, message)).toThrow(new ForbiddenException(message));
        });

        it('should throw NotFoundException for status code 404', () => {
            const message = 'Resource not found';
            expect(() => handleHttpError(404, message)).toThrow(new NotFoundException(message));
        });

        it('should throw ConflictException for status code 409', () => {
            const message = 'Resource conflict';
            expect(() => handleHttpError(409, message)).toThrow(new ConflictException(message));
        });

        it('should throw InternalServerErrorException for unknown status codes', () => {
            expect(() => handleHttpError(500)).toThrow(new InternalServerErrorException('Unexpected error occurred'));
        });

        it('should work without message parameter (message is optional)', () => {
            expect(() => handleHttpError(400)).toThrow(BadRequestException);
            expect(() => handleHttpError(403)).toThrow(ForbiddenException);
            expect(() => handleHttpError(404)).toThrow(NotFoundException);
            expect(() => handleHttpError(409)).toThrow(ConflictException);
        });
    });

    describe('buildDbErrorMessage', () => {
        it('should format QueryFailedError correctly', () => {
            const mockError = new QueryFailedError('SELECT * FROM users', [], new Error('Connection timeout'));
            const result = buildDbErrorMessage(mockError);

            expect(result).toBe('QueryFailedError - Connection timeout');
        });

        it('should return message for regular Error objects', () => {
            const standardError = new Error('Standard error message');
            const result = buildDbErrorMessage(standardError);

            expect(result).toBe('Standard error message');
        });

        it('should return empty string for null or undefined input', () => {
            expect(buildDbErrorMessage(null)).toBe('');
            expect(buildDbErrorMessage(undefined)).toBe('');
        });
    });
});