import User from "../models/user.model";

class UserService {

    public async findUser(filters: any) {
        try {
            return await User.findOne(filters);
        } catch (error) {
            throw error;
        }
    };

    public async createUser(user: any) {
        try {
            return await User.create(user);
        } catch (error) {
            throw error;
        }
    };

    public async activateUser({ userId, name, avatar }: { userId: string, name: string, avatar: string | null }) {
        try {
            return await User.findByIdAndUpdate(userId, { activated: true, avatar, name }, {
                new: true
            });
        } catch (error) {
            throw error;
        }
    };

};

export default new UserService();