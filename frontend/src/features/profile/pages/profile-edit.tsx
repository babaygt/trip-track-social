import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { userApi } from '@/services'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials, UploadButton } from '@/lib/utils'

interface ProfileFormData {
	name: string
	bio: string
}

export default function ProfileEditPage() {
	const { user, setUser } = useAuthStore()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const form = useForm<ProfileFormData>({
		defaultValues: {
			name: user?.name || '',
			bio: user?.bio || '',
		},
	})

	const { mutate: updateProfile, isPending } = useMutation({
		mutationFn: (data: ProfileFormData & { profilePicture?: string }) =>
			userApi.updateProfile(user!._id, data),
		onSuccess: (updatedUser) => {
			setUser(updatedUser)
			queryClient.setQueryData(['user', user?.username], updatedUser)
			queryClient.setQueryData(['profile', user?.username], updatedUser)
			toast.success('Profile updated successfully')
			navigate(`/profile/${user?.username}`)
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : 'Failed to update profile'
			)
		},
	})

	const onSubmit = (data: ProfileFormData) => {
		updateProfile(data)
	}

	const handleProfilePictureUpdate = (imageUrl: string) => {
		updateProfile({
			name: form.getValues('name'),
			bio: form.getValues('bio'),
			profilePicture: imageUrl,
		})
	}

	if (!user) {
		return null
	}

	return (
		<div className='min-h-[calc(100vh-4rem)] flex items-center justify-center p-4'>
			<Card className='w-full max-w-2xl border-none shadow-md'>
				<CardHeader className='text-center pb-2'>
					<CardTitle className='text-2xl font-bold'>Edit Profile</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='flex flex-col items-center mb-8'>
						<Avatar className='h-32 w-32 mb-4'>
							{user.profilePicture ? (
								<AvatarImage src={user.profilePicture} alt={user.name} />
							) : (
								<AvatarFallback className='text-4xl bg-primary/10'>
									{getInitials(user.name)}
								</AvatarFallback>
							)}
						</Avatar>
						<UploadButton
							endpoint='imageUploader'
							onClientUploadComplete={(res) => {
								if (res && res[0]) {
									handleProfilePictureUpdate(res[0].url)
								}
							}}
							onUploadError={(error: Error) => {
								toast.error(`Error uploading image: ${error.message}`)
							}}
						/>
					</div>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-base'>Name</FormLabel>
										<FormDescription>
											This is your public display name.
										</FormDescription>
										<FormControl>
											<Input {...field} className='h-11' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='bio'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-base'>Bio</FormLabel>
										<FormDescription>
											Write a short bio about yourself.
										</FormDescription>
										<FormControl>
											<Textarea
												{...field}
												className='min-h-[100px] resize-none'
												placeholder='Tell us about yourself'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className='flex justify-end gap-4 pt-4'>
								<Button
									type='button'
									variant='outline'
									onClick={() => navigate(-1)}
									className='w-24'
								>
									Cancel
								</Button>
								<Button type='submit' disabled={isPending} className='w-24'>
									{isPending ? 'Saving...' : 'Save'}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
