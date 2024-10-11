document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    buttons.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();

            const productId = button.getAttribute('data-id');
            
            const quantityInput = document.querySelector(`#counter-input-${productId}`);
            const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

            try {
                const response = await fetch(`/api/carts`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        quantity: quantity, 
                        productId: productId
                     }),
                    credentials: 'include'
                });

                if (response.ok) {
                    const result = await response.json();
                    alert('Producto agregado al carrito exitosamente!');
                    
                    // Update cart quantity in local storage and UI
                    const currentQuantity = parseInt(localStorage.getItem('cartQuantity') || 0);
                    const newQuantity = currentQuantity + quantity;
                    localStorage.setItem('cartQuantity', newQuantity);
                    
                    // Update cart badge immediately
                    if (window.updateCartBadge) {
                        window.updateCartBadge();
                    }
                } else {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un problema al agregar el producto al carrito.');
            }
        });
    });

    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();

            const productId = button.getAttribute('data-id');

            const confirmed = confirm('¿Estás seguro de que quieres eliminar este producto del carrito?');
            if (confirmed) {
                try {
                    const response = await fetch(`/api/carts/product/${productId}`, {
                        method: 'DELETE',
                        credentials: 'include'
                    });

                    if (response.ok) {
                        const result = await response.json();
                        alert('Producto eliminado del carrito exitosamente!');

                        // Update cart quantity in local storage and UI
                        const currentQuantity = parseInt(localStorage.getItem('cartQuantity') || 0);
                        const newQuantity = Math.max(0, currentQuantity - result.removedQuantity);
                        localStorage.setItem('cartQuantity', newQuantity);
                        
                        // Update cart badge immediately
                        if (window.updateCartBadge) {
                            window.updateCartBadge();
                        }

                        const productCard = document.querySelector(`#product-card-${productId}`);
                        if (productCard) {
                            productCard.remove();
                        }

                        window.location.reload();

                    } else {
                        const errorData = await response.json();
                        alert(`Error: ${errorData.message}`);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Hubo un problema al eliminar el producto del carrito.');
                }
            }
        });
    });
});

async function initializeCartQuantity() {
    try {
        const response = await fetch('/api/carts/quantity', {
            credentials: 'include' // This ensures cookies are sent with the request
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('cartQuantity', data.quantity);
        } else {
            console.error('Error fetching cart quantity');
            localStorage.setItem('cartQuantity', '0');
        }
    } catch (error) {
        console.error('Error fetching cart quantity:', error);
        localStorage.setItem('cartQuantity', '0');
    }

    // Update the cart badge regardless of the outcome
    if (window.updateCartBadge) {
        window.updateCartBadge();
    }
}

// Call this function when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCartQuantity);
} else {
    initializeCartQuantity();
}

// Safely add event listener to limit input if it exists
document.addEventListener('DOMContentLoaded', () => {
    const limitInput = document.getElementById('limit');
    if (limitInput) {
        limitInput.addEventListener('input', function () {
            const limitValue = document.getElementById('limitValue');
            if (limitValue) {
                limitValue.textContent = this.value;
            }
        });
    }
});

async function logout(event) {
    event.preventDefault(); // Prevent the default link behavior
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

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', logout);

});