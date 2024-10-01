import mongoose from 'mongoose'

export default class MongoSingleton {
    static #instance // Declara una propiedad de clase privada llamada '#instance'.
    // Constructor de la clase.
    constructor() {
        // En el constructor, se conecta a la base de datos MongoDB utilizando la URL de conexión proporcionada.
        mongoose.connect('mongodb://localhost:27017/ecommerce')
    }
    static getInstance() {
        // Verifica si ya existe una instancia de la clase.
        if (this.#instance) {
            console.log("Ya esta conectado")
            return this.#instance // Si existe, devuelve la instancia existente.
        }
        this.#instance = new MongoSingleton()
        console.log("Conectado")
        return this.#instance // Devuelve la nueva instancia creada.
    }
}