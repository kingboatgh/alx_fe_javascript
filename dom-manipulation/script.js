document.addEventListener('DOMContentLoaded', () => {
  const quotes = [
      { text: "The only way to do great work is to love what you do.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "Do not watch the clock. Do what it does. Keep going.", category: "Perseverance" }
  ];

  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteButton = document.getElementById('newQuote');

  function showRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomIndex];
      quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
  }

  function createAddQuoteForm() {
      const formContainer = document.createElement('div');

      const quoteInput = document.createElement('input');
      quoteInput.id = 'newQuoteText';
      quoteInput.type = 'text';
      quoteInput.placeholder = 'Enter a new quote';
      
      const categoryInput = document.createElement('input');
      categoryInput.id = 'newQuoteCategory';
      categoryInput.type = 'text';
      categoryInput.placeholder = 'Enter quote category';

      const addButton = document.createElement('button');
      addButton.id = 'addQuoteButton';
      addButton.textContent = 'Add Quote';

      formContainer.appendChild(quoteInput);
      formContainer.appendChild(categoryInput);
      formContainer.appendChild(addButton);
      
      document.body.appendChild(formContainer);

      addButton.addEventListener('click', addQuote);
  }

  function addQuote() {
      const newQuoteText = document.getElementById('newQuoteText').value.trim();
      const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

      if (newQuoteText && newQuoteCategory) {
          quotes.push({ text: newQuoteText, category: newQuoteCategory });
          document.getElementById('newQuoteText').value = '';
          document.getElementById('newQuoteCategory').value = '';
          alert('Quote added successfully!');
      } else {
          alert('Please enter both a quote and a category.');
      }
  }

  newQuoteButton.addEventListener('click', showRandomQuote);

  // Initial setup
  showRandomQuote();
  createAddQuoteForm();
});
