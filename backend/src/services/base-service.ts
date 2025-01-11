import {
	Model,
	Document,
	FilterQuery,
	QueryOptions,
	Types,
	UpdateQuery,
	ProjectionType,
} from 'mongoose'

export abstract class BaseService<T extends Document> {
	constructor(protected model: Model<T>) {}

	protected getDefaultProjection(): ProjectionType<T> {
		return {}
	}

	async findAll(
		filter: FilterQuery<T> = {},
		options: QueryOptions = {},
		projection: ProjectionType<T> = this.getDefaultProjection()
	): Promise<T[]> {
		return this.model.find(filter, projection, options).exec()
	}

	async findById(
		id: string,
		projection: ProjectionType<T> = this.getDefaultProjection()
	): Promise<T | null> {
		if (!Types.ObjectId.isValid(id)) {
			throw new Error('Invalid ID format')
		}
		return this.model.findById(id, projection).exec()
	}

	async findOne(
		filter: FilterQuery<T>,
		projection: ProjectionType<T> = this.getDefaultProjection()
	): Promise<T | null> {
		return this.model.findOne(filter, projection).exec()
	}

	async create(data: Partial<T>): Promise<T> {
		const entity = new this.model(data)
		return entity.save()
	}

	async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
		if (!Types.ObjectId.isValid(id)) {
			throw new Error('Invalid ID format')
		}
		return this.model.findByIdAndUpdate(id, data, { new: true }).exec()
	}

	async delete(id: string): Promise<T | null> {
		if (!Types.ObjectId.isValid(id)) {
			throw new Error('Invalid ID format')
		}
		return this.model.findByIdAndDelete(id).exec()
	}

	async exists(filter: FilterQuery<T>): Promise<boolean> {
		const doc = await this.model.exists(filter)
		return doc !== null
	}

	async count(filter: FilterQuery<T> = {}): Promise<number> {
		return this.model.countDocuments(filter).exec()
	}

	async findWithPagination(
		filter: FilterQuery<T> = {},
		page: number = 1,
		limit: number = 10,
		options: QueryOptions = {}
	): Promise<{ data: T[]; total: number; pages: number }> {
		const skip = (page - 1) * limit

		const [total, data] = await Promise.all([
			this.model.countDocuments(filter).exec(),
			this.model
				.find(filter, this.getDefaultProjection(), {
					...options,
					skip,
					limit,
				})
				.exec(),
		])

		return {
			data,
			total,
			pages: Math.ceil(total / limit),
		}
	}
}
