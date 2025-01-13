import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/services'
import { useAuthStore } from '@/stores/auth-store'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'
import { toast } from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { PasswordInput } from '@/components/ui/password-input'

export function RegisterForm() {
	const navigate = useNavigate()
	const setUser = useAuthStore((state) => state.setUser)

	const form = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: '',
			username: '',
			email: '',
			password: '',
			bio: '',
		},
	})

	const registerMutation = useMutation({
		mutationFn: authApi.register,
		onSuccess: (user) => {
			setUser(user)
			toast.success(
				`Welcome ${user.name}! Your account has been created successfully.`
			)
			navigate('/login')
		},
		onError: (error) => {
			if (error instanceof Error) {
				toast.error(error.message)
			} else {
				toast.error('Something went wrong. Please try again.')
			}
		},
	})

	function onSubmit(data: RegisterInput) {
		registerMutation.mutate(data)
	}

	return (
		<Card className='w-[400px]'>
			<CardHeader>
				<CardTitle>Create an account</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder='John Doe' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='username'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input placeholder='johndoe' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type='email'
											placeholder='john@example.com'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<PasswordInput {...field} />
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
									<FormLabel>Bio</FormLabel>
									<FormControl>
										<Input placeholder='Tell us about yourself' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type='submit'
							className='w-full'
							disabled={registerMutation.isPending}
						>
							{registerMutation.isPending ? 'Creating account...' : 'Register'}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
