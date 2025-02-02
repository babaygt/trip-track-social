import { Schema, model, Document, Types } from 'mongoose'

export interface IUser extends Document {
	name: string
	username: string
	email: string
	password: string
	bio?: string
	profilePicture?: string
	followers: Types.ObjectId[]
	following: Types.ObjectId[]
	bookmarks: Types.ObjectId[]
	conversations: Types.ObjectId[]
	isAdmin: boolean
	isProtected: boolean
	createdAt: Date
	updatedAt: Date
}

const UserSchema = new Schema<IUser>(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
			trim: true,
			minlength: [2, 'Name must be at least 2 characters long'],
			maxlength: [50, 'Name cannot exceed 50 characters'],
		},
		username: {
			type: String,
			required: [true, 'Username is required'],
			unique: true,
			trim: true,
			lowercase: true,
			minlength: [3, 'Username must be at least 3 characters long'],
			maxlength: [30, 'Username cannot exceed 30 characters'],
			match: [
				/^[a-zA-Z0-9_]+$/,
				'Username can only contain letters, numbers, and underscores',
			],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			lowercase: true,
			trim: true,
			match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
		},
		password: {
			type: String,
			required: [true, 'Password is required'],
			minlength: [8, 'Password must be at least 8 characters long'],
			select: false,
		},
		bio: {
			type: String,
			maxlength: [500, 'Bio cannot exceed 500 characters'],
			trim: true,
			default: '',
		},
		profilePicture: {
			type: String,
			trim: true,
			default: '',
		},
		followers: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		following: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		bookmarks: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Route',
			},
		],
		conversations: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Conversation',
			},
		],
		isAdmin: {
			type: Boolean,
			default: false,
		},
		isProtected: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		toJSON: {
			transform: (_, ret) => {
				delete ret.password
				return ret
			},
		},
	}
)

// Compound indexes for better query performance
UserSchema.index({ username: 1 })
UserSchema.index({ email: 1 })
UserSchema.index({ createdAt: -1 })
UserSchema.index({ followers: 1, createdAt: -1 })
UserSchema.index({ following: 1, createdAt: -1 })
UserSchema.index({ bookmarks: 1, createdAt: -1 })

export const User = model<IUser>('User', UserSchema)
