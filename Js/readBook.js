
/*---------Fetch Book Detaiks-------------*/
console.log(1)


/*---------Constructing Books-------------*/



/*---------Hide Description-------------*/


document.body.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('hideDescription')) {
        const button = e.target;
        const popoverr = button.closest('.popoverr');
        const hoverBooks = document.body.querySelectorAll('.notHover')
        const blackScreen = document.body.querySelector('.blackScreen')
        hoverBooks.forEach((hoverBook) =>{
            hoverBook.classList.remove('notHover')
            hoverBook.classList.add('haveHover')
        })
        popoverr.remove()
        blackScreen.remove()
    }
});

/*---------Show Description-------------*/
document.getElementById('cards-container').addEventListener('click', (e) => {
    if (e.target && e.target.closest('.showDescription')) {
        const button = e.target.closest('.showDescription');
        const book = button.closest('.card');
        const desc = book.querySelector('.popoverr'); // Corrected to use class name
        const newDesc = desc.cloneNode(true)
        const hoverBooks = document.body.querySelectorAll('.haveHover')
        hoverBooks.forEach((hoverBook) =>{
            hoverBook.classList.remove('haveHover')
            hoverBook.classList.add('notHover')
        })
        let blackScreen = document.createElement('div')
        blackScreen.classList.add('blackScreen')
        document.body.append(newDesc)
        newDesc.classList.add('popoverr-visible');
        document.body.append(blackScreen)
        setTimeout(() => {blackScreen.style.opacity = .9; newDesc.style.opacity = 1;}, 200);
        const bodyClickHandler = (e) => {
            if (!e.target.closest('.descriptionBox') && !e.target.closest('.showDescription')) {
                const hoverBooks = document.body.querySelectorAll('.notHover')
                hoverBooks.forEach((hoverBook) =>{
                    hoverBook.classList.remove('notHover')
                    hoverBook.classList.add('haveHover')
                })
                newDesc.remove()
                blackScreen.remove()
                document.removeEventListener('click', bodyClickHandler);
            }
        };
        document.addEventListener('click', bodyClickHandler);
    }
});




/*---------Cart Items-------------*/
let numOfItems = 0; // Use 'let' instead of 'const' to allow updates
const cartNumb = document.getElementById('num');
let noItemsDiv = document.createElement('div');
let purchases =  document.getElementById('allPurchasedItems');
let checkout = document.querySelector('.checkout')
let Totalprice = 0;

localStorage.setItem('key', Totalprice)
noItemsDiv.innerHTML = "<p>No item in the cart</p><img src='images/empty cart.png' class='emptyCart'>"
noItemsDiv.classList.add('noItemsDiv')
if(numOfItems == 0){
    checkout.style.display = "none";
    cartNumb.style.display="none";
    purchases.append(noItemsDiv);
}
/*---------Clicking on buy-------------*/

document.getElementById('cards-container').addEventListener('click', (e) => {
    if (e.target && e.target.closest('.buy')) {
        const button = e.target.closest('.buy');
        const parent = e.target.closest('.card')
        const title = parent.querySelector('.bookTitle').innerHTML
        const imgUrl = parent.querySelector('.bookImg').src;
        const price = parent.querySelector('.price')
        let priceInNumber = price.innerHTML.slice(0, -2);
        console.log(priceInNumber)
        Totalprice += Number(priceInNumber);
        localStorage.setItem('key', Totalprice)
        console.log(Totalprice)
        // console.log(button.disapled)
        if(button.disapled == false || !button.disapled){addPurchasedItem(title, imgUrl, priceInNumber, button);}
        if (!button.classList.contains('bought')) {
            button.classList.add('bought'); // Add the 'bought' class to mark as purchased
            button.innerHTML = `تم الشراء <i class="fa-solid fa-cart-flatbed"></i>`;
            numOfItems++; 
            cartNumb.innerHTML = numOfItems; // Update cart number display
            button.disapled = 1;
            cartNumb.style.display="";
        }
    }
});
/*---------Clicking on Cart-------------*/
document.getElementById('cart').addEventListener('click', (e) => {
    if (!e.target.closest('.purchases')) {
        let parent = e.target.closest('.cart');
        const purchases = parent.querySelector('.purchases');
        if (purchases.classList.contains('show')) {
            // Start fading out by removing the show class
            purchases.classList.remove('show');
            // Wait for the opacity transition to finish before hiding the element
            setTimeout(() => {
                purchases.style.visibility = 'hidden';
            }, 200); // This matches the transition duration (0.5s)
            
        } else {
            // Make it visible immediately, then trigger the opacity animation
            purchases.style.visibility = 'visible';
            purchases.classList.add('show');
            const bodyClickHandler = (e) => {
                if (!e.target.closest('.purchases') && !e.target.closest('.cart')) {
                    purchases.classList.remove('show');
                    
                    // Wait for the opacity transition to finish before hiding the element
                    setTimeout(() => {
                        purchases.style.visibility = 'hidden';
                    }, 200); // This matches the transition duration (0.2s)
                    console.log(e.target.tagName)
                    
                    // Remove the body event listener once the task is done
                    document.removeEventListener('click', bodyClickHandler);
                }
            };
            document.addEventListener('click', bodyClickHandler);
        }
    }
});


/*---------Remove Items-------------*/
document.getElementById('cart').addEventListener('click', (e) =>{
    if(e.target.closest('.removeAddedItem')){
        e.stopPropagation();  // Prevent the event from bubbling to the body click handler
        let cancelButton = e.target.closest('.removeAddedItem')
        let newPurchasedItem = e.target.closest('.purchasedItems')
        let purchaseButtonId = cancelButton.dataset.button
        let purchaseButton = document.getElementById(purchaseButtonId);
        let parent = purchaseButton.closest('.card');
        let price = parent.querySelector('.price')
        let priceInNumber = price.innerHTML.slice(1);
        console.log(parent)
        // let priceInNumber = price.innerHTML.slice(1);
        Totalprice -= Number(priceInNumber);
        localStorage.setItem('key', Totalprice)

        if(purchaseButton){
            purchaseButton.classList.remove('bought'); 
            purchaseButton.innerHTML = `اشترى <i class="fa-solid fa-cart-plus"></i>`;
            purchaseButton.disapled = 0;
        }
        numOfItems--; // Decrement number of items
        cartNumb.innerHTML = numOfItems; // Update cart number display
        newPurchasedItem.remove();
        if(numOfItems == 0){
            cartNumb.style.display="none";
            purchases.append(noItemsDiv);
            checkout.style.display = "none";

        }
        
    }
})
/*---------Add Items--------------*/
function addPurchasedItem(title, imgUrl, priceInNumber, button){
    let newPurchasedItem = document.createElement('div')
    newPurchasedItem.classList.add('purchasedItems')
    newPurchasedItem.innerHTML = ` 
        <img src="${imgUrl}" class="purchasedItemsImg">
        <div class="purchasedItemsName">
            <p class='purchasedItemsTitle'>${title}</p>
            <p class='purchasedItemsPrice'>${priceInNumber}$</p>
        </div>
       <button class="removeAddedItem" data-button="${button.id}">x</button>
    `
    noItemsDiv.remove()
    checkout.style.display = "block";
    purchases.append(newPurchasedItem)
    let addedNotification = document.createElement('div');
    addedNotification.classList.add('AddedNotification')
    addedNotification.innerHTML = "<h3>an item was added</h3><img src='images/done (1).gif' class='doneGif'></img>";
    document.body.append(addedNotification)
    setTimeout(() => addedNotification.remove(), 2000)
}
function cleanDescription(description) {
    // Remove any text after a specific delimiter, e.g., "([source]"
    const delimiterIndex = description.indexOf('([source]');
    return delimiterIndex !== -1 ? description.substring(0, delimiterIndex).trim() : description;
}

// Function to find the English edition or fallback to the first edition
function findEnglishEdition(book) {
    const englishEdition = book.edition_key && book.language && book.language.includes('eng')
        ? book.edition_key[1]
        : book.edition_key ? book.edition_key[1] : book.key;

    return `https://openlibrary.org/books/${englishEdition}`;
}

// Function to fetch the book description using the work key
function getBookDetails(bookId) {
    return fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}`)
        .then(response => response.json())
        .then(data => {
            const description = data.volumeInfo.description || 'No description available';
            const categories = data.volumeInfo.categories ? data.volumeInfo.categories : 'No genre available';
            return {
                description: description,
                categories: categories
            };
        })
        .catch(error => {
            console.error('Error fetching book details:', error);
            return {
                description: 'No description available',
                categories: 'No genre available'
            };
        });
}


function displayError(message) {
    const container = document.getElementById('cards-container');
    container.innerHTML = `<p>${message}</p>`;
}

function Genre(){
    let books = document.querySelectorAll('.book')
    books.forEach((book) =>{
        let genres = book.dataset.genre
        console.log(1);
        if(genres.indexOf('romance') && -1 || genres.indexOf('Romance') === -1){
            book.hidden = 1;
        }
    })
}
document.querySelectorAll('.genre').forEach((button) => {
    button.addEventListener('click', (e) => {
        let books = document.querySelectorAll('.card');
        let visibleBooksCount = 0; // Counter to track visible books
        let type = e.target.dataset.type;
        let active = document.body.querySelector('.active')
        active.classList.remove('active');
        e.target.classList.add('active')
        document.getElementById('no-items-message')?.remove();
        books.forEach((book) => {
            let genres = book.dataset.genre;
            if(type === "allBooks"){
                visibleBooksCount++; 
                book.style.display = ''; // Show the book
            }
            else {
                if (genres.toLowerCase().includes(type.toLowerCase())) {
                    book.style.display = ''; // Show the book
                    visibleBooksCount++; // Increment count of visible books
                } else {
                    book.style.display = 'none'; // Hide the book
                }
            }
        });
        if (visibleBooksCount === 0) {
            const noItemsMessage = document.createElement('p');
            noItemsMessage.id = 'no-items-message'; 
            noItemsMessage.textContent = 'No items available for this genre.';
            document.getElementById('cards-container').appendChild(noItemsMessage);
        }
    });
});
document.querySelectorAll('input[name=category]').forEach((input) => {
    input.addEventListener('click', (e) => {
        let genres = Array.from(document.querySelectorAll('input[name=category]:checked')).map(inp => inp.value);
        let bookFound = false; // To track if any book is still visible
        document.querySelectorAll('.card').forEach((book) => {
            // Get the book's genres as an array
            let bookGenres = book.getAttribute('genre').toLowerCase().split(',').map(genre => genre.trim());

            // Check if the book contains all selected genres
            if (genres.every(genre => bookGenres.includes(genre.toLowerCase()))) {
                book.style.display = ''; // Show the book
                bookFound = true;
            } else {
                book.style.display = 'none'; // Hide the book
            }
        });
        if(!bookFound){
            if(!document.getElementById('noBook')){
                let noBooks = document.createElement('div');
                noBooks.innerHTML = "<img src = 'images/sign-159285_1280.png' width='200px'><h2>No Book Has Been Found</h2>";
                noBooks.id = 'noBook';
                noBooks.classList.add('noBookFound')
                document.getElementById('cards-container').append(noBooks)
            }
        }
        else{
            if(document.getElementById('noBook'))document.getElementById('noBook').remove()
        }
    });
});
