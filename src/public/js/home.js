const socket = io();

socket.on('products', (data) => {
    let productList = document.getElementById('productList');
    productList.innerHTML = '';
    data.forEach((product) => {
        productList.innerHTML += `<li>${product.title}</li>`;
    });
});


socket.on('post_event', (data) => {
    let productList = document.getElementById('productList');
    productList.innerHTML = '';
    data.forEach((product) => {
        productList.innerHTML += `<li>${product.title}</li>`;
    });
});

socket.on('delete_event', (data) => {
    let productList = document.getElementById('productList');
    productList.innerHTML = '';
    data.forEach((product) => {
        productList.innerHTML += `<li>${product.title}</li>`;
    });
});