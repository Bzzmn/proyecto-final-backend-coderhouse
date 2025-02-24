document.addEventListener('DOMContentLoaded', () => {
    // Add to cart buttons
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    if (buttons.length > 0) {
        buttons.forEach(button => {
            button.addEventListener('click', async (event) => {
                event.preventDefault();

                const productId = button.getAttribute('data-id');
                const p_price = button.getAttribute('p_price');
                const p_stock = button.getAttribute('p_stock');
                const p_image = button.getAttribute('p_image');
                const p_title = button.getAttribute('p_title');
                const p_category = button.getAttribute('p_category');
                const p_code = button.getAttribute('p_code');
                const p_status = button.getAttribute('p_status');

                const quantityInput = document.querySelector(`#counter-input-${productId}`);
                const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
                console.log('Cantidad seleccionada:', quantity);

                try {
                    // Obtener el carrito actual del localStorage
                    let currentCart;
                    try {
                        currentCart = JSON.parse(localStorage.getItem('cart'));
                        if (!currentCart || !Array.isArray(currentCart)) {
                            console.log('Inicializando nuevo carrito vacío');
                            currentCart = [];
                        }
                    } catch (error) {
                        console.log('Error al parsear el carrito, inicializando nuevo carrito');
                        currentCart = [];
                    }
                    console.log('Carrito actual:', currentCart);
                    
                    // Buscar si el producto ya existe en el carrito
                    const existingProductIndex = currentCart.findIndex(item => item.productCode === p_code);
                    console.log('¿Producto existe en carrito?:', existingProductIndex !== -1);
                    
                    if (existingProductIndex !== -1) {
                        // Si el producto existe, actualizar la cantidad
                        currentCart[existingProductIndex].quantity += quantity;
                        console.log('Cantidad actualizada para producto existente:', currentCart[existingProductIndex]);
                    } else {
                        // Si el producto no existe, agregarlo al carrito
                        currentCart.push({
                            productId: productId,
                            productCode: p_code,
                            quantity: quantity,
                            productPrice: p_price,
                            productStock: p_stock,
                            productImage: p_image,
                            productTitle: p_title,
                            productCategory: p_category,
                            productStatus: p_status
                        });
                        console.log('Nuevo producto agregado al carrito:', currentCart[currentCart.length - 1]);
                    }
                    
                    // Guardar el carrito actualizado
                    localStorage.setItem('cart', JSON.stringify(currentCart));
                    console.log('Carrito guardado en localStorage:', currentCart);
                    
                    // Calcular y actualizar la cantidad total
                    const totalQuantity = currentCart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
                    console.log('Nueva cantidad total:', totalQuantity);
                    localStorage.setItem('cartQuantity', totalQuantity.toString());
                    
                    // Actualizar el badge del carrito
                    if (window.updateCartBadge) {
                        window.updateCartBadge();
                        console.log('Badge del carrito actualizado');
                    }
                    
                    if (window.showToast) {
                        showToast('Producto agregado al carrito exitosamente!', 'success');
                    } else {
                        console.warn('Función showToast no disponible');
                    }
                } catch (error) {
                    console.error('Error en el proceso:', error);
                    if (window.showToast) {
                        showToast('Hubo un problema al agregar el producto al carrito.', 'error');
                    } else {
                        alert('Hubo un problema al agregar el producto al carrito.');
                    }
                }
            });
        });
    }

    // Remove buttons
    const removeButtons = document.querySelectorAll('.remove-btn');
    if (removeButtons.length > 0) {
        removeButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                event.preventDefault();

                const productId = button.getAttribute('data-id');
                console.log('Intentando eliminar producto:', productId);

                const confirmed = confirm('¿Estás seguro de que quieres eliminar este producto del carrito?');
                if (confirmed) {
                    try {
                        // Obtener el carrito actual
                        const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
                        console.log('Carrito antes de eliminar:', currentCart);

                        // Encontrar el producto a eliminar
                        const productIndex = currentCart.findIndex(item => item.productId === productId);
                        console.log('Índice del producto a eliminar:', productIndex);

                        if (productIndex !== -1) {
                            // Guardar la cantidad que se va a eliminar
                            const removedQuantity = currentCart[productIndex].quantity;
                            console.log('Cantidad a eliminar:', removedQuantity);

                            // Eliminar el producto del array
                            currentCart.splice(productIndex, 1);
                            
                            // Actualizar el carrito en localStorage
                            localStorage.setItem('cart', JSON.stringify(currentCart));
                            console.log('Carrito actualizado:', currentCart);

                            // Actualizar la cantidad total
                            const newQuantity = currentCart.reduce((sum, item) => sum + item.quantity, 0);
                            localStorage.setItem('cartQuantity', newQuantity.toString());
                            console.log('Nueva cantidad total:', newQuantity);

                            alert('Producto eliminado del carrito exitosamente!');

                            // Actualizar badge del carrito
                            if (window.updateCartBadge) {
                                window.updateCartBadge();
                                console.log('Badge del carrito actualizado');
                            }

                            // Eliminar el elemento visual
                            const productCard = document.querySelector(`#product-card-${productId}`);
                            if (productCard) {
                                productCard.remove();
                                console.log('Elemento visual eliminado');
                            }

                            window.location.reload();
                        } else {
                            console.log('Producto no encontrado en el carrito');
                            alert('No se encontró el producto en el carrito');
                        }
                    } catch (error) {
                        console.error('Error al eliminar producto:', error);
                        alert('Hubo un problema al eliminar el producto del carrito.');
                    }
                }
            });
        });
    }

    // Limit input
    const limitInput = document.getElementById('limit');
    if (limitInput) {
        limitInput.addEventListener('input', function () {
            const limitValue = document.getElementById('limitValue');
            if (limitValue) {
                limitValue.textContent = this.value;
            }
        });
    }

    // Logout button
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});

// Función para inicializar la cantidad del carrito
async function initializeCartQuantity() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalQuantity = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
        localStorage.setItem('cartQuantity', totalQuantity.toString());
        console.log('Cantidad total inicializada:', totalQuantity);
    } catch (error) {
        console.error('Error al inicializar la cantidad del carrito:', error);
        localStorage.setItem('cartQuantity', '0');
    }

    if (window.updateCartBadge) {
        window.updateCartBadge();
        console.log('Badge inicializado');
    }
}

// Llamar a initializeCartQuantity cuando se carga la página
document.addEventListener('DOMContentLoaded', initializeCartQuantity);

// Logout function
async function logout(event) {
    if (!event) return; // Guard clause
    event.preventDefault();
    try {
        const response = await fetch('/api/users/logout', {
            method: 'POST',
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            alert(data.message);
            localStorage.removeItem('cartQuantity');
            window.location.href = '/';
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        alert('Hubo un problema al cerrar la sesión.');
    }
}