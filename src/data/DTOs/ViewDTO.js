export default class ViewDTO {
    constructor(cart) {
        console.log('Constructing ViewDTO with cart:', JSON.stringify(cart, null, 2));
        this.userId = cart.user;
        this.products = cart.products
            .filter(item => {
                console.log('Filtering item:', JSON.stringify(item, null, 2));
                return item.product && item.product.stock > 0;
            })
            .map(item => ({
                productId: item.product._id,
                title: item.product.title,
                price: item.product.price,
                quantity: item.quantity,
                subtotal: item.product.price * item.quantity,
                thumbnails: item.product.thumbnails
            }));
        this.total = this.products.reduce((sum, item) => sum + item.subtotal, 0);
        console.log('Constructed ViewDTO:', JSON.stringify(this, null, 2));
    }
}
