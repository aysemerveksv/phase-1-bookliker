document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display books
    fetch('http://localhost:3000/books')
      .then(response => response.json())
      .then(books => {
        const list = document.getElementById('list');
        books.forEach(book => {
          const li = document.createElement('li');
          li.textContent = book.title;
          li.addEventListener('click', () => showBookDetails(book));
          list.appendChild(li);
        });
      });
  });
  
  function showBookDetails(book) {
    const showPanel = document.getElementById('show-panel');
    showPanel.innerHTML = `
      <h2>${book.title}</h2>
      <img src="${book.thumbnail}" alt="Book Thumbnail">
      <p>${book.description}</p>
      <h3>Liked by:</h3>
      <ul>
        ${book.users.map(user => `<li>${user.username}</li>`).join('')}
      </ul>
      <button id="like-button">LIKE</button>
    `;
  
    const likeButton = document.getElementById('like-button');
    likeButton.addEventListener('click', () => toggleLike(book));
  }
  
  function toggleLike(book) {
    const userId = 1; // Assuming user ID 1 for simplicity
    const showPanel = document.getElementById('show-panel');
    const userLiked = book.users.some(user => user.id === userId);
  
    if (userLiked) {
      // Remove user from likes
      book.users = book.users.filter(user => user.id !== userId);
    } else {
      // Add user to likes
      book.users.push({ id: userId, username: 'pouros' });
    }
  
    fetch(`http://localhost:3000/books/${book.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ users: book.users })
    })
    .then(response => response.json())
    .then(updatedBook => {
      // Update the book details in the DOM
      showBookDetails(updatedBook);
    });
  }
