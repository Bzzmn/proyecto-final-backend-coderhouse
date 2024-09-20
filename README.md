# Libre Mercado

<div style="background-color: white; padding: 20px; display: inline-block; border: 1px solid #ddd;">
  <img src="/src/public/images/libremercadologo.png" alt="Libre Mercado Logo" width="300" height="auto">
</div>

## Descripción
Libre Mercado es un sistema backend para una aplicación de comercio electrónico, diseñado para gestionar productos, carritos de compra y autenticación de usuarios. Proporciona endpoints de API RESTful para operaciones CRUD en productos y carritos, maneja el registro y autenticación de usuarios, e incluye actualizaciones en tiempo real utilizando WebSockets.

## Tecnologías Utilizadas
- Node.js
- Express.js
- MongoDB con Mongoose
- Handlebars (para renderizado del lado del servidor)
- Passport.js (para autenticación)
- JSON Web Tokens (JWT)
- Tailwind CSS (para estilos)

## Características Principales
- Autenticación de usuarios (estrategias local y GitHub)
- Gestión de productos
- Funcionalidad de carrito de compras
- Diseño web responsivo

## Instalación

1. Clonar el repositorio:
   ```
   git clone https://github.com/Bzzmn/proyecto-final-backend-coderhouse
   ```
2. Instalar dependencias:
   ```
   npm install
   ```
3. Configurar variables de entorno:
   Crear un archivo `.env` en el directorio raíz y agregar las siguientes variables:
   ```
   PORT=3000
   MONGODB_URI=tu_cadena_de_conexion_mongodb
   JWT_SECRET=tu_secreto_jwt
   GITHUB_CLIENT_ID=tu_id_de_cliente_github
   GITHUB_CLIENT_SECRET=tu_secreto_de_cliente_github
   GITHUB_CALLBACK_URL=http://localhost:3000/api/users/github/callback
   ```
4. Construir CSS:
   ```
   npm run build:css
   ```
5. Iniciar el servidor:
   - Para desarrollo:
     ```
     npm run dev
     ```
   - Para producción:
     ```
     npm start
     ```

## Estructura de Archivos
```
├── src
│   ├── config
│   │   └── passport.config.js
│   ├── models
│   │   ├── users.model.js
│   │   ├── products.model.js
│   │   └── carts.model.js
│   ├── routes
│   │   ├── users.router.js
│   │   ├── products.router.js
│   │   ├── carts.router.js
│   │   └── views.router.js
│   ├── views
│   │   ├── layouts
│   │   │   └── main.handlebars
│   │   ├── 404.handlebars
│   │   ├── login.handlebars
│   │   ├── register.handlebars
│   │   └── restore-password.handlebars
│   ├── public
│   │   └── css
│   │       └── styles.css
│   ├── app.js
│   └── utils.js

```

## Endpoints de API

### Productos
- GET `/api/products`: Obtener todos los productos
- GET `/api/products/:pid`: Obtener un producto específico
- POST `/api/products`: Crear un nuevo producto
- PUT `/api/products/:pid`: Actualizar un producto
- DELETE `/api/products/:pid`: Eliminar un producto

### Carritos
- POST `/api/carts`: Crear un nuevo carrito
- GET `/api/carts/:cid`: Obtener un carrito específico
- POST `/api/carts/:cid/product/:pid`: Agregar un producto a un carrito

### Usuarios
- POST `/api/users/register`: Registrar un nuevo usuario
- POST `/api/users/login`: Iniciar sesión de usuario
- GET `/api/users/logout`: Cerrar sesión de usuario
- POST `/api/users/restore-password`: Restaurar contraseña de usuario
- GET `/api/users/github`: Autenticación con GitHub
- GET `/api/users/github/callback`: Callback de autenticación con GitHub

## Vistas
- `/`: Página de inicio (listado de productos)
- `/register`: Página de registro de usuario
- `/login`: Página de inicio de sesión
- `/product/:id`: Página de producto individual
- `/cart/:cid`: Página de carrito de compras

## Manejo de Errores
La aplicación incluye una página de error 404 personalizada para manejar rutas no encontradas. Además, el servidor envía al frontend las respuestas de errores, que incluyen:

- Errores de validación de datos
- Errores de autenticación
- Errores de autorización
- Errores de base de datos
- Errores de servidor internos

## Seguridad
- Las contraseñas se hashean usando bcrypt antes de almacenarse en la base de datos
- Se utiliza JWT para mantener las sesiones de usuario
- Se implementa Passport.js para estrategias de autenticación local y de GitHub

## Desarrollo
Este proyecto utiliza Node.js versión 20.x. Asegúrate de tener la versión correcta instalada antes de ejecutar la aplicación.

## Contribuciones
Las contribuciones a este proyecto son bienvenidas. Por favor, asegúrate de actualizar las pruebas según corresponda.

## Licencia
Este proyecto está licenciado bajo la Licencia ISC.