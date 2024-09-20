import preactUtil from '../../lib/preact-util';

describe('preactUtil.getDaysInWeek', () => {
    test('should return correct dates for week 1 of 2021', () => {
        const week = 1;
        const year = 2021;

        const days = preactUtil.getDaysInWeek(week, year);

        const expectedDates = [
            '2021-01-04',
            '2021-01-05',
            '2021-01-06',
            '2021-01-07',
            '2021-01-08',
            '2021-01-09',
            '2021-01-10',
        ];

        expect(days).toHaveLength(7);
        days.forEach((date, index) => {
            const dateString = date.toISOString().split('T')[0];
            expect(dateString).toBe(expectedDates[index]);
        });
    });

    test('should return correct dates for week 53 of 2020', () => {
        const week = 53;
        const year = 2020;

        const days = preactUtil.getDaysInWeek(week, year);

        const expectedDates = [
            '2020-12-28',
            '2020-12-29',
            '2020-12-30',
            '2020-12-31',
            '2021-01-01',
            '2021-01-02',
            '2021-01-03',
        ];

        expect(days).toHaveLength(7);
        days.forEach((date, index) => {
            const dateString = date.toISOString().split('T')[0];
            expect(dateString).toBe(expectedDates[index]);
        });
    });

    test('should return correct dates for week 1 of 2020', () => {
        const week = 1;
        const year = 2020;

        const days = preactUtil.getDaysInWeek(week, year);

        const expectedDates = [
            '2019-12-30',
            '2019-12-31',
            '2020-01-01',
            '2020-01-02',
            '2020-01-03',
            '2020-01-04',
            '2020-01-05',
        ];

        expect(days).toHaveLength(7);
        days.forEach((date, index) => {
            const dateString = date.toISOString().split('T')[0];
            expect(dateString).toBe(expectedDates[index]);
        });
    });

    test('should return correct dates for week 52 of 2021', () => {
        const week = 52;
        const year = 2021;

        const days = preactUtil.getDaysInWeek(week, year);

        const expectedDates = [
            '2021-12-27',
            '2021-12-28',
            '2021-12-29',
            '2021-12-30',
            '2021-12-31',
            '2022-01-01',
            '2022-01-02',
        ];

        expect(days).toHaveLength(7);
        days.forEach((date, index) => {
            const dateString = date.toISOString().split('T')[0];
            expect(dateString).toBe(expectedDates[index]);
        });
    });
});