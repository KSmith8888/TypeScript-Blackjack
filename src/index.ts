const productsSection = document.getElementById('products-section') as HTMLElement;
const openModal = document.getElementById('open-modal') as HTMLButtonElement;
const shoppingCart = document.getElementById('shopping-cart') as HTMLDialogElement;
const closeCartBtn = document.getElementById('close-cart-button') as HTMLButtonElement;

openModal.addEventListener('click', () => {
    shoppingCart.showModal();
});

closeCartBtn.addEventListener('click', () => {
    shoppingCart.close();
});

function getProductHTML(productInfo: { name: string; price: number;}) {
    return `<p>${productInfo.name}: $${productInfo.price}</p>`;
}

function displayProducts(productsArray: { name: string; price: number;}[]) {
    productsArray.forEach((product: { name: string; price: number;}) => {
        productsSection.innerHTML += getProductHTML(product)
    })
}

function getProducts() {
    fetch('./Data/products.json')
        .then((response) => {
            if(response.ok) {
                return response.json();
            } else {
                throw new Error(`Response error: ${response.status}`);
            }
        })
        .then((data) => {
            displayProducts(data);
        })
        .catch((err) => console.error(err));
}

getProducts();
