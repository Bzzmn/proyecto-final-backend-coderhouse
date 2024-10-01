import MongoSingleton from './MongoSigleton.js'; // Asegúrate de ajustar el path si es necesario
import mongoose from 'mongoose';
// Función principal de prueba
async function testMongoConnection() {
    try {
        // Obtener la instancia de MongoSingleton
        const dbInstance = MongoSingleton.getInstance();

        // Esperar un momento para asegurarte de que la conexión se haya establecido
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Verificar si se ha conectado correctamente
        const connectionState = mongoose.connection.readyState;
        console.log(connectionState)
        if (connectionState === 1) {
            console.log('Conectado exitosamente a MongoDB');
        } else {
            console.log('Error al conectar a MongoDB');
        }
    } catch (error) {
        console.error('Error en la conexión:', error);
    }
}
testMongoConnection();