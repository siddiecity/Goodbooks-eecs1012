//login credentials 

const USER = "reader";
const PASS = "1234";
let attempts = 0;

// cover saved internally ( when the user saves a book review, the cover gets stored here) 
let selectedCover = ""; 

// Sections - to hide he other pages when not interacted with 
const loginSection = document.getElementById("loginSection");
const mainSection = document.getElementById("mainSection");

// Login elements
const loginButton = document.getElementById("loginButton");
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const loginMessage = document.getElementById("loginMessage");
const loginHint = document.getElementById("loginHint");

//URL where we will send our data
const apiUrl = 'http://localhost:8080/booktitle';

/* 
Preconditions:
- User enters a book title into the search bar
- setupBookSearch() calls sendResultTitle(title)

Post conditions:
- Console prints:
      sendResultTitle() WAS CALLED with: <title>
- Console prints server reply:
      Backend replied: { message, receivedTitle }
*/

//This function will send the searched book title to the back end.
function sendResultTitle( title ) {
console.log("sendResultTitle() WAS CALLED with:", title);

  const url = apiUrl + '?title=' + encodeURIComponent(title);
  fetch(url).then(response => {
    //If the server reports a problem, throw an error!
    if (!response.ok) { 
      throw new Error('Network response was not ok');
    }
    //If not, send the response down the line.
    return response.json(); 
  })
  .then(data => {
    // Show the server reply
    console.log("Backend replied:", data);
  })
  //Display any unexpected errors 
  .catch(error => {
    console.error('Error:', error); 
  });
}


loginButton.addEventListener("click", function () {
    //reads the users input for login credentials 
    const username = usernameInput.value;
    const password = passwordInput.value;

    // Gets rid of messages and error border
    loginMessage.textContent = "";
    loginHint.textContent = "";
    usernameInput.classList.remove("input-error");
    passwordInput.classList.remove("input-error");

    // Checks if credentials match 
    if (username === USER && password === PASS) {
        // If true = it hides the login page and shows the main 
        loginSection.classList.add("hidden");
        mainSection.classList.remove("hidden");
    } 
    else {
        // If false = allows 3 attempts, and shows error 
        attempts++;
        loginMessage.textContent = "Incorrect username or password.";
        usernameInput.classList.add("input-error");
        passwordInput.classList.add("input-error");

        if (attempts >= 3) {
            //Shows hint after 3 failed attempts 
            loginHint.textContent = "Hint: username = 'reader' and password = '1234'";
        }
    }
});

//logout button (it hides the Main page and shows the Login page)

const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", function () {
    mainSection.classList.add("hidden");
    loginSection.classList.remove("hidden");
});

/* 
Preconditions:
- User clicks a navigation button with a 'data-target'

Post conditions:
- All content sections become hidden
- The selected section becomes visible
*/
//menu navigation 
function setupNavigation() {
    // Select all the Menu buttons ( Home, Search, Previous Reveiws)
    const navButtons = document.querySelectorAll(".nav-button");

    navButtons.forEach(button => {
        button.addEventListener("click", function () {
            //What page does the button open (Linked to HTML "data-target")
            const target = button.getAttribute("data-target");

            // Hide all of the sections/pages 
            document.querySelectorAll(".content-section") .forEach(sec => sec.classList.add("hidden"));

            // Show only the section/pages that is selected 
            document.getElementById(target).classList.remove("hidden");
        });
    });
}
setupNavigation();

/* 
Preconditions:
- User types a book title into 'searchInput'

Post conditions:
- Console logs the title sent to the backend
- Google Books API returns matching results
- 5 book cards are shown on the page 
- If "Use this book" is clicked:
      - The review form is filled with the title
      - 'selectedCover' stores the book cover image
      - Page changes to the Homepage section
*/
//Googe books api
function setupBookSearch() {
    //Elements to search 
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const searchMessage = document.getElementById("searchMessage");
    const searchResults = document.getElementById("searchResults");
    

    //Run when the user submits in the search form 
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault(); // stops the page from refreshing else it will take you to login 
        
        // 
        let query = document.getElementById("searchInput").value.trim();
        sendResultTitle(query);


        const text = searchInput.value;
        //resets old searches/messages 
        searchResults.innerHTML = "";
        searchMessage.textContent = "";

        if (text === "") {
            searchMessage.textContent = "Please enter a book name.";
            return;
        }

        //API url for requests 
        const url = "https://www.googleapis.com/books/v1/volumes?q=" + encodeURIComponent(text);

        //fetches the data from google books 
        fetch(url)
            .then(res => res.json())
            .then(data => {
                searchResults.innerHTML = "";

                //error prompt if no results are found 
                if (!data.items) {
                    searchMessage.textContent = "No books found.";
                    return;
                }

                searchMessage.textContent = "Results:";

                // loop through for 5 books results  
                for (let i = 0; i < data.items.length && i < 5; i++) {
                    const book = data.items[i].volumeInfo;

                    //Getting book information 
                    const title = book.title || "Unknown Title";
                    const authors = book.authors ? book.authors.join(", ") : "Unknown Author";
                    const description = book.description || "No description available.";
                    const cover = book.imageLinks ? book.imageLinks.thumbnail : "";

                    // Creates result container for 
                    const card = document.createElement("div");
                    card.classList.add("book-result");

                    //If availible, it creates and inserts a book cover 
                    if (cover) {
                        const img = document.createElement("img");
                        img.src = cover;
                        card.appendChild(img);
                    }

                    // Creates container for information 
                    const info = document.createElement("div");
                    info.classList.add("book-info");
                
                    //Create info for book results 
                    const t = document.createElement("div");
                    t.classList.add("book-title");
                    t.textContent = title;

                    const a = document.createElement("div");
                    a.classList.add("book-authors");
                    a.textContent = authors;

                    const d = document.createElement("div");
                    d.classList.add("book-description");
                    d.textContent = description;
                
                    //Buttton for creating a review "use this book"
                    const useBtn = document.createElement("button");
                    useBtn.textContent = "Use this book";
                    useBtn.classList.add("use-book-btn");

                    useBtn.addEventListener("click", function () {

                        // If clicked it fills the review form with the book title
                        document.getElementById("bookTitleInput").value = title;
                        //saves the cover image for publishing 
                        selectedCover = cover;

                        // It switchs to home section
                        document.querySelectorAll(".content-section")
                            .forEach(sec => sec.classList.add("hidden"));

                        document.getElementById("homeSection").classList.remove("hidden");

                        //confirms Review has been published 
                        document.getElementById("publishMessage").textContent =
                            "Book selected: " + title + ".";
                    });

                    //attach everything to a card for local storage 
                    info.appendChild(t);
                    info.appendChild(a);
                    info.appendChild(d);
                    info.appendChild(useBtn);
                    card.appendChild(info);

                    //add the final card to results
                    searchResults.appendChild(card);
                }
            })
            .catch(error => {
                 console.error('Search error:', error);
            });
    });
}
setupBookSearch();

/* 
Preconditions:
- User enters: title, review text, rating, and completed date
- User clicks the 'publish button'

Post conditions:
- If any required input is empty then an error message appears
- If all user inputs are filled:
      - A review object is created
      - The review is saved in localStorage
      - All input boxes are cleared
      - "Review published!" message is shown
      - Previous Reviews page updates with the new review
*/
//publish review 
function setupPublishReview() {
    const publishBtn = document.getElementById("publishButton");
    
    publishBtn.addEventListener("click", function () {
        // Reads the users input from the review form
        const title = document.getElementById("bookTitleInput").value.trim();
        const text = document.getElementById("reviewTextInput").value.trim();
        const rating = document.getElementById("ratingInput").value;
        const dateCompleted = document.getElementById("dateCompletedInput").value;
        const msg = document.getElementById("publishMessage");

        //Clears any messages 
        msg.textContent = ""; 

        //Check if any info is missing else return error
        if (title === "" || text === "" || rating === "" || dateCompleted === "") {
            msg.textContent = "Please fill in all fields.";
            return;
        }

        //Review object that will be saved 
        const review = {
            title: title,
            text: text,
            rating: Number(rating),
            date: dateCompleted,
            coverUrl: selectedCover
        };

        //Save review into storage 
        saveReview(review);

        //when done, reset to blank for future input  
        document.getElementById("bookTitleInput").value = "";
        document.getElementById("reviewTextInput").value = "";
        document.getElementById("ratingInput").value = "";
        document.getElementById("dateCompletedInput").value = "";
        selectedCover = "";
        msg.textContent = "Review published!";

        // Save the review into 'previous reviews'
        showSavedReviews();
    });
}

setupPublishReview();


/* 
Preconditions:
- Function is called with a complete review object

Post conditions:
- Review is added to the existing localStorage array
- Updated array is saved back into "goodbooks_reviews"
*/

// Save Review (in users loacal storage)
function saveReview(review) {

    // Show reviews saved from previous sessions first 
    const reviews = loadReviews();

    //Add the new review to the array
    reviews.push(review);

    //Save back as a JSON string 
    localStorage.setItem("goodbooks_reviews", JSON.stringify(reviews));
}

/* 
Preconditions:
- localStorage may or may not contain "goodbooks_reviews"

Post conditions:
- Returns an array of saved reviews
- If none exist it returns an empty array
*/

//Load the reviews from local storage 
function loadReviews() {

    //If nothing found/saved then return an empty array 
    const data = localStorage.getItem("goodbooks_reviews");
    return data ? JSON.parse(data) : [];
}

/* 
Preconditions:
- User opens the Previous Reviews page
- loadReviews() returns an array

Post conditions:
- If no reviews then it displays "No reviews yet."
- If reviews exist then it creates a review card for each one
- Each card displays: cover, title, date, rating, and text
*/

// Previous reviews (Displayed)
function showSavedReviews() {
    const list = document.getElementById("reviewsList");

    //Load saved Reviews 
    const reviews = loadReviews();

    //Clear the list 
    list.innerHTML = "";

    //If theres not reviews = error message 
    if (reviews.length === 0) {
        list.textContent = "No reviews yet.";
        return;
    }

    //Creates containers for review info  
    reviews.forEach(review => {
        const card = document.createElement("div");
        card.classList.add("review-card");

        //Adds cover if its availible 
        if (review.coverUrl) {
            const img = document.createElement("img");
            img.src = review.coverUrl;
            img.classList.add("review-cover");
            card.appendChild(img);
        }

        const details = document.createElement("div");
        details.classList.add("review-details");

        const t = document.createElement("div");
        t.classList.add("review-title");
        t.textContent = review.title;

        const d = document.createElement("div");
        d.classList.add("review-date");
        d.textContent = "Completed: " + review.date;

        const r = document.createElement("div");
        r.classList.add("review-rating");
        r.textContent = "Rating: " + "★".repeat(review.rating);

        const tx = document.createElement("div");
        tx.classList.add("review-text");
        tx.textContent = review.text;

        //Adds the text to the corresponding container 
        details.appendChild(t);
        details.appendChild(d);
        details.appendChild(r);
        details.appendChild(tx);

        //Add everything to the review card / container 
        card.appendChild(details);

        //Adds the card to the page 
        list.appendChild(card);
    });
}

//When pages loads, always show the saved reviews 
showSavedReviews();

// commented so that it can run in browser
// export { USER, PASS };
