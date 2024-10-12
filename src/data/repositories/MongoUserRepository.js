import UserRepository from './interfaces/UserRepository.js';
import { UserDTO } from '../DTOs/UserDTO.js';

export default class MongoUserRepository extends UserRepository {
    constructor(dao) {
        super();
        this.dao = dao;
    }

    async findById(id) {
        const user = await this.dao.findById(id);
        return user ? user: null;
    }

    async findByEmail(email) {
        const user = await this.dao.findByEmail(email);
        return user ? user: null;
    }

    async create(userData) {
        const user = await this.dao.create(userData);
        return user ? new UserDTO(user) : null;
    }

    async update(id, userData) {
        const user = await this.dao.update(id, userData);
        return user ? new UserDTO(user) : null;
    }

    async delete(id) {
        return await this.dao.delete(id);
    }

    async findCurrentById(id) {
        const user = await this.dao.findCurrentById(id);
        return user ? new UserDTO(user) : null;
    }
}