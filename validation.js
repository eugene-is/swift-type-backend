import { body } from 'express-validator';

export const registerValidation = [
	body('email', 'Неверный формат почты.').isEmail(),
	body('username', 'Укажите имя').isLength({ min: 2 }),
	body('password', 'Пароль должен состоять минимум из 5 символов.').isLength({
		min: 5,
	}),
];

export const loginValidation = [
	body('email', 'Неверный формат почты.').isEmail(),
	body('password', 'Пароль должен состоять минимум из 5 символов.').isLength({
		min: 5,
	}),
];
