import { BadRequestException, ForbiddenException, InternalServerErrorException, NotFoundException } from "@nestjs/common";

export const handleHttpError = (statusCode: number, message: string) => {
    switch (statusCode) {
        case 400:
            throw new BadRequestException(message)
        case 403:
            throw new ForbiddenException(message)
        case 404:
            throw new NotFoundException(message)
        default:
            throw new InternalServerErrorException('Unexpected error occurred');
    }
}