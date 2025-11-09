import { parseISO8601ToSeconds } from './time.helper';

describe('TimeHelper', () => {
    describe('parseISO8601ToSeconds', () => {
        it('should parse duration with hours, minutes, and seconds', () => {
            const duration = 'PT1H30M45S'; // 1 hour, 30 minutes, 45 seconds
            const result = parseISO8601ToSeconds(duration);

            expect(result).toBe(5445); // 3600 + 1800 + 45 = 5445
        });

        it('should parse duration with only minutes and seconds', () => {
            const duration = 'PT5M30S'; // 5 minutes, 30 seconds
            const result = parseISO8601ToSeconds(duration);

            expect(result).toBe(330); // 300 + 30 = 330
        });

        it('should parse duration with only seconds', () => {
            const duration = 'PT45S'; // 45 seconds
            const result = parseISO8601ToSeconds(duration);

            expect(result).toBe(45);
        });

        it('should parse duration with only hours', () => {
            const duration = 'PT2H'; // 2 hours
            const result = parseISO8601ToSeconds(duration);

            expect(result).toBe(7200); // 2 * 3600 = 7200
        });

        it('should parse duration with only minutes', () => {
            const duration = 'PT15M'; // 15 minutes
            const result = parseISO8601ToSeconds(duration);

            expect(result).toBe(900); // 15 * 60 = 900
        });

        it('should parse duration with hours and minutes only', () => {
            const duration = 'PT2H30M'; // 2 hours, 30 minutes
            const result = parseISO8601ToSeconds(duration);

            expect(result).toBe(9000); // 7200 + 1800 = 9000
        });

        it('should parse empty duration (PT)', () => {
            const duration = 'PT'; // No time specified
            const result = parseISO8601ToSeconds(duration);

            expect(result).toBe(0);
        });

        it('should handle invalid format gracefully', () => {
            const duration = 'invalid-format';
            const result = parseISO8601ToSeconds(duration);

            expect(result).toBe(0); // Should return 0 for invalid input
        });
    });
});