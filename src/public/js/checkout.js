document.addEventListener('DOMContentLoaded', function() {
    // Cargar productos del carrito
    function loadCartProducts() {
        try {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const cartContainer = document.querySelector('.cart-products-container');
            const totalElement = document.querySelector('.cart-total');
            let total = 0;

            if (!cartContainer) return;

            if (cart.length === 0) {
                cartContainer.innerHTML = '<p class="text-center text-gray-500">Tu carrito está vacío.</p>';
                if (totalElement) {
                    totalElement.textContent = '$0.00';
                }
                return;
            }

            // Calcular el total y generar el HTML para cada producto
            const productsHTML = cart.map(product => {
                const subtotal = product.quantity * parseFloat(product.productPrice);
                total += subtotal;
                
                return `
                <div class="bg-white p-4 rounded-lg shadow-md flex gap-8 w-full">
                    <div class="ms-3 w-16 h-16 bg-white rounded-md flex-shrink-0 overflow-hidden">
                        ${product.productImage ? 
                            `<img src="${product.productImage}" alt="${product.productTitle}"
                                class="w-full h-full object-cover rounded-md"
                                onerror="this.onerror=null; this.src='/images/default-product.jpg'; this.classList.add('object-contain');">` :
                            `<div class="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                                Sin imagen
                            </div>`
                        }
                    </div>
                    <div class="flex flex-col w-full pe-3">
                        <h3 class="font-medium">${product.productTitle}</h3>
                        <div class="flex justify-between items-center mt-2">
                            <span>$${product.productPrice} x ${product.quantity}</span>
                            <span class="font-medium">$${(subtotal).toFixed(2)}</span>
                        </div>
                    </div>
                </div>`;
            }).join('');

            cartContainer.innerHTML = productsHTML;

            // Actualizar el total
            if (totalElement) {
                totalElement.textContent = `$${total.toFixed(2)}`;
            }

        } catch (error) {
            console.error('Error al cargar los productos del carrito:', error);
            showToast('Error al cargar los productos del carrito', 'error');
        }
    }

    // Manejar el botón de continuar al pago
    const continueToPaymentButton = document.getElementById('continue-to-payment');
    if (continueToPaymentButton) {
        continueToPaymentButton.addEventListener('click', async function(e) {
            e.preventDefault();

            try {
                const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                
                if (cart.length === 0) {
                    showToast('El carrito está vacío', 'error');
                    return;
                }

                const response = await fetch('/api/carts/purchase', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        products: cart.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity
                        }))
                    }),
                });

                if (response.ok) {
                    const result = await response.json();
                    // Limpiar el carrito después de una compra exitosa
                    localStorage.removeItem('cart');
                    localStorage.setItem('cartQuantity', '0');
                    if (window.updateCartBadge) {
                        window.updateCartBadge();
                    }
                    showToast('¡Pedido realizado con éxito!', 'success');
                    setTimeout(() => {
                        window.location.href = '/success';
                    }, 1500);
                } else {
                    const errorData = await response.json();
                    showToast(errorData.message || 'Error al procesar el pedido', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('Hubo un problema al procesar el pedido', 'error');
            }
        });
    }

    // Cargar los productos al iniciar
    loadCartProducts();
}); 