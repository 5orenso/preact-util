import preactUtil from '../../lib/preact-util';


describe('preactUtil.getWeeksInMonth', () => {
    test('should correctly calculate weeks for March 2021 starting on Monday', () => {
        const month = 3;
        const year = 2021;

        const weeks = preactUtil.getWeeksInMonth(month, year);

        expect(weeks).toHaveLength(5);

        expect(weeks[0]).toMatchObject({
            start: 1,
            end: 7,
            week: preactUtil.getWeek(new Date(year, month - 1, 1)),
            year: 2021,
        });

        expect(weeks[4]).toMatchObject({
            start: 29,
            end: 31,
            week: preactUtil.getWeek(new Date(year, month - 1, 29)),
            year: 2021,
        });
    });

    test('should correctly calculate weeks for August 2021 starting on Sunday', () => {
        const month = 8;
        const year = 2021;

        const weeks = preactUtil.getWeeksInMonth(month, year, 'sunday');

        expect(weeks).toHaveLength(5);

        expect(weeks[0]).toMatchObject({
            start: 1,
            end: 7,
            week: preactUtil.getWeek(new Date(year, month - 1, 1)),
            year: 2021,
        });

        expect(weeks[4]).toMatchObject({
            start: 29,
            end: 31,
            week: preactUtil.getWeek(new Date(year, month - 1, 29)),
            year: 2021,
        });
    });

    test('should correctly calculate weeks for February 2020 (leap year)', () => {
        const month = 2;
        const year = 2020;

        const weeks = preactUtil.getWeeksInMonth(month, year);

        expect(weeks).toHaveLength(5);

        expect(weeks[0]).toMatchObject({
            start: 1,
            end: 2,
            week: preactUtil.getWeek(new Date(year, month - 1, 1)),
            year: 2020,
        });

        expect(weeks[4]).toMatchObject({
            start: 24,
            end: 29,
            week: preactUtil.getWeek(new Date(year, month - 1, 24)),
            year: 2020,
        });
    });

    test('should correctly calculate weeks for December 2020', () => {
        const month = 12;
        const year = 2020;

        const weeks = preactUtil.getWeeksInMonth(month, year);

        expect(weeks).toHaveLength(5);

        expect(weeks[0]).toMatchObject({
            start: 1,
            end: 6,
            week: preactUtil.getWeek(new Date(year, month - 1, 1)),
            year: 2020,
        });

        expect(weeks[4]).toMatchObject({
            start: 28,
            end: 31,
            week: preactUtil.getWeek(new Date(year, month - 1, 28)),
            year: 2020,
        });
    });

    test('should correctly calculate weeks for May 2021 starting on Monday', () => {
        const month = 5;
        const year = 2021;

        const weeks = preactUtil.getWeeksInMonth(month, year);

        expect(weeks).toHaveLength(6);

        expect(weeks[0]).toMatchObject({
            start: 1,
            end: 2,
            week: preactUtil.getWeek(new Date(year, month - 1, 1)),
            year: 2021,
        });

        expect(weeks[5]).toMatchObject({
            start: 31,
            end: 31,
            week: preactUtil.getWeek(new Date(year, month - 1, 31)),
            year: 2021,
        });
    });

    test('should correctly populate daysInWeek for April 2021', () => {
        const month = 4;
        const year = 2021;

        const weeks = preactUtil.getWeeksInMonth(month, year);

        weeks.forEach(weekObj => {
            const { daysInWeek } = weekObj;

            expect(daysInWeek).toHaveLength(7);

            daysInWeek.forEach(date => {
                const dateMonth = date.getUTCMonth() + 1;
                const dateYear = date.getUTCFullYear();
                expect(dateYear).toBeGreaterThanOrEqual(year - 1);
                expect(dateYear).toBeLessThanOrEqual(year + 1);
                expect(dateMonth).toBeGreaterThanOrEqual(3);
                expect(dateMonth).toBeLessThanOrEqual(5);
            });
        });
    });

    test('should correctly calculate weeks for December 2024', () => {
        const month = 12; // December
        const year = 2024;

        const weeks = preactUtil.getWeeksInMonth(month, year);

        expect(weeks).toHaveLength(6);

        // Week 1: December 1, 2024 (Sunday)
        expect(weeks[0]).toMatchObject({
            start: 1,
            end: 1,
            week: preactUtil.getWeek(new Date(year, month - 1, 1)),
            year: 2024,
        });

        // Week 2: December 2 - December 8, 2024
        expect(weeks[1]).toMatchObject({
            start: 2,
            end: 8,
            week: 49,
            year: 2024,
        });

        // Week 3: December 9 - December 15, 2024
        expect(weeks[2]).toMatchObject({
            start: 9,
            end: 15,
            week: 50,
            year: 2024,
        });

        // Week 4: December 16 - December 22, 2024
        expect(weeks[3]).toMatchObject({
            start: 16,
            end: 22,
            week: 51,
            year: 2024,
        });

        // Week 5: December 23 - December 31, 2024
        expect(weeks[4]).toMatchObject({
            start: 23,
            end: 29,
            week: 52, // December 23-29 is week 52
            year: 2024,
        });

        // Week 6: December 30 - January 5, 2025
        expect(weeks[5]).toMatchObject({
            start: 30,
            end: 31,
            week: 1, // December 30 - January 5 is week 1 of 2025
            year: 2025,
        });

        // Verify that December 30-31 are in week 1 of 2025
        const lastWeekDays = weeks[5].daysInWeek;
        const lastWeekDayDates = lastWeekDays.map(date => ({
            date: date.getUTCDate(),
            month: date.getUTCMonth() + 1,
            year: date.getUTCFullYear(),
            week: preactUtil.getWeek(date),
        }));

        // Find December 30-31
        const dec30 = lastWeekDayDates.find(d => d.date === 30 && d.month === 12);
        const dec31 = lastWeekDayDates.find(d => d.date === 31 && d.month === 12);

        expect(dec30.week).toBe(1);
        expect(dec30.year).toBe(2024);


        expect(dec31.week).toBe(1);
        expect(dec31.year).toBe(2024);
    });

    test('should correctly calculate weeks for January 2025', () => {
        const month = 1; // January
        const year = 2025;

        const weeks = preactUtil.getWeeksInMonth(month, year);

        expect(weeks).toHaveLength(5);

        // Week 1: January 1 - January 5, 2025
        expect(weeks[0]).toMatchObject({
            start: 1,
            end: 5,
            week: 1,
            year: 2025,
        });

        // Week 2: January 6 - January 12, 2025
        expect(weeks[1]).toMatchObject({
            start: 6,
            end: 12,
            week: 2,
            year: 2025,
        });

        // Week 3: January 13 - January 19, 2025
        expect(weeks[2]).toMatchObject({
            start: 13,
            end: 19,
            week: 3,
            year: 2025,
        });

        // Week 4: January 20 - January 26, 2025
        expect(weeks[3]).toMatchObject({
            start: 20,
            end: 26,
            week: 4,
            year: 2025,
        });

        // Week 5: January 27 - January 31, 2025
        expect(weeks[4]).toMatchObject({
            start: 27,
            end: 31,
            week: 5,
            year: 2025,
        });

        // Verify that the first week includes December 30-31, 2024
        const firstWeekDays = weeks[0].daysInWeek.map(date => ({
            date: date.getUTCDate(),
            month: date.getUTCMonth() + 1,
            year: date.getUTCFullYear(),
        }));

        expect(firstWeekDays[0]).toEqual({
            date: 30,
            month: 12,
            year: 2024,
        });
        expect(firstWeekDays[1]).toEqual({
            date: 31,
            month: 12,
            year: 2024,
        });
        expect(firstWeekDays[2]).toEqual({
            date: 1,
            month: 1,
            year: 2025,
        });
    });
});