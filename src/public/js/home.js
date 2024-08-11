document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault(); // Evita el comportamiento por defecto del botón

            const productId = button.getAttribute('data-id');
            const cartId = '66b7d4de498ba85a4cfd925e'; 
            
            // Establecer la cantidad por defecto en 1 si no se especifica
            const quantityInput = document.querySelector(`#counter-input-${productId}`);
            const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

            try {
                const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity: quantity }), // Enviar la cantidad calculada
                });

                if (response.ok) {
                    alert('Producto agregado al carrito exitosamente!');
                } else {
                    alert('Hubo un problema al agregar el producto al carrito.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un problema al agregar el producto al carrito.');
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const removeButtons = document.querySelectorAll('.remove-btn');

    removeButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();

            const productId = button.getAttribute('data-id');
            const cartId = '66b7d4de498ba85a4cfd925e'; // Debes obtener este ID dinámicamente si es necesario

            const confirmed = confirm('¿Estás seguro de que quieres eliminar este producto del carrito?');
            if (confirmed) {
                try {
                    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                        method: 'DELETE',
                    });

                    if (response.ok) {
                        alert('Producto eliminado del carrito exitosamente!');
                        // Recarga la página para reflejar los cambios
                        location.reload();
                    } else {
                        alert('Hubo un problema al eliminar el producto del carrito.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Hubo un problema al eliminar el producto del carrito.');
                }
            }
        });
    });
});