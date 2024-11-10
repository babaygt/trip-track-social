import { Schema, model, Document, Types } from 'mongoose'
import { PointSchema, IPoint } from './point'
import { CommentSchema, IComment } from './comment'
import autopopulate from 'mongoose-autopopulate'

export type TravelMode = 'DRIVING' | 'BICYCLING' | 'TRANSIT' | 'WALKING'
export type Visibility = 'public' | 'private' | 'followers'

export interface IRoute extends Document {
	title: string
	creator: Types.ObjectId
	startPoint: IPoint
	endPoint: IPoint
	waypoints: IPoint[]
	travelMode: TravelMode
	description: string
	totalDistance: number
	totalTime: number
	likes: Types.ObjectId[]
	comments: IComment[]
	visibility: Visibility
	tags: string[]
	createdAt: Date
	updatedAt: Date
	commentCount: number
	likeCount: number
	isOwner(userId: string): boolean
	isLikedBy(userId: string): boolean
}

const RouteSchema = new Schema<IRoute>(
	{
		title: {
			type: String,
			required: [true, 'Title is required'],
			trim: true,
			maxlength: [100, 'Title cannot exceed 100 characters'],
		},
		creator: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			autopopulate: {
				select: 'username profilePicture name',
			},
		},
		startPoint: {
			type: PointSchema,
			required: [true, 'Start point is required'],
		},
		endPoint: {
			type: PointSchema,
			required: [true, 'End point is required'],
		},
		waypoints: [PointSchema],
		travelMode: {
			type: String,
			enum: {
				values: ['DRIVING', 'BICYCLING', 'TRANSIT', 'WALKING'],
				message: '{VALUE} is not supported',
			},
			required: [true, 'Travel mode is required'],
		},
		description: {
			type: String,
			required: [true, 'Description is required'],
			trim: true,
			maxlength: [2000, 'Description cannot exceed 2000 characters'],
		},
		totalDistance: {
			type: Number,
			required: true,
			min: [0, 'Total distance cannot be negative'],
		},
		totalTime: {
			type: Number,
			required: true,
			min: [0, 'Total time cannot be negative'],
		},
		likes: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
				autopopulate: {
					select: 'username profilePicture name',
				},
			},
		],
		comments: [CommentSchema],
		visibility: {
			type: String,
			enum: {
				values: ['public', 'private', 'followers'],
				message: '{VALUE} is not a valid visibility option',
			},
			default: 'public',
		},
		tags: [
			{
				type: String,
				trim: true,
				lowercase: true,
				maxlength: [20, 'Tag cannot exceed 20 characters'],
			},
		],
	},
	{
		timestamps: true,
	}
)

// Indexes for better query performance
RouteSchema.index({ creator: 1, createdAt: -1 })
RouteSchema.index({ tags: 1 })
RouteSchema.index({ visibility: 1 })
RouteSchema.index({ 'startPoint.lat': 1, 'startPoint.lng': 1 })
RouteSchema.index({ 'endPoint.lat': 1, 'endPoint.lng': 1 })

// Virtual for comment count
RouteSchema.virtual('commentCount').get(function () {
	return this.comments?.length || 0
})

// Virtual for like count
RouteSchema.virtual('likeCount').get(function () {
	return this.likes?.length || 0
})

// Methods
RouteSchema.methods.isOwner = function (userId: string): boolean {
	return this.creator.toString() === userId.toString()
}

RouteSchema.methods.isLikedBy = function (userId: string): boolean {
	return this.likes.some((like: Types.ObjectId) => {
		if (typeof like === 'object' && like._id) {
			return like._id.toString() === userId.toString()
		}
		return like.toString() === userId.toString()
	})
}

// Plugin
RouteSchema.plugin(autopopulate)

export const Route = model<IRoute>('Route', RouteSchema)
