# Backend para Aplicación de Gestión de Productos y Carritos de Compra

## Descripción del Backend
Este backend está diseñado para gestionar los productos y los carritos de compra para un proyecto de comercio electrónico. Su principal responsabilidad es ofrecer una API RESTful a través de la cual se pueden realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre productos y carritos. Además, maneja la validación de datos y el almacenamiento de la información en archivos JSON locales. Ahora, también está configurado para trabajar con Handlebars y WebSockets, permitiendo la actualización en tiempo real de las vistas de productos.

## Tecnologías Utilizadas
- **Node.js**: Plataforma de ejecución para JavaScript en el servidor.
- **Express**: Framework para Node.js que simplifica la creación de servidores HTTP.
- **Express Validator**: Middleware de Express que se utiliza para validar las entradas de las solicitudes.
- **File System Promises API**: Utilizada para leer y escribir en archivos, permitiendo el manejo de datos de productos y carritos.
- **Handlebars**: Motor de plantillas para generar HTML dinámicamente en el servidor.
- **Socket.io**: Biblioteca que permite la comunicación en tiempo real entre clientes y servidores a través de WebSockets.

## Configuración del Proyecto

### Instalación de Dependencias
Asegúrate de tener instaladas las siguientes dependencias:

```bash
npm install express express-handlebars socket.io express-validator
```

### Configuración del Servidor

1. **Configurar el servidor para integrar Handlebars**:
   - En `app.js` se ha configurado el motor de plantillas Handlebars para renderizar vistas.

2. **Instalar y configurar Socket.io**:
   - Socket.io se ha configurado para permitir la comunicación en tiempo real entre el servidor y los clientes.

### Nuevas Vistas
Se han creado dos nuevas vistas:
1. **home.handlebars**:
   - Contiene una lista de todos los productos agregados hasta el momento.

2. **realTimeProducts.handlebars**:
   - Vive en el endpoint `/realtimeproducts` en el `views router`.
   - Contiene la misma lista de productos, pero se actualiza automáticamente mediante WebSockets cada vez que se crea o elimina un producto.

### Emisión de Eventos en Tiempo Real
- Se ha incluido la instancia del servidor WebSocket en el router de productos para que se genere un `emit` cada vez que se realiza una petición `POST` o `DELETE` a la lista de productos. Esto asegura que la vista de `realTimeProducts` se actualice en tiempo real.

## Estructura de Carpetas

![Estructura de Carpetas](https://general-projects-public.s3.eu-west-3.amazonaws.com/folders.webp)

## Endpoints

### Productos
- **GET `/api/products`**: Devuelve todos los productos con un límite opcional.
- **GET `/api/products/:pid`**: Devuelve un producto específico por su ID.
- **POST `/api/products`**: Crea un nuevo producto con validación de datos.
- **PUT `/api/products/:pid`**: Actualiza un producto existente por su ID.
- **DELETE `/api/products/:pid`**: Elimina un producto por su ID.

### Carritos
- **POST `/api/carts`**: Crea un nuevo carrito con validación de datos.
- **GET `/api/carts/:cid`**: Devuelve un carrito específico por su ID.
- **POST `/api/carts/:cid/product/:pid`**: Añade o actualiza un producto en un carrito específico.

## Ejemplos de Test con REST Client
A continuación, se presentan imágenes de cómo realizar las pruebas de los endpoints usando la extensión REST Client. Los archivos \`requests.rest\` contienen las peticiones preparadas para enviar a los endpoints correspondientes.

### Test para Crear Producto
![Test Crear Producto](https://general-projects-public.s3.eu-west-3.amazonaws.com/test_1.webp)

### Test para Obtener Productos
![Test Obtener Productos](https://general-projects-public.s3.eu-west-3.amazonaws.com/test_2.webp)

### Test para Actualizar Producto
![Test Actualizar Producto](https://general-projects-public.s3.eu-west-3.amazonaws.com/test_3.webp)

### Test para Eliminar Producto
![Test Eliminar Producto](https://general-projects-public.s3.eu-west-3.amazonaws.com/test_4.webp)

### Test para Creación de Carrito
![Test Creación de Carrito](https://general-projects-public.s3.eu-west-3.amazonaws.com/test_5.webp)

### Test para Agregar Producto Adicional a Carrito
![Test Agregar Producto Adicional a Carrito](https://general-projects-public.s3.eu-west-3.amazonaws.com/test_6.webp)

### Test para Agregar Producto que ya existe a Carrito
![Test Agregar Producto que ya existe a Carrito](https://general-projects-public.s3.eu-west-3.amazonaws.com/test_7.webp)

Estos tests ilustran el uso de la API y cómo interactuar con ella mediante peticiones HTTP. Asegúrate de tener la extensión REST Client instalada en tu editor para poder ejecutar estos ejemplos directamente desde el archivo `requests.rest`.