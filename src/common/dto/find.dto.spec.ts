import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { FindDto } from './find.dto';

describe('FindDto', () => {
    const createDto = (data: any): FindDto => {
        return plainToInstance(FindDto, data);
    };

    const validateDto = async (dto: FindDto) => {
        return await validate(dto);
    };

    describe('_q property', () => {
        it('should pass validation with valid string query', async () => {
            const dto = createDto({ _q: 'javascript' });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should pass validation when _q is undefined (optional)', async () => {
            const dto = createDto({});
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should fail validation when _q is not a string', async () => {
            const dto = createDto({ _q: 123 });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(1);
            expect(errors[0].property).toBe('_q');
            expect(errors[0].constraints?.isString).toBeDefined();
        });
    });

    describe('_pageNumber property', () => {
        it('should pass validation with valid page number', async () => {
            const dto = createDto({ _pageNumber: 5 });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should pass validation when _pageNumber is undefined (optional)', async () => {
            const dto = createDto({});
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should transform string to number', async () => {
            const dto = createDto({ _pageNumber: '3' });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
            expect(dto._pageNumber).toBe(3);
            expect(typeof dto._pageNumber).toBe('number');
        });

        it('should fail validation when _pageNumber is less than 1', async () => {
            const dto = createDto({ _pageNumber: 0 });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(1);
            expect(errors[0].property).toBe('_pageNumber');
            expect(errors[0].constraints?.min).toBeDefined();
        });

        it('should fail validation when _pageNumber is negative', async () => {
            const dto = createDto({ _pageNumber: -1 });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(1);
            expect(errors[0].property).toBe('_pageNumber');
            expect(errors[0].constraints?.min).toBeDefined();
        });

        it('should fail validation when _pageNumber is not a number', async () => {
            const dto = createDto({ _pageNumber: 'not-a-number' });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(1);
            expect(errors[0].property).toBe('_pageNumber');
            expect(errors[0].constraints?.isNumber).toBeDefined();
        });
    });

    describe('_pageSize property', () => {
        it('should pass validation with valid page size', async () => {
            const dto = createDto({ _pageSize: 10 });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should pass validation when _pageSize is undefined (optional)', async () => {
            const dto = createDto({});
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should transform string to number', async () => {
            const dto = createDto({ _pageSize: '25' });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
            expect(dto._pageSize).toBe(25);
            expect(typeof dto._pageSize).toBe('number');
        });

        it('should fail validation when _pageSize is less than 1', async () => {
            const dto = createDto({ _pageSize: 0 });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(1);
            expect(errors[0].property).toBe('_pageSize');
            expect(errors[0].constraints?.min).toBeDefined();
        });

        it('should fail validation when _pageSize is negative', async () => {
            const dto = createDto({ _pageSize: -5 });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(1);
            expect(errors[0].property).toBe('_pageSize');
            expect(errors[0].constraints?.min).toBeDefined();
        });

        it('should fail validation when _pageSize is not a number', async () => {
            const dto = createDto({ _pageSize: 'invalid' });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(1);
            expect(errors[0].property).toBe('_pageSize');
            expect(errors[0].constraints?.isNumber).toBeDefined();
        });
    });

    describe('combined validation', () => {
        it('should pass validation with all valid properties', async () => {
            const dto = createDto({
                _q: 'react tutorial',
                _pageNumber: 2,
                _pageSize: 15
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
        });

        it('should fail validation with multiple invalid properties', async () => {
            const dto = createDto({
                _q: 123,
                _pageNumber: 0,
                _pageSize: -1
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(3);

            const propertyNames = errors.map(error => error.property);
            expect(propertyNames).toContain('_q');
            expect(propertyNames).toContain('_pageNumber');
            expect(propertyNames).toContain('_pageSize');
        });

        it('should transform string numbers correctly while validating', async () => {
            const dto = createDto({
                _q: 'javascript',
                _pageNumber: '3',
                _pageSize: '20'
            });
            const errors = await validateDto(dto);

            expect(errors).toHaveLength(0);
            expect(dto._pageNumber).toBe(3);
            expect(dto._pageSize).toBe(20);
        });
    });
});