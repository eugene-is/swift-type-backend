import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array());
		}

		const passwordNaked = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(passwordNaked, salt);

		const doc = new UserModel({
			email: req.body.email,
			username: req.body.username,
			password: passwordHash,
		});

		const user = await doc.save();

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret',
			{
				expiresIn: '30d',
			}
		);

		const { password, ...userData } = user._doc;

		res.json({
			...userData,
			token,
		});
	} catch (error) {
		res.status(500).json({
			message: 'Не удалось зарегестрироваться',
		});
	}
};

export const login = async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email });

		if (!user) {
			return res.status(404).json({
				message: 'Неверный логин или пароль',
			});
		}

		const isValidPassword = await bcrypt.compare(
			req.body.password,
			user._doc.password
		);

		if (!isValidPassword) {
			return res.status(400).json({
				message: 'Неверный логин или пароль',
			});
		}

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret',
			{
				expiresIn: '30d',
			}
		);

		const { password, ...userData } = user._doc;

		res.json({
			...userData,
			token,
		});
	} catch (error) {
		res.status(400).json({
			message: 'Не удалось авторизоваться',
		});
	}
};

export const getMe = async (req, res) => {
	try {
		const user = await UserModel.findById(req.userId);

		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден',
			});
		}

		const { password, ...userData } = user._doc;

		res.json({
			...userData,
		});
	} catch (error) {
		res.status(500).json({
			message: 'Нет доступа',
		});
	}
};

export const getAllUsers = async (req, res) => {
	try {
		const user = await UserModel.find().populate('user').exec();

		res.json(user);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось получить данные о пользователях',
		});
	}
};

export const update = async (req, res) => {
	try {
		const userId = req.params.id;

		const passwordNaked = req.body.password;
		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash(passwordNaked, salt);

		await UserModel.updateOne(
			{
				_id: userId,
			},
			{
				email: req.body.email,
				username: req.body.username,
				password: passwordHash,
			}
		);

		res.json({
			success: true,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось обновить данные',
		});
	}
};
