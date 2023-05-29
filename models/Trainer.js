import mongoose from 'mongoose';

const TrainerSchema = new mongoose.Schema(
	{
		charactersPerMinute: {
			type: Number,
			required: true,
		},
		characterCount: {
			type: Number,
			required: true,
		},
		time: {
			type: Number,
			required: true,
		},
		accuracy: {
			type: Number,
			required: true,
		},
		strictMode: {
			type: String,
			required: true,
		},
		language: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Trainer', TrainerSchema);
