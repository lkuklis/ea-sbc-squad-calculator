const { SolverHelper } = require('./SolverHelper.js');
const { getOptimalCombinations, isCombinationPossible, combinationToArray, calculateCombinationPoints } = require('./OptimalCombinations.js');

/**
 * SBC Rating Calculator - A comprehensive library for EA Sports Squad Building Challenges
 */
class SBCRatingCalculator {
    constructor(options = {}) {
        this.defaultSquadSize = options.defaultSquadSize || 11;
        this.defaultMaxSolutions = options.defaultMaxSolutions || 50;
    }

    /**
     * Calculate the team rating based on individual player ratings
     * EA always calculates as if there are 11 players, padding missing slots with 0
     * @param {number[]} ratings - Array of player ratings
     * @returns {number} - Calculated team rating
     */
    calculateTeamRating(ratings) {
        return SolverHelper.getRating(ratings);
    }

    /**
     * Find optimal SBC solutions using pre-calculated combinations (fast method for large inventories)
     * @param {Object} options - Configuration options
     * @param {number} options.targetRating - The desired overall squad rating (80-92)
     * @param {number[]} options.availableRatings - Large array of available player ratings
     * @param {Object.<number, number>} options.priceByRating - Mapping of player ratings to their prices
     * @param {number} options.maxSolutions - Maximum number of solutions to return
     * @returns {Object} - Result object with optimal solutions
     */
    findOptimalSolutions(options) {
        const {
            targetRating,
            availableRatings = [],
            priceByRating = {},
            maxSolutions = 10
        } = options;

        // Get pre-calculated optimal combinations
        const optimalCombinations = getOptimalCombinations(targetRating);
        
        if (optimalCombinations.length === 0) {
            return {
                solutionsFound: 0,
                solutions: [],
                message: `No optimal combinations available for rating ${targetRating}. Use findSquadSolutions for custom search.`
            };
        }

        // Count available cards
        const availableCounts = SolverHelper.countRatings(availableRatings);
        const solutions = [];

        for (const combination of optimalCombinations.slice(0, maxSolutions)) {
            // Check if this combination is possible with available cards
            if (isCombinationPossible(combination, availableCounts)) {
                // Calculate price and create solution
                const ratingArray = combinationToArray(combination);
                const price = SolverHelper.getPrice(ratingArray, priceByRating);
                const totalRatingPoints = calculateCombinationPoints(combination);
                
                // Convert to squad format
                const squad = Object.entries(combination).map(([rating, count]) => ({
                    rating: parseInt(rating),
                    count: count
                }));

                solutions.push({
                    price: price,
                    squad: squad,
                    actualRating: targetRating,
                    totalRatingPoints: totalRatingPoints,
                    efficiency: totalRatingPoints / targetRating,
                    isOptimal: true
                });
            }
        }

        return {
            solutionsFound: solutions.length,
            solutions: solutions.sort((a, b) => a.totalRatingPoints - b.totalRatingPoints)
        };
    }

    /**
     * Calculate possible squad configurations to meet a target rating for an SBC
     * Prioritizes solutions by rating efficiency (lowest total rating points used)
     * @param {Object} options - Configuration options
     * @param {number} options.targetRating - The desired overall squad rating
     * @param {number[]} options.existingRatings - Ratings of players already in the squad
     * @param {number[]} options.availableRatings - Ratings of players available to fill the squad
     * @param {Object.<number, number>} options.priceByRating - Mapping of player ratings to their prices
     * @param {number} options.squadSize - The total number of players in the squad
     * @param {number} options.maxSolutions - The maximum number of solutions to return
     * @param {boolean} options.sortByPrice - If true, sort by price; if false, sort by rating efficiency
     * @param {boolean} options.useOptimalCombinations - If true, use pre-calculated optimal combinations for speed
     * @returns {Object} - Result object with solutions found and solution details
     */
    findSquadSolutions(options) {
        const {
            targetRating,
            existingRatings = [],
            availableRatings = [],
            priceByRating = {},
            squadSize = this.defaultSquadSize,
            maxSolutions = this.defaultMaxSolutions,
            sortByPrice = true,
            useOptimalCombinations = true
        } = options;

        // If no existing ratings and target is in optimal range, use fast method
        if (existingRatings.length === 0 && 
            useOptimalCombinations && 
            targetRating >= 80 && 
            targetRating <= 92 &&
            availableRatings.length > 50) {
            
            const optimalResult = this.findOptimalSolutions({
                targetRating,
                availableRatings,
                priceByRating,
                maxSolutions
            });
            
            if (optimalResult.solutionsFound > 0) {
                return optimalResult;
            }
        }

        // Validate inputs
        const validation = SolverHelper.validateInputs({
            targetRating,
            existingRatings,
            availableRatings: availableRatings,
            squadSize
        });

        if (!validation.valid) {
            return {
                error: validation.errors.join(', '),
                solutionsFound: 0,
                solutions: []
            };
        }

        return calculateSquadSolutions(
            {
                targetRating,
                existingRatings,
                ratingsToTry: availableRatings,
                priceByRating
            },
            squadSize,
            maxSolutions,
            sortByPrice
        );
    }

    /**
     * Find the most efficient squad solutions (lowest rating cost)
     * @param {Object} options - Same as findSquadSolutions but sorted by efficiency
     * @returns {Object} - Solutions sorted by rating efficiency
     */
    findMostEfficientSolutions(options) {
        return this.findSquadSolutions({
            ...options,
            sortByPrice: false
        });
    }

    /**
     * Calculate the minimum rating needed for remaining players to reach target
     * @param {number} targetRating - Desired team rating
     * @param {number[]} existingRatings - Current player ratings
     * @param {number} remainingSlots - Number of players still to add
     * @param {number} squadSize - Total squad size (default: 11)
     * @returns {number} - Minimum rating needed for each remaining player
     */
    calculateMinimumRatingNeeded(targetRating, existingRatings, remainingSlots, squadSize = 11) {
        // Since EA always calculates for 11 players, we use 11 regardless
        const currentSum = existingRatings.reduce((sum, rating) => sum + rating, 0);
        const targetSum = targetRating * 11; // Always 11 for EA
        const remainingSum = targetSum - currentSum;
        return Math.ceil(remainingSum / remainingSlots);
    }

    /**
     * Validate if a squad configuration can achieve the target rating
     * @param {number[]} ratings - All player ratings in the squad
     * @param {number} targetRating - Desired team rating
     * @param {number} squadSize - Total squad size (default: 11, but EA always uses 11)
     * @returns {Object} - Validation result with success status and actual rating
     */
    validateSquad(ratings, targetRating, squadSize = 11) {
        // For validation, we check if it's a full 11-player squad
        if (ratings.length !== squadSize) {
            return {
                valid: false,
                message: `Squad must have exactly ${squadSize} players`,
                actualRating: null
            };
        }

        const actualRating = this.calculateTeamRating(ratings);
        const valid = actualRating >= targetRating;

        return {
            valid,
            actualRating,
            targetRating,
            message: valid 
                ? `Squad achieves target rating (${actualRating} >= ${targetRating})`
                : `Squad rating too low (${actualRating} < ${targetRating})`
        };
    }

    /**
     * Get statistics about available player ratings
     * @param {number[]} ratings - Array of available player ratings
     * @returns {Object} - Statistical information about the ratings
     */
    getRatingStatistics(ratings) {
        if (!ratings || ratings.length === 0) {
            return { min: 0, max: 0, average: 0, median: 0, count: 0 };
        }

        const sorted = [...ratings].sort((a, b) => a - b);
        const count = ratings.length;
        const sum = ratings.reduce((acc, rating) => acc + rating, 0);
        const average = Math.round(sum / count * 100) / 100;
        
        const median = count % 2 === 0 
            ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
            : sorted[Math.floor(count / 2)];

        return {
            min: sorted[0],
            max: sorted[count - 1],
            average,
            median,
            count
        };
    }
}

/**
 * Calculate possible squad configurations to meet a target rating for an SBC.
 * Enhanced to prioritize solutions by rating efficiency or price.
 * 
 * @param {Object} solverOptions - Options to configure the SBC solver.
 * @param {number} solverOptions.targetRating - The desired overall squad rating.
 * @param {number[]} solverOptions.existingRatings - Ratings of players already in the squad.
 * @param {number[]} solverOptions.ratingsToTry - Ratings of players available to fill the squad.
 * @param {Object.<number, number>} solverOptions.priceByRating - Mapping of player ratings to their prices.
 * @param {number} SQUAD_SIZE - The total number of players in the squad.
 * @param {number} MAX_SOLUTIONS_TO_TAKE - The maximum number of solutions to return.
 * @param {boolean} sortByPrice - If true, sort by price; if false, sort by rating efficiency.
 * 
 * @returns {Object} - An object containing the number of solutions found and the solutions themselves.
 * @returns {number} return.solutionsFound - The number of valid squad configurations found.
 * @returns {Array<Object>} return.solutions - An array of solutions, each with a squad configuration and its cost.
 */
function calculateSquadSolutions(solverOptions, SQUAD_SIZE, MAX_SOLUTIONS_TO_TAKE, sortByPrice = true) {
    try {
        const { targetRating, existingRatings, ratingsToTry, priceByRating } = solverOptions;
        let solutions = [];
        
        if (targetRating > 99 || targetRating < 45) {
            return {
                solutionsFound: 0,
                solutions: []
            };
        }

        const remainingSlots = SQUAD_SIZE - existingRatings.length;
        if (remainingSlots <= 0) {
            // Check if existing squad already meets the requirement
            const currentRating = SolverHelper.getRating(existingRatings);
            if (currentRating >= targetRating) {
                return {
                    solutionsFound: 1,
                    solutions: [{
                        price: 0,
                        squad: [],
                        actualRating: currentRating,
                        totalRatingPoints: existingRatings.reduce((a, b) => a + b, 0),
                        efficiency: 0
                    }]
                };
            } else {
                return {
                    solutionsFound: 0,
                    solutions: []
                };
            }
        }

        // Count available ratings for better optimization
        const availableCounts = SolverHelper.countRatings(ratingsToTry);
        
        const combinations = SolverHelper.getMultisubsets(ratingsToTry, remainingSlots);

        for (const combination of combinations) {
            // Check if we have enough cards of each rating
            const neededCounts = SolverHelper.countRatings(combination);
            let hasEnoughCards = true;
            
            for (const [rating, needed] of Object.entries(neededCounts)) {
                if ((availableCounts[rating] || 0) < needed) {
                    hasEnoughCards = false;
                    break;
                }
            }
            
            if (!hasEnoughCards) continue;

            const fullSquad = [...existingRatings, ...combination];
            const rating = SolverHelper.getRating(fullSquad);
            
            if (rating < targetRating) {
                continue;
            }

            const ratingCounts = combination.reduce(function(acc, curr) {
                acc[curr] = (acc[curr] || 0) + 1;
                return acc;
            }, {});

            const squad = Object.keys(ratingCounts).map(function(rating) {
                return {
                    rating: +rating,
                    count: ratingCounts[+rating]
                };
            });

            const totalRatingPoints = fullSquad.reduce((a, b) => a + b, 0);
            const price = SolverHelper.getPrice(combination, priceByRating);
            
            // Calculate efficiency (lower is better)
            const efficiency = totalRatingPoints / Math.max(rating, 1);

            solutions.push({
                price: price,
                squad: squad,
                actualRating: rating,
                totalRatingPoints: totalRatingPoints,
                efficiency: efficiency,
                combinationUsed: combination
            });
        }

        // Sort by price or efficiency
        if (sortByPrice) {
            solutions.sort(function(a, b) { 
                // Primary: price, Secondary: efficiency (rating points)
                if (a.price !== b.price) {
                    return a.price - b.price;
                }
                return a.totalRatingPoints - b.totalRatingPoints;
            });
        } else {
            solutions.sort(function(a, b) { 
                // Primary: total rating points (efficiency), Secondary: price
                if (a.totalRatingPoints !== b.totalRatingPoints) {
                    return a.totalRatingPoints - b.totalRatingPoints;
                }
                return a.price - b.price;
            });
        }

        if (MAX_SOLUTIONS_TO_TAKE && MAX_SOLUTIONS_TO_TAKE > 0) {
            solutions = solutions.slice(0, MAX_SOLUTIONS_TO_TAKE);
        }
        
        return {
            solutionsFound: solutions.length,
            solutions: solutions
        };

    } catch (error) {
        return {
            error: error.message || "An error occurred",
            solutionsFound: 0,
            solutions: []
        };
    }
}

// CommonJS exports
module.exports = {
    SBCRatingCalculator,
    calculateSquadSolutions,
    SolverHelper
};