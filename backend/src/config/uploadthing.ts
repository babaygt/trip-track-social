// backend\src\config\uploadthing.ts
import { createUploadthing, type FileRouter } from 'uploadthing/express'

const f = createUploadthing()

// Define your FileRouter(s) here:
export const uploadRouter = {
	imageUploader: f({
		// "image" => only allow image uploads, up to 4MB each
		image: {
			maxFileSize: '4MB',
			maxFileCount: 1, // or more if you want multiple
		},
	}).onUploadComplete(async ({ file }) => {
		// This callback is triggered after a successful upload
		console.log('File uploaded:', file.url)
		// If you wanted to do something server-side, e.g. store it in DB, you can do so here
	}),
} satisfies FileRouter

export type OurFileRouter = typeof uploadRouter
