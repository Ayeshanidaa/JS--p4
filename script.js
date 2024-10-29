const groceryForm = document.getElementById('grocery-form');
const groceryList = document.getElementById('grocery-list');

let groceries = [];

function loadGroceries() {
    const storedGroceries = localStorage.getItem('groceries');
    if (storedGroceries) {
        groceries = storedGroceries.split(';').filter(item => item); 
    }
}


function saveGroceries() {
    localStorage.setItem('groceries', groceries.join(';'));
}

function renderGroceryList() {
    groceryList.innerHTML = '';
    groceries.forEach((grocery, index) => {
        const [item, expirationDate] = grocery.split(',');
        const li = document.createElement('li');
        li.textContent = `${item} - Expire on: ${expirationDate}`;
        
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', () => {
            deleteGroceryItem(index);
        });
        
        if (isExpired(expirationDate)) {
            li.classList.add('expired');
        }
        
        li.appendChild(deleteButton);
        groceryList.appendChild(li);
    });
}


function isExpired(expirationDate) {
    const today = new Date();
    const expiryDate = new Date(expirationDate);
    return expiryDate < today;
}


groceryForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const item = document.getElementById('item').value;
    const expirationDate = document.getElementById('expiration-date').value;

    groceries.push(`${item},${expirationDate}`); 
    saveGroceries(); 
    renderGroceryList();

    
    checkExpiringItems();

    groceryForm.reset();
});


function deleteGroceryItem(index) {
    groceries.splice(index, 1);
    saveGroceries(); 
    renderGroceryList();
}


function checkExpiringItems() {
    const warningPeriod = 3;
    const today = new Date();
    
    groceries.forEach(grocery => {
        const [item, expirationDate] = grocery.split(',');
        const expiryDate = new Date(expirationDate);
        const timeDiff = (expiryDate - today) / (1000 * 3600 * 24);
        
        if (timeDiff <= warningPeriod && timeDiff >= 0) {
            alert(`Warning: "${item}" is expiring in ${Math.ceil(timeDiff)} day(s)!`);
        }
    });
}

loadGroceries();

renderGroceryList();
