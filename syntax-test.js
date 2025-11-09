/**
 * Test script to validate Elite XSS Framework loader syntax
 */

// Test 1: Basic syntax validation
try {
    // This will throw an error if there are syntax issues
    new Function(`
        ${require('fs').readFileSync('Y:/pentest/elite-xss-framework/loader.user.js', 'utf8')}
    `);
    console.log('✅ Basic syntax validation passed');
} catch (error) {
    console.error('❌ Basic syntax validation failed:', error.message);
}

// Test 2: Check for common issues
const loaderContent = require('fs').readFileSync('Y:/pentest/elite-xss-framework/loader.user.js', 'utf8');

// Check for unmatched parentheses
const openParens = (loaderContent.match(/\(/g) || []).length;
const closeParens = (loaderContent.match(/\)/g) || []).length;

if (openParens === closeParens) {
    console.log('✅ Parentheses are balanced');
} else {
    console.error(`❌ Parentheses mismatch: ${openParens} open, ${closeParens} close`);
}

// Check for unmatched braces
const openBraces = (loaderContent.match(/\{/g) || []).length;
const closeBraces = (loaderContent.match(/\}/g) || []).length;

if (openBraces === closeBraces) {
    console.log('✅ Braces are balanced');
} else {
    console.error(`❌ Braces mismatch: ${openBraces} open, ${closeBraces} close`);
}

// Check for unmatched brackets
const openBrackets = (loaderContent.match(/\[/g) || []).length;
const closeBrackets = (loaderContent.match(/\]/g) || []).length;

if (openBrackets === closeBrackets) {
    console.log('✅ Brackets are balanced');
} else {
    console.error(`❌ Brackets mismatch: ${openBrackets} open, ${closeBrackets} close`);
}

console.log('Validation complete');