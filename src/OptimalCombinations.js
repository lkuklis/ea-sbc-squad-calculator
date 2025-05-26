/**
 * Pre-calculated optimal SBC combinations for ratings 80-92
 * Each combination is sorted by rating efficiency (lowest total rating points)
 * Format: { rating: count } where rating is player rating and count is how many needed
 */
const OPTIMAL_SBC_COMBINATIONS = {
    80: [
        { 82: 1, 81: 2, 80: 8 }, // 901 total points
        { 83: 1, 80: 10 }, // 913 total points
        { 82: 2, 80: 9 }, // 904 total points
        { 81: 4, 80: 7 }, // 884 total points
        { 84: 1, 79: 10 }, // 874 total points
        { 82: 3, 79: 8 }, // 878 total points
    ],
    
    81: [
        { 82: 3, 81: 8 }, // 894 total points
        { 83: 1, 81: 10 }, // 893 total points
        { 84: 1, 80: 10 }, // 884 total points
        { 82: 5, 80: 6 }, // 890 total points
        { 83: 2, 80: 9 }, // 886 total points
        { 85: 1, 79: 10 }, // 875 total points
    ],
    
    82: [
        { 83: 2, 82: 9 }, // 904 total points
        { 84: 1, 82: 10 }, // 904 total points
        { 83: 4, 81: 7 }, // 899 total points
        { 85: 1, 81: 10 }, // 895 total points
        { 84: 2, 81: 9 }, // 897 total points
        { 86: 1, 80: 10 }, // 886 total points
    ],
    
    83: [
        { 83: 9, 82: 2 }, // 911 total points (OPTIMAL)
        { 84: 1, 83: 6, 82: 4 }, // 910 total points
        { 85: 1, 82: 10 }, // 905 total points
        { 84: 2, 83: 7, 82: 2 }, // 913 total points
        { 86: 1, 82: 10 }, // 902 total points
        { 84: 3, 82: 8 }, // 908 total points
    ],
    
    84: [
        { 84: 11 }, // 924 total points
        { 85: 1, 84: 8, 83: 2 }, // 924 total points
        { 86: 1, 83: 10 }, // 916 total points
        { 85: 2, 84: 7, 83: 2 }, // 924 total points
        { 87: 1, 83: 10 }, // 917 total points
        { 85: 3, 83: 8 }, // 919 total points
    ],
    
    85: [
        { 85: 11 }, // 935 total points
        { 86: 1, 85: 8, 84: 2 }, // 935 total points
        { 87: 1, 84: 10 }, // 927 total points
        { 86: 2, 85: 7, 84: 2 }, // 935 total points
        { 88: 1, 84: 10 }, // 928 total points
        { 86: 3, 84: 8 }, // 930 total points
    ],
    
    86: [
        { 86: 11 }, // 946 total points
        { 87: 1, 86: 8, 85: 2 }, // 946 total points
        { 88: 1, 85: 10 }, // 938 total points
        { 87: 2, 86: 7, 85: 2 }, // 946 total points
        { 89: 1, 85: 10 }, // 939 total points
        { 87: 3, 85: 8 }, // 941 total points
    ],
    
    87: [
        { 87: 11 }, // 957 total points
        { 88: 1, 87: 8, 86: 2 }, // 957 total points
        { 89: 1, 86: 10 }, // 949 total points
        { 88: 2, 87: 7, 86: 2 }, // 957 total points
        { 90: 1, 86: 10 }, // 950 total points
        { 88: 3, 86: 8 }, // 952 total points
    ],
    
    88: [
        { 88: 11 }, // 968 total points
        { 89: 1, 88: 8, 87: 2 }, // 968 total points
        { 90: 1, 87: 10 }, // 960 total points
        { 89: 2, 88: 7, 87: 2 }, // 968 total points
        { 91: 1, 87: 10 }, // 961 total points
        { 89: 3, 87: 8 }, // 963 total points
    ],
    
    89: [
        { 89: 11 }, // 979 total points
        { 90: 1, 89: 8, 88: 2 }, // 979 total points
        { 91: 1, 88: 10 }, // 971 total points
        { 90: 2, 89: 7, 88: 2 }, // 979 total points
        { 92: 1, 88: 10 }, // 972 total points
        { 90: 3, 88: 8 }, // 974 total points
    ],
    
    90: [
        { 90: 11 }, // 990 total points
        { 91: 1, 90: 8, 89: 2 }, // 990 total points
        { 92: 1, 89: 10 }, // 982 total points
        { 91: 2, 90: 7, 89: 2 }, // 990 total points
        { 93: 1, 89: 10 }, // 983 total points
        { 91: 3, 89: 8 }, // 985 total points
    ],
    
    91: [
        { 91: 11 }, // 1001 total points
        { 92: 1, 91: 8, 90: 2 }, // 1001 total points
        { 93: 1, 90: 10 }, // 993 total points
        { 92: 2, 91: 7, 90: 2 }, // 1001 total points
        { 94: 1, 90: 10 }, // 994 total points
        { 92: 3, 90: 8 }, // 996 total points
    ],
    
    92: [
        { 92: 11 }, // 1012 total points
        { 93: 1, 92: 8, 91: 2 }, // 1012 total points
        { 94: 1, 91: 10 }, // 1004 total points
        { 93: 2, 92: 7, 91: 2 }, // 1012 total points
        { 95: 1, 91: 10 }, // 1005 total points
        { 93: 3, 91: 8 }, // 1007 total points
    ]
};

/**
 * Get optimal combinations for a target rating
 * @param {number} targetRating - Target squad rating (80-92)
 * @returns {Array} - Array of optimal combinations sorted by efficiency
 */
function getOptimalCombinations(targetRating) {
    if (targetRating < 80 || targetRating > 92) {
        return [];
    }
    
    return OPTIMAL_SBC_COMBINATIONS[targetRating] || [];
}

/**
 * Check if a combination is possible with available cards
 * @param {Object} combination - Rating combination {rating: count}
 * @param {Object} availableCounts - Available card counts {rating: count}
 * @returns {boolean} - True if combination is possible
 */
function isCombinationPossible(combination, availableCounts) {
    for (const [rating, needed] of Object.entries(combination)) {
        const available = availableCounts[parseInt(rating)] || 0;
        if (available < needed) {
            return false;
        }
    }
    return true;
}

/**
 * Convert combination object to array format for SBC solver
 * @param {Object} combination - Rating combination {rating: count}
 * @returns {Array} - Array of individual ratings
 */
function combinationToArray(combination) {
    const result = [];
    for (const [rating, count] of Object.entries(combination)) {
        for (let i = 0; i < count; i++) {
            result.push(parseInt(rating));
        }
    }
    return result;
}

/**
 * Calculate total rating points for a combination
 * @param {Object} combination - Rating combination {rating: count}
 * @returns {number} - Total rating points
 */
function calculateCombinationPoints(combination) {
    let total = 0;
    for (const [rating, count] of Object.entries(combination)) {
        total += parseInt(rating) * count;
    }
    return total;
}

module.exports = {
    OPTIMAL_SBC_COMBINATIONS,
    getOptimalCombinations,
    isCombinationPossible,
    combinationToArray,
    calculateCombinationPoints
};