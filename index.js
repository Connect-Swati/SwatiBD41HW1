const { error } = require("console");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const app = express();
const PORT = process.env.PORT || 3000;
let db;

(async () => {
  db = await open({
    filename: "books_database.sqlite",
    driver: sqlite3.Database,
  });
})();

app.get("/", (req, res) => {
  res.status(200).json({ message: "BD4.1 HW1" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/*
self study ---->

used try catch and various  error handling
validating the database connection before attempting to fetch the data 
*/

/*
Exercise 1: Fetch All Books

Create an endpoint /books return all the books

Create a function fetchAllBooks to fetch all the books from the database.

API Call:

http://localhost:3000/books

Expected Output:

{
  'books': [
    {
      'id': 1,
      'title': 'To Kill a Mockingbird',
      'author': 'Harper Lee',
      'genre': 'Fiction',
      'publication_year': 1960
    },
    {
      'id': 2,
      'title': '1984',
      'author': 'George Orwell',
      'genre': 'Dystopian',
      'publication_year': 1949
    }
    ...
  ]
}*/

// function to fetch all books

/*
This function is defined as async, which means it can use the await keyword to wait for asynchronous operations (like database queries) to complete.
*/

async function fetchAllBooks() {
  let query = "SELECT * FROM books";
  try {
    if (!db) throw new Error("Database connection not established"); //validating the database connection before attempting to fetch the data
    let result = await db.all(query); // Execute the query and await the result
    return result;
  } catch (error) {
    //The error object contains details about what went wrong.
    console.log("Error in fetching all books", error.message);
    throw error; //This re-throws the error so it can be handled by the calling function (in this case, the endpoint handler).
  }
}

// endpoint to fetch all books
app.get("/books", async (req, res) => {
  try {
    let result = await fetchAllBooks(); // Call the fetchAllBooks function and await the result
    return res.status(200).json({ books: result }); // Send a 200 OK response with the books data
  } catch (error) {
    return res.status(500).json({ error: error.message }); // Send a 500 Internal Server Error response with the error message
  }
});

/*
Exercise 2: Fetch Books by Author

Create an endpoint /books/author/:author return all the books by a specific author.

Create a function fetchBooksByAuthor to fetch all the books by an author from the database.

API Call:

http://localhost:3000/books/author/George%20Orwell

Expected Output:

{
  'books': [
    {
      'id': 2,
      'title': '1984',
      'author': 'George Orwell',
      'genre': 'Dystopian',
      'publication_year': 1949
    },
    {
      'id': 3,
      'title': 'Animal Farm',
      'author': 'George Orwell',
      'genre': 'Political Satire',
      'publication_year': 1945
    }
  ]
}
*/

// function to fetch books by author

async function fetchBooksByAuthor(author) {
  let query = "SELECT * FROM books WHERE author = ?";
  try {
    if (!db) throw new Error(" Database connection no established");

    let result = await db.all(query, [author]);

    if (!result || result.length === 0)
      throw new Error("No books found by the given author");
    return result;
  } catch (error) {
    console.log("Error in fetching books by author", error.message);
    throw error;
  }
}

// endpoint to fetch books by author

app.get("/books/author/:author", async (req, res) => {
  let author = req.params.author;
  try {
    let result = await fetchBooksByAuthor(author);
    return res.status(200).json({ books: result });
  } catch (error) {
    if (error.message === "No books found by the given author") {
      return res.status(404).json({ error: error.messsage });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
});

/*
Exercise 3: Fetch Books by Genre

Create an endpoint /books/genre/:genre

Create a function fetchBooksByGenre to fetch all the books based on specific genre.

API Call:

http://localhost:3000/books/genre/Fiction

Expected Output:

{
  'books': [
    {
      'id': 1,
      'title': 'To Kill a Mockingbird',
      'author': 'Harper Lee',
      'genre': 'Fiction',
      'publication_year': 1960
    },
    {
      'id': 4,
      'title': 'Pride and Prejudice',
      'author': 'Jane Austen',
      'genre': 'Fiction',
      'publication_year': 1813
    }
  ]
}

*/

// function to fetch books by genre
async function fetchBooksByGenre(genre) {
  let query = "SELECT * FROM books WHERE genre = ?";
  try {
    if (!db) throw new Error("Database connection not established");

    let result = await db.all(query, [genre]);

    if (!result || result.length === 0) {
      console.log("No books found by the given genre");
      throw new Error("No books found by the given genre");
    }
    return result;
  } catch (error) {
    console.log("Error in fetching books by genre", error.message);
    throw error;
  }

  /*
  When an invalid or non-existent genre is requested:

The console should log "No books found by the given genre" followed by "Error in fetching books by genre No books found by the given genre".
The response should be a 404 status with the JSON { "status": 404, "error": "No books found by the given genre" }.
*/
}

// endpoint to fetch books by genre
app.get("/books/genre/:genre", async (req, res) => {
  let genre = req.params.genre;
  try {
    let result = await fetchBooksByGenre(genre);
    return res.status(200).json({ books: result });
  } catch (error) {
    if (error.message === "No books found by the given genre") {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});

/*
Exercise 4: Fetch Books by Publication Year

Create an endpoint /books/publication_year/:year return all the books

Create a function fetchBooksByPublicationYear to fetch all the books in a specific year.

API Call:

http://localhost:3000/books/publication_year/1960

Expected Output:

 {
  'books': [
    {
      'id': 1,
      'title': 'To Kill a Mockingbird',
      'author': 'Harper Lee',
      'genre': 'Fiction',
      'publication_year': 1960
    },
    {
      'id': 5,
      'title': 'Green Eggs and Ham',
      'author': 'Dr. Seuss',
      'genre': 'Children's literature',
      'publication_year': 1960
    }
  ]
}
*/

// function to fetch books by publication year
async function fetchBooksByPublicationYear(year) {
  let query = "SELECT * FROM books WHERE publication_year = ?";
  try {
    if (!db) throw new Error("Database connection not established");

    let result = await db.all(query, [year]);

    if (!result || result.length === 0) {
      console.log("No books found by the given publication year");
      throw new Error("No books found by the given publication year");
    }
    return result;
  } catch (error) {
    console.log("Error in fetching books by publication year", error.message);
    throw error;
  }
}

// endpoint to fetch books by publication year
app.get("/books/publication_year/:year", async (req, res) => {
  let year = req.params.year;
  try {
    let result = await fetchBooksByPublicationYear(year);
    return res.status(200).json({ books: result });
  } catch (error) {
    if (error.message === "No books found by the given publication year") {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});
