/**
 * Helper class for SBC calculations and combinatorial operations
 */
class SolverHelper {
    /**
     * Calculate the number of multisubsets of size n from a set of given length
     * @param {number} setLength - Length of the original set
     * @param {number} n - Size of multisubsets to generate
     * @returns {number} - Number of possible multisubsets
     */
    static getMultisubsetsCount(setLength, n) {
        if (n === 0 || setLength === 0) return n === 0 ? 1 : 0;
        return (
            this.factorial(setLength + n - 1) /
            (this.factorial(setLength - 1) * this.factorial(n))
        );
    }

    /**
     * Calculate factorial of a number
     * @param {number} num - Number to calculate factorial for
     * @returns {number} - Factorial result
     */
    static factorial(num) {
        if (num < 0) return 0;
        if (num === 0 || num === 1) return 1;
        
        let result = 1;
        for (let i = 2; i <= num; i++) {
            result *= i;
        }
        return result;
    }

    /**
     * Calculate team rating
     * IMPORTANT: Always calculates squad rating as if there are 11 players total,
     * padding missing slots with 0 rating.
     * @param {number[]} ratings - Array of individual player ratings
     * @returns {number} - Calculated team rating (floored)
     */
    static getRating(ratings) {
        if (!ratings || ratings.length === 0) return 0;
        
        const paddedRatings = [...ratings];
        while (paddedRatings.length < 11) {
            paddedRatings.push(0);
        }
        
        const sum = paddedRatings.reduce((acc, curr) => acc + curr, 0);
        const avg = sum / 11; // Always divide by 11
        
        // Calculate correction factor for players above average
        const correctionFactor = paddedRatings.reduce((acc, curr) => {
            return curr > avg ? acc + (curr - avg) : acc;
        }, 0);
        
        // EA's formula: Round(sum + correction) / 11, then floor
        const sumWithCorrection = sum + correctionFactor;
        const rounded = Math.round(sumWithCorrection);
        return Math.floor(rounded / 11);
    }

    /**
     * Calculate total price for a set of ratings
     * @param {number[]} ratings - Array of player ratings
     * @param {Object.<number, number>} priceByRating - Mapping of ratings to prices
     * @returns {number} - Total price
     */
    static getPrice(ratings, priceByRating) {
        return ratings.reduce(
            (acc, curr) => acc + (priceByRating[curr] || 0),
            0
        );
    }

    /**
     * Generate all multisubsets of size n from the given set
     * @param {Array} set - The original set to generate subsets from
     * @param {number} n - Size of each multisubset
     * @returns {Generator} - Generator yielding multisubsets
     */
    static getMultisubsets(set, n) {
        return this.multisubsetsImpl(set, n);
    }

    /**
     * Internal implementation for generating multisubsets
     * @param {Array} set - The set to generate from
     * @param {number} n - Size of subsets
     * @returns {Generator} - Generator yielding multisubsets
     */
    static* multisubsetsImpl(set, n) {
        if (n === 0) {
            yield [];
        } else if (set.length > 0) {
            const [x, ...rest] = set;
            
            // Include x 0 to n times, then recurse on the rest
            for (let i = 0; i <= n; i++) {
                yield* this.prependNTimes(x, this.multisubsetsImpl(rest, n - i), i);
            }
        }
    }

    /**
     * Prepend element 'a' n times to each array in the generator
     * @param {*} a - Element to prepend
     * @param {Generator} xss - Generator of arrays
     * @param {number} n - Number of times to prepend
     * @returns {Generator} - Generator yielding arrays with prepended elements
     */
    static* prependNTimes(a, xss, n) {
        const prefix = Array(n).fill(a);
        for (let xs of xss) {
            yield [...prefix, ...xs];
        }
    }

    /**
     * Validate input parameters for SBC calculations
     * @param {Object} params - Parameters to validate
     * @returns {Object} - Validation result
     */
    static validateInputs(params) {
        const { targetRating, existingRatings, availableRatings, squadSize } = params;
        const errors = [];

        if (typeof targetRating !== 'number' || targetRating < 45 || targetRating > 99) {
            errors.push('Target rating must be a number between 45 and 99');
        }

        if (!Array.isArray(existingRatings)) {
            errors.push('Existing ratings must be an array');
        } else {
            existingRatings.forEach((rating, index) => {
                if (typeof rating !== 'number' || rating < 45 || rating > 99) {
                    errors.push(`Invalid rating at index ${index}: ${rating}`);
                }
            });
        }

        if (!Array.isArray(availableRatings)) {
            errors.push('Available ratings must be an array');
        } else {
            availableRatings.forEach((rating, index) => {
                if (typeof rating !== 'number' || rating < 45 || rating > 99) {
                    errors.push(`Invalid available rating at index ${index}: ${rating}`);
                }
            });
        }

        if (typeof squadSize !== 'number' || squadSize < 1 || squadSize > 23) {
            errors.push('Squad size must be a number between 1 and 23');
        }

        if (existingRatings && squadSize && existingRatings.length > squadSize) {
            errors.push('Existing ratings exceed squad size');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    /**
     * Get unique ratings from an array
     * @param {number[]} ratings - Array of ratings
     * @returns {number[]} - Array of unique ratings sorted ascending
     */
    static getUniqueRatings(ratings) {
        return [...new Set(ratings)].sort((a, b) => a - b);
    }

    /**
     * Count occurrences of each rating
     * @param {number[]} ratings - Array of ratings
     * @returns {Object.<number, number>} - Object mapping ratings to counts
     */
    static countRatings(ratings) {
        return ratings.reduce((acc, rating) => {
            acc[rating] = (acc[rating] || 0) + 1;
            return acc;
        }, {});
    }
}

module.exports = { SolverHelper };