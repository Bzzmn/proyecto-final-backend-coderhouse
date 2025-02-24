document.addEventListener('DOMContentLoaded', () => {
    // Add to cart buttons
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    if (buttons.length > 0) {
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
    }

    // Remove buttons
    const removeButtons = document.querySelectorAll('.remove-btn');
    if (removeButtons.length > 0) {
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

async function initializeCartQuantity() {
    try {
        const response = await fetch('/api/carts/quantity', {
            credentials: 'include'
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

// Initialize cart quantity when the page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCartQuantity);
} else {
    initializeCartQuantity();
}