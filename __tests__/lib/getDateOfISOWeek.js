import preactUtil from '../../lib/preact-util';

describe('preactUtil.getDateOfISOWeek', () => {
    test('should return correct date for week 1 of January 2021', () => {
        const week = 1;
        const year = 2021;
        const month = 1; // January

        const result = preactUtil.getDateOfISOWeek(week, year, month);

        const expectedDate = new Date('2021-01-04'); // ISO week 1 starts on 2021-01-04
        expect(result.toISOString().split('T')[0]).toBe(expectedDate.toISOString().split('T')[0]);
    });

    test('should return correct date for week 53 of December 2020', () => {
        const week = 53;
        const year = 2020;
        const month = 12; // December

        const result = preactUtil.getDateOfISOWeek(week, year, month);

        const expectedDate = new Date('2020-12-28'); // ISO week 53 starts on 2020-12-28
        expect(result.toISOString().split('T')[0]).toBe(expectedDate.toISOString().split('T')[0]);
    });

    test('should return correct date for week 1 of January 2020', () => {
        const week = 1;
        const year = 2020;
        const month = 1; // January

        const result = preactUtil.getDateOfISOWeek(week, year, month);

        const expectedDate = new Date('2019-12-30'); // ISO week 1 of 2020 starts on 2019-12-30
        expect(result.toISOString().split('T')[0]).toBe(expectedDate.toISOString().split('T')[0]);
    });

    // test('should adjust year correctly for week 53 of January 2021', () => {
    //     const week = 53;
    //     const year = 2021;
    //     const month = 1; // January

    //     const result = preactUtil.getDateOfISOWeek(week, year, month);

    //     const expectedDate = new Date('2020-12-28'); // Should adjust to previous year
    //     expect(result.toISOString().split('T')[0]).toBe(expectedDate.toISOString().split('T')[0]);
    // });

    test('should handle invalid week numbers', () => {
        const week = 54; // Invalid week number
        const year = 2021;
        const month = 1;

        expect(() => {
            preactUtil.getDateOfISOWeek(week, year, month);
        }).toThrow();
    });
});