"use strict";
const productsSection = document.getElementById('products-section');
const openModal = document.getElementById('open-modal');
const shoppingCart = document.getElementById('shopping-cart');
const closeCartBtn = document.getElementById('close-cart-button');
openModal.addEventListener('click', () => {
    shoppingCart.showModal();
});
closeCartBtn.addEventListener('click', () => {
    shoppingCart.close();
});
function getProductHTML(productInfo) {
    return `<p>${productInfo.name}: $${productInfo.price}</p>`;
}
function displayProducts(productsArray) {
    productsArray.forEach((product) => {
        productsSection.innerHTML += getProductHTML(product);
    });
}
function getProducts() {
    fetch('./Data/products.json')
        .then((response) => {
        if (response.ok) {
            return response.json();
        }
        else {
            throw new Error(`Response error: ${response.status}`);
        }
    })
        .then((data) => {
        displayProducts(data);
    })
        .catch((err) => console.error(err));
}
getProducts();
