import { Model, Document } from 'mongoose'

export abstract class BaseService<T extends Document> {
	constructor(private model: Model<T>) {
		this.model = model
	}
}
