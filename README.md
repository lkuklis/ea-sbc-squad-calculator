# SBC Rating Calculator

[![npm version](https://badge.fury.io/js/ea-sbc-rating-calculator.svg)](https://badge.fury.io/js/ea-sbc-rating-calculator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive JavaScript library for calculating Squad Building Challenge (SBC) team ratings and finding optimal squad configurations for UT mode game of FC2x.

## 🚀 Features

- **Accurate Rating Formula** - Uses the exact rating calculation 
- **Optimal SBC Solutions** - Pre-calculated combinations for ratings 80-92
- **Large Inventory Support** - Efficiently handles 150-1000+ player cards
- **Chrome Extension Ready** - Perfect for browser environments
- **Performance Optimized** - Instant results for large club inventories

## 📦 Installation

```bash
npm install ea-sbc-rating-calculator
```

## 🎯 Quick Start

```javascript
const { SBCRatingCalculator } = require('ea-sbc-rating-calculator');

const calculator = new SBCRatingCalculator();

// Calculate team rating
const teamRating = calculator.calculateTeamRating([85, 87, 83, 86, 84, 88, 82, 85, 86, 84, 87]);
console.log('Team Rating:', teamRating); // 85

// Find optimal SBC solutions for large inventories
const result = calculator.findOptimalSolutions({
    targetRating: 83,
    availableRatings: yourLargeClubInventory, // 150+ cards
    priceByRating: { 82: 800, 83: 1000, 84: 2000 }
});

console.log(`Found ${result.solutionsFound} optimal solutions`);
console.log('Best solution:', result.solutions[0]);
// Output: 6x83 + 4x82 + 1x84 = 910 rating points (optimal)
```

## 🎮 Real SBC Example

```javascript
// Your club inventory (150+ cards, 70% below 84 rating)
const myClub = [
    ...Array(50).fill(75), ...Array(30).fill(80), ...Array(25).fill(82),
    ...Array(20).fill(83), ...Array(15).fill(84), ...Array(10).fill(85)
];

// Find cheapest 83-rated squad
const solutions = calculator.findOptimalSolutions({
    targetRating: 83,
    availableRatings: myClub,
    priceByRating: { 
        75: 200, 80: 400, 82: 800, 83: 1000, 84: 2000, 85: 3000 
    },
    maxSolutions: 5
});

// Results sorted by rating efficiency (lowest rating points first)
solutions.solutions.forEach((solution, i) => {
    console.log(`Solution ${i+1}: ${solution.totalRatingPoints} points, ${solution.price} coins`);
    solution.squad.forEach(group => {
        console.log(`  ${group.count}x ${group.rating} rated players`);
    });
});
```

## 🌐 Browser Usage

```html
<script src="https://unpkg.com/ea-sbc-rating-calculator/dist/index.umd.min.js"></script>
<script>
  const calculator = new SBCRatingCalculator.SBCRatingCalculator();
  const rating = calculator.calculateTeamRating([85, 87, 83, 86, 84]);
  console.log('Team Rating:', rating);
</script>
```

## 🔧 Chrome Extension Usage

```javascript
// Perfect for Chrome extensions
import { SBCRatingCalculator } from 'ea-sbc-rating-calculator';

const calculator = new SBCRatingCalculator();

// Handle large inventories efficiently
function solveSBC(targetRating, clubCards, marketPrices) {
    if (clubCards.length > 50) {
        // Use optimal combinations for speed
        return calculator.findOptimalSolutions({
            targetRating,
            availableRatings: clubCards,
            priceByRating: marketPrices
        });
    } else {
        // Use comprehensive search for smaller inventories
        return calculator.findSquadSolutions({
            targetRating,
            availableRatings: clubCards,
            priceByRating: marketPrices
        });
    }
}
```

## 📊 Performance

- **Large Inventories**: Handles 500+ cards in under 1 second
- **Optimal Solutions**: Pre-calculated combinations for instant results
- **Memory Efficient**: No browser storage dependencies

## 🎯 Supported Ratings

- **Optimal Combinations**: Ratings 80-92 (most common SBC requirements)
- **Full Calculation**: Any rating 45-99
- **Accurate**: Matches game behavior exactly

## 📖 API Reference

### `calculateTeamRating(ratings)`
Calculate team rating.

### `findOptimalSolutions(options)`
Find optimal solutions using pre-calculated combinations (fast).

### `findSquadSolutions(options)`
Find solutions using comprehensive search (flexible).

### `findMostEfficientSolutions(options)`
Find solutions sorted by rating efficiency.

For complete API documentation, see the [GitHub repository](https://github.com/lkuklis/ea-sbc-squad-calculator).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This library is not officially affiliated with EA Sports. It's a community tool designed to help players with Squad Building Challenges.