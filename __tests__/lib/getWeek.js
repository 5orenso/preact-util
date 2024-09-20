import preactUtil from '../../lib/preact-util';

describe('preactUtil.getWeek', () => {
    beforeAll(() => {
        // Mock preactUtil.isUndefined if necessary
        preactUtil.isUndefined = jest.fn(value => value === undefined);
        // Mock preactUtil.parseInputDate to simply return the input if it's a Date, or parse it
        preactUtil.parseInputDate = jest.fn(input => {
            if (input instanceof Date) return input;
            return new Date(input);
        });
    });

    test('should return correct week number for June 15, 2021', () => {
        const date = new Date(2021, 5, 15);
        const weekNumber = preactUtil.getWeek(date);

        expect(weekNumber).toBe(24);
    });

    test('should return correct week number for January 1, 2021', () => {
        const date = new Date(2021, 0, 1);
        const weekNumber = preactUtil.getWeek(date);

        expect(weekNumber).toBe(53);
    });

    test('should return correct week number for December 31, 2021', () => {
        const date = new Date(2021, 11, 31);
        const weekNumber = preactUtil.getWeek(date);

        expect(weekNumber).toBe(52);
    });

    test('should return correct week number for February 29, 2020', () => {
        const date = new Date(2020, 1, 29);
        const weekNumber = preactUtil.getWeek(date);

        expect(weekNumber).toBe(9);
    });

    test('should throw an error for invalid date input', () => {
        const invalidDate = 'invalid-date-string';

        preactUtil.parseInputDate = jest.fn(() => {
            throw new Error('Invalid Date');
        });

        expect(() => {
            preactUtil.getWeek(invalidDate);
        }).toThrow('Invalid Date');
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });
});
