import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/pagination.const';
import { buildPaginationOptions } from './pagination.helper';

describe('PaginationHelper', () => {
    describe('buildPaginationOptions', () => {
        it('should use default values when no parameters provided', () => {
            const result = buildPaginationOptions({});

            expect(result).toEqual({
                take: DEFAULT_PAGE_SIZE,
                skip: DEFAULT_PAGE * DEFAULT_PAGE_SIZE, // 0 * 5 = 0
            });
        });

        it('should use default page when only pageSize provided', () => {
            const pageSize = 10;
            const result = buildPaginationOptions({ pageSize });

            expect(result).toEqual({
                take: pageSize,
                skip: DEFAULT_PAGE * pageSize, // 0 * 10 = 0
            });
        });

        it('should use default pageSize when only pageNumber provided', () => {
            const pageNumber = 2;
            const result = buildPaginationOptions({ pageNumber });

            expect(result).toEqual({
                take: DEFAULT_PAGE_SIZE,
                skip: pageNumber * DEFAULT_PAGE_SIZE, // 2 * 5 = 10
            });
        });

        it('should calculate skip and take correctly with custom values', () => {
            const pageSize = 20;
            const pageNumber = 3;
            const result = buildPaginationOptions({ pageSize, pageNumber });

            expect(result).toEqual({
                take: pageSize,
                skip: pageNumber * pageSize, // 3 * 20 = 60
            });
        });

        it('should handle first page correctly (page 0)', () => {
            const pageSize = 15;
            const pageNumber = 0;
            const result = buildPaginationOptions({ pageSize, pageNumber });

            expect(result).toEqual({
                take: pageSize,
                skip: 0, // 0 * 15 = 0
            });
        });

        it('should handle edge case with pageSize 1', () => {
            const pageSize = 1;
            const pageNumber = 5;
            const result = buildPaginationOptions({ pageSize, pageNumber });

            expect(result).toEqual({
                take: pageSize,
                skip: 5, // 5 * 1 = 5
            });
        });
    });
});