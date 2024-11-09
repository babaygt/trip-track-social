import { BaseService } from './base-service'
import { IRoute, Route } from '../models'

export class RouteService extends BaseService<IRoute> {
	constructor() {
		super(Route)
	}
}
