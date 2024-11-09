import { Schema } from 'mongoose'

export interface IPoint {
	lat: number
	lng: number
}

export const PointSchema = new Schema<IPoint>({
	lat: {
		type: Number,
		required: [true, 'Latitude is required'],
		min: [-90, 'Latitude must be between -90 and 90'],
		max: [90, 'Latitude must be between -90 and 90'],
	},
	lng: {
		type: Number,
		required: [true, 'Longitude is required'],
		min: [-180, 'Longitude must be between -180 and 180'],
		max: [180, 'Longitude must be between -180 and 180'],
	},
})
