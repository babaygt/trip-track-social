import {
	Model,
	Document,
	FilterQuery,
	QueryOptions,
	Types,
	UpdateQuery,
} from 'mongoose'

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

	async findOne(filter: FilterQuery<T>): Promise<T | null> {
		return this.model.findOne(filter)
	}

	async create(data: Partial<T>): Promise<T> {
		const entity = new this.model(data)
		return entity.save()
	}

	async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
		if (!Types.ObjectId.isValid(id)) {
			throw new Error('Invalid ID format')
		}
		return this.model.findByIdAndUpdate(id, data, { new: true })
	}

	async delete(id: string): Promise<T | null> {
		if (!Types.ObjectId.isValid(id)) {
			throw new Error('Invalid ID format')
		}
		return this.model.findByIdAndDelete(id)
	}

	async exists(filter: FilterQuery<T>): Promise<boolean> {
		const count = await this.model.countDocuments(filter)
		return count > 0
	}

	async count(filter: FilterQuery<T> = {}): Promise<number> {
		return this.model.countDocuments(filter)
	}

	async findWithPagination(
		filter: FilterQuery<T> = {},
		page: number = 1,
		limit: number = 10,
		options: QueryOptions = {}
	): Promise<{ data: T[]; total: number; pages: number }> {
		const skip = (page - 1) * limit
		const [data, total] = await Promise.all([
			this.model.find(filter, null, { ...options, skip, limit }),
			this.model.countDocuments(filter),
		])

		return {
			data,
			total,
			pages: Math.ceil(total / limit),
		}
	}
}
