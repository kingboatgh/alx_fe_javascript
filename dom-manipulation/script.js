document.addEventListener('DOMContentLoaded', () => {
  let quotes = JSON.parse(localStorage.getItem('quotes')) || [
      { text: "The only way to do great work is to love what you do.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "Do not watch the clock. Do what it does. Keep going.", category: "Perseverance" }
  ];

  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteButton = document.getElementById('newQuote');
  const importFileInput = document.getElementById('importFile');
  const exportButton = document.getElementById('exportButton');

  function showRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomIndex];
      quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
      sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
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
          localStorage.setItem('quotes', JSON.stringify(quotes));
          document.getElementById('newQuoteText').value = '';
          document.getElementById('newQuoteCategory').value = '';
          alert('Quote added successfully!');
      } else {
          alert('Please enter both a quote and a category.');
      }
  }

  function saveQuotes() {
      localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  function importFromJsonFile(event) {
      const fileReader = new FileReader();
      fileReader.onload = function(event) {
          const importedQuotes = JSON.parse(event.target.result);
          quotes.push(...importedQuotes);
          saveQuotes();
          alert('Quotes imported successfully!');
      };
      fileReader.readAsText(event.target.files[0]);
  }

  function exportToJsonFile() {
      const dataStr = JSON.stringify(quotes, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'quotes.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  }

  newQuoteButton.addEventListener('click', showRandomQuote);
  importFileInput.addEventListener('change', importFromJsonFile);
  exportButton.addEventListener('click', exportToJsonFile);

  // Initial setup
  showRandomQuote();
  createAddQuoteForm();

  // Load last viewed quote from session storage
  const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
  if (lastViewedQuote) {
      quoteDisplay.innerHTML = `<p>${lastViewedQuote.text}</p><p><em>${lastViewedQuote.category}</em></p>`;
  }
});
