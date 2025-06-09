const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shopGET http://localhost:3000
// public_users.get('/',function (req, res) {
//   //Code done here
//   const data = JSON.stringify(books, null, 2); 
//   res.setHeader('Content-Type', 'application/json');
//   return res.status(200).send(data); 
// });

public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://api.example.com/books');
        const books = response.data;
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Code here
//   const isbn = req.params.isbn;
//   const book = books[isbn];
//   if (book) {
//     return res.status(200).json(book);
//   } else {
//     return res.status(404).json({ message: "Book not found" });
//   }
//  });

public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const response = await axios.get(`https://api.example.com/books/${isbn}`);
        const book = response.data;
        if (book) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book", error: error.message });
    }
});
  
// Get book details based on author
// p

public_users.get('/author/:author', async function (req, res) {
  const authorName = req.params.author;

  try {
    const response = await axios.get('http://localhost:5000'); 
    const booksData = response.data;

    const matchingBooks = Object.values(booksData).filter(book => book.author === authorName);

    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }

  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});



// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   const bookTitle = req.params.title;
//   const matchingBooks = [];

//   const allKeys = Object.keys(books);
  
//   allKeys.forEach(key => {
//     const book = books[key];
//     if (book.title === bookTitle) {
//       matchingBooks.push(book);
//     }
//   });

//   if (matchingBooks.length > 0) {
//     return res.status(200).json(matchingBooks);
//   } else {
//     return res.status(404).json({ message: "No books found by this author" });
//   }
// });

public_users.get('/title/:title', async function (req, res) {
  const bookTitle = req.params.title;

  try {
    const response = await axios.get('http://localhost:5000/books'); // adjust this route if needed
    const booksData = response.data;

    const matchingBooks = Object.values(booksData).filter(book => book.title === bookTitle);

    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks);
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }

  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
