const fs = require('fs');

// Read the file
const content = fs.readFileSync('Y:/pentest/elite-xss-framework/loader.user.js', 'utf8');

// Count parentheses
const openParens = (content.match(/\(/g) || []).length;
const closeParens = (content.match(/\)/g) || []).length;

// Count braces
const openBraces = (content.match(/\{/g) || []).length;
const closeBraces = (content.match(/\}/g) || []).length;

// Count brackets
const openBrackets = (content.match(/\[/g) || []).length;
const closeBrackets = (content.match(/\]/g) || []).length;

console.log(`Parentheses: ${openParens} open, ${closeParens} close - ${openParens === closeParens ? 'Balanced' : 'Unbalanced'}`);
console.log(`Braces: ${openBraces} open, ${closeBraces} close - ${openBraces === closeBraces ? 'Balanced' : 'Unbalanced'}`);
console.log(`Brackets: ${openBrackets} open, ${closeBrackets} close - ${openBrackets === closeBrackets ? 'Balanced' : 'Unbalanced'}`);

if (openParens === closeParens && openBraces === closeBraces && openBrackets === closeBrackets) {
    console.log('✅ All brackets are balanced');
} else {
    console.log('❌ Bracket imbalance detected');
}