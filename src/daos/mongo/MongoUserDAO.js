import userModel from '../../models/users.model.js';
import UserDAO from '../interfaces/userDAO.js';

export default class MongoUserDAO extends UserDAO {

    constructor() {
        super();
    }
    
    async create(userData) {
        return await userModel.create(userData);
    }

    async findById(id) {
        return await userModel.findById(id);
    }

    async findByEmail(email) {
        return await userModel.findOne({ email });
    }

    async findByGithubId(githubId) {
        return await userModel.findOne({ githubId });
    }

    async update(id, userData) {
        return await userModel.findByIdAndUpdate(id, userData, { new: true });
    }

    async delete(id) {
        return await userModel.findByIdAndDelete(id);
    }
}
