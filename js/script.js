/* This function is for Hamburger menu */
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

// navigate to home
const logo = document.getElementById("logo")
logo.addEventListener("click", () => {
    document.location = "../home.html"
})


let currentPage = 1
let searchTerm = ""
let dropDownFilterValue = ""

/* Load All book data */
const loadBookData = (page = 1) => {

    const searchQuery = searchTerm ? `&search=${searchTerm}` : ""
    const dropDownQuery = dropDownFilterValue ? `&topic=${dropDownFilterValue}` : ""


    fetch(`https://gutendex.com/books?page=${page}${searchQuery}${dropDownQuery}`)
        .then((res) => res.json())
        .then(data => {
            displayBookData(data.results)
            spinner(false)
        })
        .catch(error => {
            console.log(error)
            spinner(false)
        })
    spinner(true)
}


/* Pagination Functions */
const pagination = () => {

    const nextButton = document.getElementById("next-button")
    const prevButton = document.getElementById("prev-button")


    // prevButton.disabled = currentPage <= 1;

    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            loadBookData(currentPage);
            // pagination();
        }
    });


    nextButton.addEventListener("click", () => {
        currentPage++
        loadBookData(currentPage)
    })

}


/* Search Function */
const searchFunction = () => {
    const searchInput = document.getElementById("search-input")
    const bookListContainer = document.getElementById("book-list")


    searchInput.addEventListener("input", (e) => {
        bookListContainer.innerHTML = ""
        searchTerm = e.target.value
        loadBookData()
    })
}

/* Drop Down Filter */

const dropDownFilter = () => {
    const dropDown = document.getElementById("filter-select")
    const bookListContainer = document.getElementById("book-list")

    dropDown.addEventListener("input", (e) => {
        bookListContainer.innerHTML = ""
        dropDownFilterValue = e.target.value
        loadBookData()
    })
}

/* wishlist Option */
let storeSingleBook = {}

/* Display Book Data */
const displayBookData = (books) => {

    const bookListContainer = document.getElementById("book-list")
    const bookRow = document.createElement("div")
    bookListContainer.innerHTML = ""
    bookRow.classList.add("book-row")

    books.forEach(book => {
        const { authors, bookshelves, copyright, formats, id, subjects, title } = book
        storeSingleBook[id] = book

        const bookDiv = document.createElement("div")
        bookDiv.classList.add("book", "fade-left")

        bookDiv.innerHTML = `
        <div>
            <img src="${formats["image/jpeg"]}" alt="${title}" />
            <div class="author-wrapper">
                <p class="author">Author: ${authors[0]?.name}</p>
                <p class="author">ID: ${id}</p>
            </div>
            <h3 class="title">${title.slice(0, 50) + "..."}</h3>
            

        <div class="overlay">
            <p class="overlay-btn wishlist-btn" data-book-id="${book.id}" id="wishlist"> 
              <i class="fa-regular fa-heart"></i>
            </p>
            <p class="overlay-btn" >
              <i class="fa-solid fa-cart-shopping"></i>
            </p>
            <p class="overlay-btn">
              <i class="fa-solid fa-eye"></i>
            </p>
        </div>
        </div>
        `


        bookRow.appendChild(bookDiv)
        bookListContainer.appendChild(bookRow)

    });


    spinner(false)


}


// Spinner 
const spinner = (isLoaded) => {
    const spinnerContainer = document.getElementById('spinner-container')
    if (isLoaded) {
        spinnerContainer.style.cssText = 'display:flex'
    }
    else {
        spinnerContainer.style.cssText = "display:none"
    }
}



const bookList = document.getElementById("book-list")
bookList.addEventListener("click", (event) => {
    if (event.target.closest('.wishlist-btn')) {
        const wishlistButton = event.target.closest('.wishlist-btn');
        const bookId = wishlistButton.getAttribute('data-book-id');


        const book = storeSingleBook[bookId]
        addToWishlist(book);
    }
});

const getFromLocalStorage = (storeName) => {
    const data = localStorage.getItem(storeName)
    return data ? JSON.parse(data) : [];
}

const setIntoLocalStorage = (storeName, data) => {
    return localStorage.setItem(storeName, JSON.stringify(data))
}

const addToWishlist = (book) => {
    let bookForAddInLocalStorage = getFromLocalStorage("wishlist") || [];

    const isExistProduct = bookForAddInLocalStorage.find(
        (item) => item.id === book.id
    );

    if (!isExistProduct) {
        bookForAddInLocalStorage.push(book)
        setIntoLocalStorage("wishlist", bookForAddInLocalStorage);
        alert(`${book.title} has been added to the wishlist!`);
    } else {
        alert(`Book is already exist`);
    }

};



dropDownFilter()
searchFunction()
loadBookData()
pagination()