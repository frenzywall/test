import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../models/user.model';

const userRoutes = express.Router();

/**
 * Login an existing user by password and username
 * query: POST localhost:8080/users/login/
 * body:
 * {
 *     "username": "<username>",
 *     "password": "<password>"
 * }
 */
userRoutes.route('/login').post(async (request: Request, response: Response) => {
    const { username, password } = request.body;

    // Validate input
    if (!username || !password) {
        return response.status(400).send({ message: 'Username and password are required' });
    }

    try {
        // Find user by username
        const user = await User.findOne({ username }).exec();
        if (user) {
            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                response.status(200).send({ message: 'Login successful', user });
            } else {
                response.status(400).send({ message: 'Incorrect password' });
            }
        } else {
            response.status(404).send({ message: 'User does not exist' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        response.status(500).send({ message: 'Internal server error' });
    }
});

/**
 * Register a new User to the Database
 * body:
 * {
 *     "username": "<username>",
 *     "password": "<password>"
 * }
 */
userRoutes.route('/register').post(async (request: Request, response: Response) => {
    const { username, password } = request.body;

    // Validate input
    if (!username || !password) {
        return response.status(400).send({ message: 'Username and password are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username }).exec();
        if (existingUser) {
            return response.status(400).send({ message: 'User already exists!' });
        }

        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Create and save new user
        const newUser = new User({
            username,
            password: hash,
            salt
        });
        const savedUser = await newUser.save();
        response.status(201).send(savedUser); // Use 201 status for resource creation
    } catch (error) {
        console.error('Error during registration:', error);
        response.status(500).send({ message: 'Internal server error' });
    }
});

export default userRoutes;
