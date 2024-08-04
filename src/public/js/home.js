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


document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let productData = {
        title: formData.get('title'),
        description: formData.get('description'),
        code: formData.get('code'),
        price: formData.get('price'),
        status: true,
        stock: formData.get('stock'),
        category: formData.get('category')
    };

    // Función de validación
    const isValid = Object.values(productData).every(value => value !== null && value !== '');

    if (isValid) {
        socket.emit('new_product', productData);
        e.target.reset();
    } else {
        alert('Por favor, completa todos los campos del formulario.');
    }
});