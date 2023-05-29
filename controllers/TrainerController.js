import TrainerModel from '../models/Trainer.js';

export const create = async (req, res) => {
	try {
		const doc = new TrainerModel({
			charactersPerMinute: req.body.charactersPerMinute,
			characterCount: req.body.characterCount,
			time: req.body.time,
			accuracy: req.body.accuracy,
			strictMode: req.body.strictMode,
			language: req.body.language,
			user: req.userId,
		});

		const trainer = await doc.save();

		res.json(trainer);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось записать тренировку',
		});
	}
};

export const getAllTrainers = async (req, res) => {
	try {
		const trainers = await TrainerModel.find().populate('user').exec();

		res.json(trainers);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось получить статистику по тренировкам.',
		});
	}
};

export const getAllOneUser = async (req, res) => {
	try {
		const trainers = await TrainerModel.find({ user: req.userId })
			.populate('user')
			.exec();

		res.json(trainers);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось получить статистику по тренировкам.',
		});
	}
};

export const remove = async (req, res) => {
	try {
		const trainerId = req.params.id;

		const doc = await TrainerModel.findOneAndDelete({
			_id: trainerId,
		}).exec();

		if (!doc) {
			return res.status(500).json({
				message: 'Тренировка не найдена',
			});
		}

		res.json({
			success: true,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: 'Не удалось получить статистику по тренировкам.',
		});
	}
};
