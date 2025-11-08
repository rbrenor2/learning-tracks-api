import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindDto {
    @IsOptional()
    @IsString()
    _q?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    _pageNumber?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    _pageSize?: number;
}
