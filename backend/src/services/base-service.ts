import { Model, Document, FilterQuery, QueryOptions } from 'mongoose'

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
}
