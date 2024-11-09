import { Model, Document, FilterQuery, QueryOptions, Types } from 'mongoose'

export abstract class BaseService<T extends Document> {
	constructor(private model: Model<T>) {
		this.model = model
	}

	async findAll(
		filter: FilterQuery<T> = {},
		options: QueryOptions = {}
	): Promise<T[]> {
		return this.model.find(filter, null, options)
	}

	async findById(id: string): Promise<T | null> {
		if (!Types.ObjectId.isValid(id)) {
			throw new Error('Invalid ID format')
		}
		return this.model.findById(id)
	}
}
