import { BaseService } from './base-service'
import { IConversation, Conversation } from '../models'
import { Types } from 'mongoose'

export class ConversationService extends BaseService<IConversation> {
	constructor() {
		super(Conversation)
	}

	async createConversation(participantIds: string[]): Promise<IConversation> {
		if (participantIds.length < 2) {
			throw new Error('Conversation must have at least 2 participants')
		}

		if (!participantIds.every((id) => Types.ObjectId.isValid(id))) {
			throw new Error('Invalid participant ID format')
		}

		const participants = participantIds.map((id) => new Types.ObjectId(id))

		// Check if conversation already exists between these participants
		const existingConversation = await this.model
			.findOne({
				participants: { $all: participants, $size: participants.length },
			})
			.populate('participants', 'name username profilePicture')
			.populate({
				path: 'lastMessage',
				populate: [
					{
						path: 'sender',
						select: 'name username profilePicture',
					},
					{
						path: 'readBy',
						select: 'name username profilePicture',
					},
				],
			})

		if (existingConversation) {
			return existingConversation
		}

		const newConversation = await this.create({ participants })
		return this.model
			.findById(newConversation._id)
			.populate('participants', 'name username profilePicture')
			.populate({
				path: 'lastMessage',
				populate: [
					{
						path: 'sender',
						select: 'name username profilePicture',
					},
					{
						path: 'readBy',
						select: 'name username profilePicture',
					},
				],
			})
			.then((doc) => doc!)
	}

	async getConversationsByUserId(
		userId: string,
		page: number = 1,
		limit: number = 20
	) {
		if (!Types.ObjectId.isValid(userId)) {
			throw new Error('Invalid user ID format')
		}

		const [total, data] = await Promise.all([
			this.model.countDocuments({ participants: new Types.ObjectId(userId) }),
			this.model
				.find({ participants: new Types.ObjectId(userId) })
				.sort({ updatedAt: -1 })
				.skip((page - 1) * limit)
				.limit(limit)
				.populate('participants', 'name username profilePicture')
				.populate({
					path: 'lastMessage',
					populate: [
						{
							path: 'sender',
							select: 'name username profilePicture',
						},
						{
							path: 'readBy',
							select: 'name username profilePicture',
						},
					],
				}),
		])

		return {
			data,
			total,
			pages: Math.ceil(total / limit),
		}
	}

	async updateLastMessage(
		conversationId: string,
		messageId: string
	): Promise<IConversation> {
		if (
			!Types.ObjectId.isValid(conversationId) ||
			!Types.ObjectId.isValid(messageId)
		) {
			throw new Error('Invalid ID format')
		}

		const updatedConversation = await this.model
			.findByIdAndUpdate(
				conversationId,
				{ lastMessage: new Types.ObjectId(messageId) },
				{ new: true }
			)
			.populate('participants', 'name username profilePicture')
			.populate({
				path: 'lastMessage',
				populate: [
					{
						path: 'sender',
						select: 'name username profilePicture',
					},
					{
						path: 'readBy',
						select: 'name username profilePicture',
					},
				],
			})

		if (!updatedConversation) {
			throw new Error('Conversation not found')
		}

		return updatedConversation
	}
}
