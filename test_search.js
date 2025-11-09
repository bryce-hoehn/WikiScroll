// Test script to check if fetchSearchSuggestions is working
const { fetchSearchSuggestions } = require('./api/wikipedia/fetchSearchSuggestions');

async function testSearch() {
  console.log('Testing fetchSearchSuggestions...');
  
  try {
    const results = await fetchSearchSuggestions('apple');
    console.log('Search results:', results);
    console.log('Number of results:', results.length);
    
    if (results.length > 0) {
      console.log('First result:', results[0]);
    }
  } catch (error) {
    console.error('Error during search:', error);
  }
}

testSearch();
