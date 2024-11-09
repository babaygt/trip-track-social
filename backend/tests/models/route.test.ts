import { Route } from '../../src/models'
import { Types } from 'mongoose'

describe('Route Model', () => {
	describe('Virtual Fields', () => {
		it('should calculate commentCount correctly', () => {
			const route = new Route({
				title: 'Test Route',
				creator: new Types.ObjectId(),
				startPoint: { lat: 0, lng: 0 },
				endPoint: { lat: 1, lng: 1 },
				travelMode: 'DRIVING',
				description: 'Test description',
				totalDistance: 100,
				totalTime: 3600,
				comments: [
					{
						content: 'Test comment',
						creator: new Types.ObjectId(),
					},
				],
			})

			expect(route.commentCount).toBe(1)
		})

		it('should return 0 for commentCount when comments array is empty', () => {
			const route = new Route({
				title: 'Test Route',
				creator: new Types.ObjectId(),
				startPoint: { lat: 0, lng: 0 },
				endPoint: { lat: 1, lng: 1 },
				travelMode: 'DRIVING',
				description: 'Test description',
				totalDistance: 100,
				totalTime: 3600,
			})

			expect(route.commentCount).toBe(0)
		})

		it('should calculate likeCount correctly', () => {
			const route = new Route({
				title: 'Test Route',
				creator: new Types.ObjectId(),
				startPoint: { lat: 0, lng: 0 },
				endPoint: { lat: 1, lng: 1 },
				travelMode: 'DRIVING',
				description: 'Test description',
				totalDistance: 100,
				totalTime: 3600,
				likes: [new Types.ObjectId(), new Types.ObjectId()],
			})

			expect(route.likeCount).toBe(2)
		})

		it('should return 0 for likeCount when likes array is empty', () => {
			const route = new Route({
				title: 'Test Route',
				creator: new Types.ObjectId(),
				startPoint: { lat: 0, lng: 0 },
				endPoint: { lat: 1, lng: 1 },
				travelMode: 'DRIVING',
				description: 'Test description',
				totalDistance: 100,
				totalTime: 3600,
			})

			expect(route.likeCount).toBe(0)
		})
	})

	describe('Methods', () => {
		it('should correctly identify route owner', () => {
			const userId = new Types.ObjectId()
			const route = new Route({
				title: 'Test Route',
				creator: userId,
				startPoint: { lat: 0, lng: 0 },
				endPoint: { lat: 1, lng: 1 },
				travelMode: 'DRIVING',
				description: 'Test description',
				totalDistance: 100,
				totalTime: 3600,
			})

			expect(route.isOwner(userId.toString())).toBe(true)
			expect(route.isOwner(new Types.ObjectId().toString())).toBe(false)
		})

		it('should correctly check if user liked route', () => {
			const userId = new Types.ObjectId()
			const route = new Route({
				title: 'Test Route',
				creator: new Types.ObjectId(),
				startPoint: { lat: 0, lng: 0 },
				endPoint: { lat: 1, lng: 1 },
				travelMode: 'DRIVING',
				description: 'Test description',
				totalDistance: 100,
				totalTime: 3600,
				likes: [userId],
			})

			expect(route.isLikedBy(userId.toString())).toBe(true)
			expect(route.isLikedBy(new Types.ObjectId().toString())).toBe(false)
		})
	})
})
