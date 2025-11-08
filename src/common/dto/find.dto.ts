import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindDto {
    @IsOptional()
    @IsString()
    q?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    pageNumber?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    pageSize?: number;
}
