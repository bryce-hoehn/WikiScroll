// Simple test to check Wikipedia API responses
const axios = require('axios');

const titles = ['Albert Einstein', 'Category:Physics', 'Quantum mechanics', 'NonExistentPage12345'];

async function testExtractAPI(title) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&format=json&prop=extracts&exintro=true&explaintext=true`;
    const response = await axios.get(url);
    const pages = response.data?.query?.pages;
    
    if (pages) {
      const page = Object.values(pages)[0];
      console.log(`Extract API for "${title}":`);
      console.log('  Has extract:', !!page?.extract);
      if (page?.extract) {
        console.log('  Extract preview:', page.extract.slice(0, 100) + '...');
