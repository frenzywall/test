import express, { Request, Response } from 'express';
import TodoModel, { Todo } from '../models/todo.model';
import { CallbackError } from "mongoose";

const todoRoutes = express.Router();

/**
 * Get all To-Dos for a user
 * query: GET localhost:8080/todos/user/{id}
 */
todoRoutes.route('/user/:userId').get(async (request: Request, response: Response) => {
    try {
        const todos = await TodoModel.find({ userId: request.params.userId });
        response.json(todos);
    } catch (err) {
        console.log(err);
        response.status(500).json(err);
    }
});

/**
 * Get a To-Do with a specific ID
 * query: GET localhost:8080/todos/{id}
 */
todoRoutes.route('/:id').get(async (request: Request, response: Response) => {
    try {
        const todo = await TodoModel.findById(request.params.id);
        if (todo) {
            response.json(todo);
        } else {
            response.status(404).send('Todo not found');
        }
    } catch (err) {
        console.log(err);
        response.status(500).json(err);
    }
});

/**
 * Add a new To-do Entry
 * query: POST localhost:8080/todos/
 * body:
 * {
 *     "userId": "<userid>",
 *     "description": "work",
 *     "completed": false
 * }
 */
todoRoutes.route('/add').post(async (request: Request, response: Response) => {
    try {
        const todo = new TodoModel(request.body);
        await todo.save();
        console.log(`added new todo: ${todo}`);
        response.status(200).json({ 'todo': 'todo added successfully' });
    } catch (err) {
        console.log(`adding new todo failed: ${err}`);
        response.status(400).send('adding new todo failed');
    }
});

/**
 * Updating an existing To do. used to update
 * the completion status or the description
 * query: POST localhost:8080/todos/update/{id}
 */
todoRoutes.route('/update/:id').post(async (request: Request, response: Response) => {
    try {
        const todo = await TodoModel.findById(request.params.id);
        if (!todo) {
            response.status(404).send('Todo is not found!');
        } else {
            todo.description = request.body.description;
            todo.completed = request.body.completed;
            todo.priority = request.body.priority;
            await todo.save();
            response.status(200).json({ 'todo': 'todo updated successfully' });
        }
    } catch (err) {
        response.status(400).send(err);
    }
});

/**
 * Deleting a To-Do Entry by ID
 * query: DELETE localhost:8080/todos/{id}
 */
todoRoutes.route('/:id').delete(async (request: Request, response: Response) => {
    try {
        const todo = await TodoModel.findByIdAndRemove(request.params.id);
        if (todo) {
            console.log(`removed todo with id <${todo?.id}>`);
            response.json('Todo deleted successfully');
        } else {
            response.status(404).send('Todo not found');
        }
    } catch (err) {
        console.log(`removing todo failed with error <${err}>`);
        response.status(400).send('Error deleting todo');
    }
});

export default todoRoutes;
