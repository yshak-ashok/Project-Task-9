import  user from '../models/user.js';
import  post  from '../models/post.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models'
class UserService {
    // Register a new user
    static async registerUser(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const userdetails = await db.user.create({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
        });

        return userdetails;
    }

    // Login method
    static async loginUser(credentials) {
        const userData = await user.findOne({
            where: { email: credentials.email },
        });
        if (!userData) {
            throw new Error('User not found');
        }
        const isPasswordValid = await bcrypt.compare(credentials.password, userData.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        // Create JWT token
        const token = jwt.sign(
            { id: userData.id, email: userData.email, name: userData.name },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' },
        );
        return { user: userData, token };
    }

    // Fetch user with their associated post
    static async getUserWithPost(userId) {
        return await user.findOne({
            where: { id: userId },
            attributes: ['name', 'email'],
            include: [
                {
                    model: post,
                    as: 'post',
                    attributes: ['title', 'content', 'userId'],
                },
            ],
        });
    }

    // Get all users with their posts
    static async getAllUserWithPost() {
        return await user.findAll({
            attributes: ['name'],
            include: [{ model: post, as: 'post', attributes: ['title', 'content'] }],
        });
    }
}

// Default export
export default UserService;
