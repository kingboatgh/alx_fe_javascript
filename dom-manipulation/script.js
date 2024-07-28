document.addEventListener('DOMContentLoaded', () => {
  const quotes = [
      { text: "The only way to do great work is to love what you do.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "Do not watch the clock. Do what it does. Keep going.", category: "Perseverance" }
  ];

  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteButton = document.getElementById('newQuote');
  const addQuoteButton = document.getElementById('addQuoteButton');
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');

  function showRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomIndex];
      quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
  }

  function addQuote() {
      const text = newQuoteText.value.trim();
      const category = newQuoteCategory.value.trim();

      if (text && category) {
          quotes.push({ text, category });
          newQuoteText.value = '';
          newQuoteCategory.value = '';
          alert('Quote added successfully!');
      } else {
          alert('Please enter both a quote and a category.');
      }
  }

  newQuoteButton.addEventListener('click', showRandomQuote);
  addQuoteButton.addEventListener('click', addQuote);

  // Show an initial random quote
  showRandomQuote();
});

