import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/pagination.const';

export class FindDto {
    @ApiPropertyOptional({
        description: 'Search query string',
        example: 'javascript'
    })
    @IsOptional()
    @IsString()
    _q?: string;

    @ApiPropertyOptional({
        description: 'Page number for pagination',
        minimum: 1,
        default: DEFAULT_PAGE,
        example: 1
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    _pageNumber?: number;

    @ApiPropertyOptional({
        description: 'Number of items per page',
        minimum: 1,
        default: DEFAULT_PAGE_SIZE,
        example: 10
    })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    _pageSize?: number;
}
