import preactUtil from '../../lib/preact-util';

describe('preactUtil.escapeEmail', () => {
    test('should replace disallowed characters with underscores', () => {
        const input = 'user@example.com';
        const expected = 'user_example_com';
        const result = preactUtil.escapeEmail(input);
        expect(result).toBe(expected);
    });

    test('should handle uppercase letters and special characters', () => {
        const input = 'User+123@Example.Com';
        const expected = 'User_123_Example_Com';
        const result = preactUtil.escapeEmail(input);
        expect(result).toBe(expected);
    });

    test('should return the same string if only allowed characters are present', () => {
        const input = 'abc123';
        const expected = 'abc123';
        const result = preactUtil.escapeEmail(input);
        expect(result).toBe(expected);
    });

    test('should return input as is if it is not a string', () => {
        const input = 12345;
        const result = preactUtil.escapeEmail(input);
        expect(result).toBe(input);
    });

    test('should handle empty string input', () => {
        const input = '';
        const expected = '';
        const result = preactUtil.escapeEmail(input);
        expect(result).toBe(expected);
    });
});


describe('preactUtil.padDate', () => {
    test('should pad single-digit numbers with a leading zero', () => {
        const input = 5;
        const expected = '05';
        const result = preactUtil.padDate(input);
        expect(result).toBe(expected);
    });

    test('should not pad double-digit numbers', () => {
        const input = 12;
        const expected = '12';
        const result = preactUtil.padDate(input);
        expect(result).toBe(expected);
    });

    test('should pad zero with an extra zero', () => {
        const input = 0;
        const expected = '00';
        const result = preactUtil.padDate(input);
        expect(result).toBe(expected);
    });

    test('should not pad negative single-digit numbers', () => {
        const input = -3;
        const expected = '-3';
        const result = preactUtil.padDate(input);
        expect(result).toBe(expected);
    });

    test('should handle numeric strings', () => {
        const input = '7';
        const expected = '07';
        const result = preactUtil.padDate(input);
        expect(result).toBe(expected);
    });
});


describe('preactUtil.parseInputDate', () => {
    test('should return the same date object if input is a valid date', () => {
        const input = new Date('2021-07-15');
        const result = preactUtil.parseInputDate(input);
        expect(result).toEqual(input);
    });

    test('should parse valid ISO date string', () => {
        const input = '2021-07-15';
        const result = preactUtil.parseInputDate(input);
        expect(result).toEqual(new Date('2021-07-15'));
    });

    test('should parse valid timestamp', () => {
        const input = 1626307200000; // July 15, 2021
        const result = preactUtil.parseInputDate(input);
        expect(result).toEqual(new Date(input));
    });
});


describe('preactUtil.isoDate', () => {
    test('should format date with default options', () => {
        const date = new Date('2021-07-15T15:30:45');
        const result = preactUtil.isoDate(date);
        expect(result).toBe('2021-07-15 15:30');
    });

    test('should show seconds when showSeconds is true', () => {
        const date = new Date('2021-07-15T15:30:45');
        const result = preactUtil.isoDate(date, true);
        expect(result).toBe('2021-07-15 15:30:45');
    });

    test('should show timezone when showTimezone is true', () => {
        const date = new Date('2021-07-15T15:30:45Z');
        const result = preactUtil.isoDate(date, false, true);
        expect(result).toBe('2021-07-15 17:30+120');
    });

    test('should show date only when showDateOnly is true', () => {
        const date = new Date('2021-07-15T15:30:45');
        const result = preactUtil.isoDate(date, false, false, true);
        expect(result).toBe('2021-07-15');
    });

    test('should use custom dateTimeSep when provided', () => {
        const date = new Date('2021-07-15T15:30:45');
        const result = preactUtil.isoDate(date, false, false, false, 'T');
        expect(result).toBe('2021-07-15T15:30');
    });

    // test('should return "n/a" for invalid date input', () => {
    //     const input = 'invalid-date';
    //     const result = preactUtil.isoDate(input);
    //     expect(result).toBe('n/a');
    // });

    test('should accept options object', () => {
        const date = new Date('2021-07-15T15:30:45');
        const options = { showSeconds: true, showTimezone: true };
        const result = preactUtil.isoDate(date, options);
        expect(result).toBe('2021-07-15 15:30:45+120');
    });
});


describe('preactUtil.isoDateCompact', () => {
    test('should format date with default options', () => {
        const date = new Date('2021-07-15T15:30:45');
        const result = preactUtil.isoDateCompact(date);
        expect(result).toBe('15/7 15:30');
    });

    test('should show seconds when showSeconds is true', () => {
        const date = new Date('2021-07-15T15:30:45');
        const result = preactUtil.isoDateCompact(date, true);
        expect(result).toBe('15/7 15:30:45');
    });

    test('should show timezone when showTimezone is true', () => {
        const date = new Date('2021-07-15T15:30:45Z');
        const result = preactUtil.isoDateCompact(date, false, true);
        expect(result).toBe('15/7 17:30+120');
    });

    test('should use custom dateTimeSep when provided', () => {
        const date = new Date('2021-07-15T15:30:45');
        const result = preactUtil.isoDateCompact(date, false, false, 'T');
        expect(result).toBe('15/7T15:30');
    });

    // test('should return "n/a" for invalid date input', () => {
    //     const input = 'invalid-date';
    //     const result = preactUtil.isoDateCompact(input);
    //     expect(result).toBe('n/a');
    // });

    test('should accept options object', () => {
        const date = new Date('2021-07-15T15:30:45');
        const options = { showSeconds: true, showTimezone: true };
        const result = preactUtil.isoDateCompact(date, options);
        expect(result).toBe('15/7 15:30:45+120');
    });
});


describe('preactUtil.isoTime', () => {
    test('should format time with default options', () => {
        const date = new Date('2021-07-15T15:30:45');
        const result = preactUtil.isoTime(date);
        expect(result).toBe('15:30');
    });

    test('should show seconds when showSeconds is true', () => {
        const date = new Date('2021-07-15T15:30:45');
        const result = preactUtil.isoTime(date, true);
        expect(result).toBe('15:30:45');
    });

    test('should show timezone when showTimezone is true', () => {
        const date = new Date('2021-07-15T15:30:45Z');
        const result = preactUtil.isoTime(date, false, true);
        expect(result).toBe('17:30+120');
    });

    // test('should return "n/a" for invalid date input', () => {
    //     const input = 'invalid-date';
    //     const result = preactUtil.isoTime(input);
    //     expect(result).toBe('n/a');
    // });
});


describe('preactUtil.validRange', () => {
    test('should return the value when it is within the range', () => {
        expect(preactUtil.validRange(5, 1, 10)).toBe(5);
    });

    test('should return min when value is below min', () => {
        expect(preactUtil.validRange(-5, 0, 10)).toBe(0);
    });

    test('should return max when value is above max', () => {
        expect(preactUtil.validRange(15, 0, 10)).toBe(10);
    });

    test('should return min when value is equal to min', () => {
        expect(preactUtil.validRange(0, 0, 10)).toBe(0);
    });

    test('should return max when value is equal to max', () => {
        expect(preactUtil.validRange(10, 0, 10)).toBe(10);
    });

    test('should handle when min is greater than max', () => {
        expect(preactUtil.validRange(5, 10, 0)).toBe(0);
    });
});


describe('preactUtil.range', () => {
    test('should generate range with default step', () => {
        expect(preactUtil.range(1, 5)).toEqual([1, 2, 3, 4, 5]);
    });

    test('should generate range with custom step', () => {
        expect(preactUtil.range(0, 10, 2)).toEqual([0, 2, 4, 6, 8, 10]);
    });

    test('should return empty array when start is greater than end', () => {
        expect(preactUtil.range(5, 1)).toEqual([]);
    });

    test('should handle negative step (though function may not support it)', () => {
        expect(preactUtil.range(10, 0, -2)).toEqual([]);
    });

    // test('should handle zero step by throwing an error', () => {
    //     expect(() => {
    //         preactUtil.range(1, 5, 0);
    //     }).toThrow('Step cannot be zero');
    // });
});


describe('preactUtil.monthRange', () => {
    test('should return array with single month for same month and year', () => {
        const result = preactUtil.monthRange('2021-07-01', '2021-07-31');
        expect(result).toEqual([{ month: 7, year: 2021 }]);
    });

    test('should return months within same year', () => {
        const result = preactUtil.monthRange('2021-01-01', '2021-03-31');
        expect(result).toEqual([
            { month: 1, year: 2021 },
            { month: 2, year: 2021 },
            { month: 3, year: 2021 },
        ]);
    });

    test('should return months across different years', () => {
        const result = preactUtil.monthRange('2020-11-01', '2021-02-28');
        expect(result).toEqual([
            { month: 11, year: 2020 },
            { month: 12, year: 2020 },
            { month: 1, year: 2021 },
            { month: 2, year: 2021 },
        ]);
    });

    // test('should throw error for invalid start date', () => {
    //     expect(() => {
    //         preactUtil.monthRange('invalid-date', '2021-02-28');
    //     }).toThrow('Invalid Date');
    // });
});


describe('preactUtil.weekRange', () => {
    test('should return single week when start and end are in the same week', () => {
        const result = preactUtil.weekRange('2021-07-12', '2021-07-18');
        expect(result).toEqual([{ week: 28, year: 2021 }]);
    });

    test('should return multiple weeks within the same year', () => {
        const result = preactUtil.weekRange('2021-07-01', '2021-07-31');
        expect(result).toEqual([
            { week: 26, year: 2021 },
            { week: 27, year: 2021 },
            { week: 28, year: 2021 },
            { week: 29, year: 2021 },
            { week: 30, year: 2021 },
        ]);
    });

    test('should return weeks across different years', () => {
        const result = preactUtil.weekRange('2020-12-28', '2021-01-10');
        expect(result).toEqual([
            { week: 53, year: 2020 },
            { week: 53, year: 2021 },
            { week: 1, year: 2021 },
        ]);
    });

    // test('should throw error for invalid dates', () => {
    //     expect(() => {
    //         preactUtil.weekRange('invalid-date', '2021-01-10');
    //     }).toThrow('Invalid Date');
    // });
});


describe('preactUtil.dayRange', () => {
    test('should return single day when start and end are the same', () => {
        const result = preactUtil.dayRange('2021-07-15', '2021-07-15');
        expect(result).toEqual([
            {
                dow: 4, // Thursday
                year: 2021,
                week: expect.any(Number),
                day: 15,
                month: 7,
            },
        ]);
    });

    test('should return days within the same week', () => {
        const result = preactUtil.dayRange('2021-07-12', '2021-07-18');
        expect(result).toHaveLength(7);
        expect(result[0]).toMatchObject({ day: 12, month: 7 });
        expect(result[6]).toMatchObject({ day: 18, month: 7 });
    });

    test('should return days across months', () => {
        const result = preactUtil.dayRange('2021-07-30', '2021-08-02');
        expect(result).toHaveLength(4);
        expect(result[0]).toMatchObject({ day: 30, month: 7 });
        expect(result[3]).toMatchObject({ day: 2, month: 8 });
    });

    // test('should throw error for invalid dates', () => {
    //     expect(() => {
    //         preactUtil.dayRange('invalid-date', '2021-07-15');
    //     }).toThrow('Invalid Date');
    // });
});


describe('preactUtil.hourRange', () => {
    test('should return single hour when start and end are the same', () => {
        const result = preactUtil.hourRange('2021-07-15T12:00:00', '2021-07-15T12:00:00');
        expect(result).toEqual([
            {
                dow: 4, // Thursday
                hour: 12,
                day: 15,
                month: 7,
                year: 2021,
                week: expect.any(Number),
            },
        ]);
    });

    test('should return multiple hours within the same day', () => {
        const result = preactUtil.hourRange('2021-07-15T10:00:00', '2021-07-15T14:00:00');
        expect(result).toHaveLength(5);
        expect(result[0]).toMatchObject({ hour: 10, day: 15, month: 7 });
        expect(result[4]).toMatchObject({ hour: 14, day: 15, month: 7 });
    });

    test('should return hours across days', () => {
        const result = preactUtil.hourRange('2021-07-15T22:00:00', '2021-07-16T02:00:00');
        expect(result).toHaveLength(5);
        expect(result[0]).toMatchObject({ hour: 22, day: 15 });
        expect(result[4]).toMatchObject({ hour: 2, day: 16 });
    });

    // test('should throw error for invalid dates', () => {
    //     expect(() => {
    //         preactUtil.hourRange('invalid-date', '2021-07-15T12:00:00');
    //     }).toThrow('Invalid Date');
    // });
});


describe('preactUtil.getWeek', () => {
    test('should return correct week number for a given date', () => {
        const date = '2021-07-12'; // Monday
        const weekNumber = preactUtil.getWeek(date);
        expect(weekNumber).toBe(28);
    });

    test('should return correct week number for a given date', () => {
        const date = '2021-07-18'; // Monday
        const weekNumber = preactUtil.getWeek(date);
        expect(weekNumber).toBe(28);
    });

    test('should return correct week number for end of the year', () => {
        const date = '2021-12-31'; // Friday
        const weekNumber = preactUtil.getWeek(date);
        // Verify if it's week 52 or 53 depending on the year
        expect(weekNumber).toBe(52);
    });
});


describe('preactUtil.normalizeBetween', () => {
    test('should scale value from original range to new range (basic scaling)', () => {
        const result = preactUtil.normalizeBetween(5, 0, 10, 0, 100);
        expect(result).toBe(50);
    });

    test('should map minimum value to new minimum', () => {
        const result = preactUtil.normalizeBetween(0, 0, 10, 20, 80);
        expect(result).toBe(20);
    });

    test('should map maximum value to new maximum', () => {
        const result = preactUtil.normalizeBetween(10, 0, 10, 20, 80);
        expect(result).toBe(80);
    });

    test('should handle value below original range', () => {
        const result = preactUtil.normalizeBetween(-5, 0, 10, 0, 100);
        expect(result).toBe(-50);
    });

    test('should handle value above original range', () => {
        const result = preactUtil.normalizeBetween(15, 0, 10, 0, 100);
        expect(result).toBe(150);
    });

    test('should scale negative ranges correctly', () => {
        const result = preactUtil.normalizeBetween(-5, -10, 0, 0, 100);
        expect(result).toBe(50);
    });

    test('should handle zero division when minVal equals maxVal', () => {
        expect(() => {
            preactUtil.normalizeBetween(5, 5, 5, 0, 100);
        }).toThrow('Division by zero error: minVal and maxVal cannot be equal.');
    });

    test('should cap value at absMax if provided and exceeded', () => {
        const result = preactUtil.normalizeBetween(15, 0, 10, 0, 100, 90);
        expect(result).toBe(90);
    });

    test('should not cap value if absMax is not exceeded', () => {
        const result = preactUtil.normalizeBetween(5, 0, 10, 0, 100, 90);
        expect(result).toBe(50);
    });

    test('should return calculated value if absMax is undefined', () => {
        const result = preactUtil.normalizeBetween(15, 0, 10, 0, 100);
        expect(result).toBe(150);
    });

    test('should handle floating point precision', () => {
        const result = preactUtil.normalizeBetween(0.1, 0, 1, 0, 10);
        expect(result).toBeCloseTo(1, 5);
    });

    test('should throw error for non-numeric inputs', () => {
        expect(() => {
            preactUtil.normalizeBetween('a', 0, 10, 0, 100);
        }).toThrow('Invalid input: all parameters must be numbers.');
    });
});