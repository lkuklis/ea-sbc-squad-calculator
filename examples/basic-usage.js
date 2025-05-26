// Example usage of SBC Rating Calculator
const { SBCRatingCalculator } = require('../src/index.js');

// Create calculator instance
const calculator = new SBCRatingCalculator({
    defaultSquadSize: 11,
    defaultMaxSolutions: 20
});

console.log('=== SBC Rating Calculator Examples ===\n');

// Example 1: Calculate team rating
console.log('1. Calculate Team Rating:');
const playerRatings = [87, 86, 85, 88, 84, 89, 83, 85, 86, 84, 87];
const teamRating = calculator.calculateTeamRating(playerRatings);
console.log(`Player ratings: [${playerRatings.join(', ')}]`);
console.log(`Team rating: ${teamRating}\n`);

// Example 2: Find squad solutions
console.log('2. Find Squad Solutions:');
const sbcOptions = {
    targetRating: 86,
    existingRatings: [89, 88, 87], // Already have these 3 players
    availableRatings: [84, 85, 86, 87, 88, 89], // Available in market
    priceByRating: {
        84: 800,
        85: 1200,
        86: 1800,
        87: 2500,
        88: 4000,
        89: 8000
    },
    squadSize: 11,
    maxSolutions: 5
};

const solutions = calculator.findSquadSolutions(sbcOptions);
console.log(`Target rating: ${sbcOptions.targetRating}`);
console.log(`Existing players: [${sbcOptions.existingRatings.join(', ')}]`);
console.log(`Found ${solutions.solutionsFound} solutions:\n`);

solutions.solutions.forEach((solution, index) => {
    console.log(`Solution ${index + 1}:`);
    console.log(`  Total cost: ${solution.price.toLocaleString()} coins`);
    console.log(`  Actual rating: ${solution.actualRating}`);
    console.log(`  Players needed:`);
    solution.squad.forEach(player => {
        const totalCost = player.count * sbcOptions.priceByRating[player.rating];
        console.log(`    ${player.count}x ${player.rating} rated (${totalCost.toLocaleString()} coins)`);
    });
    console.log('');
});

// Example 3: Calculate minimum rating needed
console.log('3. Calculate Minimum Rating Needed:');
const currentPlayers = [89, 87, 85, 84];
const remainingSlots = 7;
const targetRating = 86;
const minRating = calculator.calculateMinimumRatingNeeded(
    targetRating, 
    currentPlayers, 
    remainingSlots, 
    11
);
console.log(`Current players: [${currentPlayers.join(', ')}]`);
console.log(`Target rating: ${targetRating}`);
console.log(`Remaining slots: ${remainingSlots}`);
console.log(`Minimum rating needed for each remaining player: ${minRating}\n`);

// Example 4: Validate a squad
console.log('4. Validate Squad:');
const completeSquad = [89, 88, 87, 86, 85, 85, 84, 84, 83, 83, 82];
const validation = calculator.validateSquad(completeSquad, 85);
console.log(`Squad: [${completeSquad.join(', ')}]`);
console.log(`Target: ${validation.targetRating}, Actual: ${validation.actualRating}`);
console.log(`Valid: ${validation.valid}`);
console.log(`Message: ${validation.message}\n`);

// Example 5: Get rating statistics
console.log('5. Rating Statistics:');
const availableRatings = [82, 83, 84, 84, 85, 85, 85, 86, 86, 87, 88, 89];
const stats = calculator.getRatingStatistics(availableRatings);
console.log(`Ratings: [${availableRatings.join(', ')}]`);
console.log(`Statistics:`);
console.log(`  Count: ${stats.count}`);
console.log(`  Min: ${stats.min}`);
console.log(`  Max: ${stats.max}`);
console.log(`  Average: ${stats.average}`);
console.log(`  Median: ${stats.median}\n`);

console.log('=== Examples Complete ===');