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
  const categoryFilter = document.getElementById('categoryFilter');

  const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API URL

  function showRandomQuote() {
      const filteredQuotes = getFilteredQuotes();
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const quote = filteredQuotes[randomIndex];
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
          const newQuote = { text: newQuoteText, category: newQuoteCategory };
          quotes.push(newQuote);
          localStorage.setItem('quotes', JSON.stringify(quotes));
          populateCategories();
          document.getElementById('newQuoteText').value = '';
          document.getElementById('newQuoteCategory').value = '';
          alert('Quote added successfully!');
          syncQuotes(newQuote);
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
          populateCategories();
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

  function getFilteredQuotes() {
      const selectedCategory = categoryFilter.value;
      if (selectedCategory === 'all') {
          return quotes;
      }
      return quotes.filter(quote => quote.category === selectedCategory);
  }

  function filterQuotes() {
      const filteredQuotes = getFilteredQuotes();
      if (filteredQuotes.length > 0) {
          const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
          const quote = filteredQuotes[randomIndex];
          quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
          sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
      } else {
          quoteDisplay.innerHTML = `<p>No quotes available for this category.</p>`;
      }
      localStorage.setItem('selectedCategory', categoryFilter.value);
  }

  function populateCategories() {
      const categories = ['all', ...new Set(quotes.map(quote => quote.category))];
      categoryFilter.innerHTML = categories.map(category => `<option value="${category}">${category}</option>`).join('');
      
      const savedCategory = localStorage.getItem('selectedCategory');
      if (savedCategory) {
          categoryFilter.value = savedCategory;
      }
  }

  async function syncQuotes(newQuote) {
      try {
          const response = await fetch(SERVER_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newQuote)
          });
          if (!response.ok) {
              throw new Error('Failed to sync with server');
          }
          alert('Quotes synced with server!');
      } catch (error) {
          console.error('Sync error:', error);
      }
  }

  async function fetchQuotesFromServer() {
      try {
          const response = await fetch(SERVER_URL);
          if (!response.ok) {
              throw new Error('Failed to fetch quotes from server');
          }
          const serverQuotes = await response.json();
          const newQuotes = serverQuotes.filter(serverQuote => 
              !quotes.some(localQuote => localQuote.text === serverQuote.text && localQuote.category === serverQuote.category)
          );
          if (newQuotes.length > 0) {
              quotes.push(...newQuotes);
              saveQuotes();
              populateCategories();
              alert('Quotes updated from server!');
          }
      } catch (error) {
          console.error('Fetch error:', error);
      }
  }

  newQuoteButton.addEventListener('click', showRandomQuote);
  importFileInput.addEventListener('change', importFromJsonFile);
  exportButton.addEventListener('click', exportToJsonFile);

  // Initial setup
  populateCategories();
  filterQuotes();
  createAddQuoteForm();

  // Load last viewed quote from session storage
  const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
  if (lastViewedQuote) {
      quoteDisplay.innerHTML = `<p>${lastViewedQuote.text}</p><p><em>${lastViewedQuote.category}</em></p>`;
  }

  // Periodically fetch quotes from server
  setInterval(fetchQuotesFromServer, 60000); // Fetch new quotes every 60 seconds
});
