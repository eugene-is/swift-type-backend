import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import checkAuth from './utils/checkAuth.js';
import { loginValidation, registerValidation } from './validation.js';

import * as TrainerController from './controllers/TrainerController.js';
import * as UserController from './controllers/UserController.js';

mongoose
	.connect(
		'mongodb+srv://eugene-isaikin:rrfxxb2023@swifttype.gir6c4x.mongodb.net/swift-type?retryWrites=true&w=majority'
	)
	.then(() => console.log('database connect'))
	.catch((error) => console.log(`database error - ${error}`));

const app = express();

app.use(express.json());
app.use(cors());

app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
app.get('/auth/register', UserController.getAllUsers);
app.patch('/auth/:id', checkAuth, registerValidation, UserController.update);

app.post('/trainers', checkAuth, TrainerController.create);
app.get('/trainers', TrainerController.getAllTrainers);
app.get('/trainers/account', checkAuth, TrainerController.getAllOneUser);
app.delete('/trainers/:id', checkAuth, TrainerController.remove);

app.listen(4444, (error) => {
	if (error) {
		return console.log(`web serve error - ${error}`);
	}
	console.log('web server connect');
});
