const getFromLocalStorage = (storeName) => {
  const data = localStorage.getItem(storeName)
  return data ? JSON.parse(data) : [];
}

const setIntoLocalStorage = (storeName, data) => {
  return localStorage.setItem(storeName, JSON.stringify(data))
}

const showWishlistItems = () => {
  const data = getFromLocalStorage("wishlist")

  const wishlistItemsWrapper = document.getElementById("wishlist-items")
  wishlistItemsWrapper.innerHTML = '';


  data.forEach(item => {

    const wishlistItem = document.createElement("li")
    wishlistItem.classList.add("wishlist-item", "fade-left")
    const { authors, bookshelves, copyright, formats, id, subjects, title } = item

    wishlistItem.innerHTML = `
            <div class="item-details">
              <img class="item-image" src="${formats["image/jpeg"]}" alt="${title}">
              <div class="item-info fade-in">
                <div class="item-desc">
                  <h3>${title}</h3>
                  <p>${authors[0].name}</p>
                </div>
              </div>
              <div class="">
                <button class="btn-remove fade-right" book-id="${id}"><i class="fa-solid fa-xmark"></i></button>
              </div>
            </div>
          `

    wishlistItemsWrapper.appendChild(wishlistItem)
  });

  removeEvent()
}

const removeEvent = () => {
  const removeButtons = document.querySelectorAll(".btn-remove");

  removeButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      const bookId = e.target.closest(".btn-remove").getAttribute("book-id");
      removeFromWishList(bookId);
    });
  });
}

const removeFromWishList = (bookId) => {

  const data = getFromLocalStorage("wishlist");
  const removeItem = data.filter((item) => item.id !== Number(bookId))

  setIntoLocalStorage("wishlist", removeItem);
  showWishlistItems();
}

showWishlistItems()