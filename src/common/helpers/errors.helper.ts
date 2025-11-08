import { BadRequestException, ConflictException, ForbiddenException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { QueryFailedError } from "typeorm";

export const handleHttpError = (statusCode: number, message?: string) => {
    switch (statusCode) {
        case 400:
            throw new BadRequestException(message)
        case 403:
            throw new ForbiddenException(message)
        case 404:
            throw new NotFoundException(message)
        case 409:
            throw new ConflictException(message)
        default:
            throw new InternalServerErrorException('Unexpected error occurred');
    }
}

export const buildDbErrorMessage = (error: QueryFailedError | string) => {
    if (error instanceof QueryFailedError) return `${error.name} - ${error.message}`
    return error
}