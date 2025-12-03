// goodbooksHelpers.mjs
// Small helper functions based on your Goodbooks Review logic
// created by Muhammadmehdi 

// Same credentials as in script.js
export const USER = "reader";
export const PASS = "1234";

// 1) Check if login is valid
export function isLoginValid(username, password) {
  return username === USER && password === PASS;
}

// 2) Build the Google Books API URL from a search term
export function buildGoogleBooksUrl(query) {
  return (
    "https://www.googleapis.com/books/v1/volumes?q=" +
    encodeURIComponent(query)
  );
}
