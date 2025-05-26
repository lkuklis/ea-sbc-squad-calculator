const { SBCRatingCalculator, SolverHelper, calculateSquadSolutions } = require('../src/index.js');

describe('SBCRatingCalculator', () => {
    let calculator;

    beforeEach(() => {
        calculator = new SBCRatingCalculator();
    });

    describe('calculateTeamRating', () => {
        describe('Edge Cases', () => {
            test('should return 0 for empty array', () => {
                const result = calculator.calculateTeamRating([]);
                expect(result).toBe(0);
            });

            test('should return 0 for null input', () => {
                const result = calculator.calculateTeamRating(null);
                expect(result).toBe(0);
            });

            test('should return 0 for undefined input', () => {
                const result = calculator.calculateTeamRating(undefined);
                expect(result).toBe(0);
            });
        });

        describe('Single Player Scenarios', () => {
            test('should calculate rating for single players correctly', () => {
                expect(calculator.calculateTeamRating([45])).toBe(7);
                expect(calculator.calculateTeamRating([60])).toBe(10);
                expect(calculator.calculateTeamRating([63])).toBe(10);
                expect(calculator.calculateTeamRating([70])).toBe(12);
                expect(calculator.calculateTeamRating([75])).toBe(13);
                expect(calculator.calculateTeamRating([85])).toBe(14);
                expect(calculator.calculateTeamRating([87])).toBe(15);
                expect(calculator.calculateTeamRating([99])).toBe(17);
            });
        });

        describe('Multiple Player Scenarios', () => {
            test('should calculate rating for two players', () => {
                expect(calculator.calculateTeamRating([87, 87])).toBe(28);
                expect(calculator.calculateTeamRating([85, 85])).toBe(28);
                expect(calculator.calculateTeamRating([90, 90])).toBe(29);
            });

            test('should calculate rating for verified EA examples', () => {
                expect(calculator.calculateTeamRating([85, 86, 87, 96])).toBe(52);
                expect(calculator.calculateTeamRating([95, 92, 94, 93, 93, 93, 92])).toBe(80);
            });
        });

        describe('Full Squad Scenarios', () => {
            test('should calculate rating for 11-player squads', () => {
                const ratings = [85, 87, 83, 86, 84, 88, 82, 85, 86, 84, 87];
                expect(calculator.calculateTeamRating(ratings)).toBe(85);
            });

            test('should calculate rating for known SBC combinations', () => {
                // 9x83 + 2x82 = 83 squad rating
                const combo = [83, 83, 83, 83, 83, 83, 83, 83, 83, 82, 82];
                expect(calculator.calculateTeamRating(combo)).toBe(83);
            });

            test('should calculate rating for all same rating', () => {
                expect(calculator.calculateTeamRating(new Array(11).fill(75))).toBe(75);
                expect(calculator.calculateTeamRating(new Array(11).fill(85))).toBe(85);
            });
        });
    });

    describe('findOptimalSolutions', () => {
        test('should find optimal 83 rating solution', () => {
            const largeInventory = [
                ...new Array(15).fill(83),
                ...new Array(10).fill(82),
                ...new Array(50).fill(81),
                ...new Array(25).fill(84)
            ];

            const result = calculator.findOptimalSolutions({
                targetRating: 83,
                availableRatings: largeInventory,
                priceByRating: { 81: 500, 82: 800, 83: 1000, 84: 2000 },
                maxSolutions: 5
            });

            expect(result.solutionsFound).toBeGreaterThan(0);
            expect(result.solutions[0].actualRating).toBe(83);
            expect(result.solutions[0].totalRatingPoints).toBe(910); // 6*83 + 4*82 + 1*84 = 910 (optimal)
        });

        test('should handle large inventories efficiently', () => {
            const massiveInventory = [];
            for (let i = 0; i < 200; i++) {
                massiveInventory.push(75 + Math.floor(Math.random() * 20)); // Random 75-94
            }

            const startTime = Date.now();
            const result = calculator.findOptimalSolutions({
                targetRating: 83,
                availableRatings: massiveInventory,
                priceByRating: { 
                    75: 200, 76: 250, 77: 300, 78: 350, 79: 400, 80: 450,
                    81: 500, 82: 800, 83: 1000, 84: 2000, 85: 3000
                },
                maxSolutions: 10
            });
            const duration = Date.now() - startTime;

            expect(duration).toBeLessThan(1000); // Should be fast
            if (result.solutionsFound > 0) {
                expect(result.solutions[0].actualRating).toBe(83);
            }
        });

        test('should return empty when no solutions possible', () => {
            const lowInventory = new Array(50).fill(75);
            const result = calculator.findOptimalSolutions({
                targetRating: 85,
                availableRatings: lowInventory,
                priceByRating: { 75: 200 }
            });

            expect(result.solutionsFound).toBe(0);
        });
    });

    describe('findSquadSolutions', () => {
        test('should find solutions for valid inputs', () => {
            const options = {
                targetRating: 84,
                existingRatings: [],
                availableRatings: [82, 83, 84, 85, 86],
                priceByRating: { 82: 800, 83: 1000, 84: 1500, 85: 2000, 86: 3000 },
                maxSolutions: 5
            };

            const result = calculator.findSquadSolutions(options);
            expect(result).toHaveProperty('solutionsFound');
            expect(result).toHaveProperty('solutions');
            expect(Array.isArray(result.solutions)).toBe(true);
        });

        test('should return no solutions for impossible target', () => {
            const options = {
                targetRating: 95,
                availableRatings: [75, 76, 77],
                priceByRating: { 75: 500, 76: 600, 77: 700 }
            };

            const result = calculator.findSquadSolutions(options);
            expect(result.solutionsFound).toBe(0);
        });
    });

    describe('calculateMinimumRatingNeeded', () => {
        test('should calculate minimum rating needed correctly', () => {
            const result = calculator.calculateMinimumRatingNeeded(85, [84, 85, 86], 8, 11);
            expect(typeof result).toBe('number');
            expect(result).toBeGreaterThan(0);
        });
    });

    describe('validateSquad', () => {
        test('should validate correct squad size', () => {
            const ratings = [85, 87, 83, 86, 84, 88, 82, 85, 86, 84, 87];
            const result = calculator.validateSquad(ratings, 84);
            expect(result).toHaveProperty('valid');
            expect(result).toHaveProperty('actualRating');
            expect(result).toHaveProperty('targetRating');
            expect(result).toHaveProperty('message');
        });

        test('should reject incorrect squad size', () => {
            const ratings = [85, 87, 83];
            const result = calculator.validateSquad(ratings, 84);
            expect(result.valid).toBe(false);
            expect(result.message).toContain('must have exactly');
        });
    });

    describe('getRatingStatistics', () => {
        test('should calculate statistics correctly', () => {
            const ratings = [80, 82, 84, 86, 88];
            const stats = calculator.getRatingStatistics(ratings);
            
            expect(stats.min).toBe(80);
            expect(stats.max).toBe(88);
            expect(stats.count).toBe(5);
            expect(stats.average).toBe(84);
            expect(stats.median).toBe(84);
        });

        test('should handle empty array', () => {
            const stats = calculator.getRatingStatistics([]);
            expect(stats.count).toBe(0);
            expect(stats.min).toBe(0);
            expect(stats.max).toBe(0);
        });
    });
});

describe('SolverHelper', () => {
    describe('factorial', () => {
        test('should calculate factorial correctly', () => {
            expect(SolverHelper.factorial(0)).toBe(1);
            expect(SolverHelper.factorial(1)).toBe(1);
            expect(SolverHelper.factorial(5)).toBe(120);
        });

        test('should handle negative numbers', () => {
            expect(SolverHelper.factorial(-1)).toBe(0);
        });
    });

    describe('getRating', () => {
        test('should calculate rating with EA formula', () => {
            const ratings = [85, 87, 83, 86, 84];
            const result = SolverHelper.getRating(ratings);
            expect(result).toBe(59);
        });

        test('should handle empty array', () => {
            const result = SolverHelper.getRating([]);
            expect(result).toBe(0);
        });
    });

    describe('getPrice', () => {
        test('should calculate total price correctly', () => {
            const ratings = [85, 87, 83];
            const priceByRating = { 83: 1000, 85: 1500, 87: 2000 };
            const result = SolverHelper.getPrice(ratings, priceByRating);
            expect(result).toBe(4500);
        });

        test('should handle missing prices', () => {
            const ratings = [85, 99];
            const priceByRating = { 85: 1500 };
            const result = SolverHelper.getPrice(ratings, priceByRating);
            expect(result).toBe(1500);
        });
    });

    describe('validateInputs', () => {
        test('should validate correct inputs', () => {
            const params = {
                targetRating: 85,
                existingRatings: [84, 85, 86],
                availableRatings: [83, 84, 85, 86, 87],
                squadSize: 11
            };
            const result = SolverHelper.validateInputs(params);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        test('should catch invalid target rating', () => {
            const params = {
                targetRating: 100,
                existingRatings: [84, 85, 86],
                availableRatings: [83, 84, 85, 86, 87],
                squadSize: 11
            };
            const result = SolverHelper.validateInputs(params);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
    });

    describe('getUniqueRatings', () => {
        test('should return unique sorted ratings', () => {
            const ratings = [85, 84, 85, 86, 84, 87];
            const result = SolverHelper.getUniqueRatings(ratings);
            expect(result).toEqual([84, 85, 86, 87]);
        });
    });

    describe('countRatings', () => {
        test('should count rating occurrences', () => {
            const ratings = [85, 84, 85, 86, 84, 85];
            const result = SolverHelper.countRatings(ratings);
            expect(result).toEqual({ 84: 2, 85: 3, 86: 1 });
        });
    });
});

describe('calculateSquadSolutions', () => {
    test('should find solutions for basic case', () => {
        const options = {
            targetRating: 84,
            existingRatings: [85, 86],
            ratingsToTry: [82, 83, 84, 85],
            priceByRating: { 82: 800, 83: 900, 84: 1000, 85: 1200 }
        };

        const result = calculateSquadSolutions(options, 5, 10);
        expect(result).toHaveProperty('solutionsFound');
        expect(result).toHaveProperty('solutions');
        expect(typeof result.solutionsFound).toBe('number');
    });

    test('should handle invalid target rating', () => {
        const options = {
            targetRating: 100,
            existingRatings: [85],
            ratingsToTry: [84, 85, 86],
            priceByRating: { 84: 1000, 85: 1200, 86: 1500 }
        };

        const result = calculateSquadSolutions(options, 5, 10);
        expect(result.solutionsFound).toBe(0);
        expect(result.solutions).toHaveLength(0);
    });
});