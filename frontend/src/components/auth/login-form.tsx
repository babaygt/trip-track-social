import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/services'
import { useAuthStore } from '@/stores/auth-store'
import { loginSchema, type LoginInput } from '@/lib/validations/auth'
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

export function LoginForm() {
	const navigate = useNavigate()
	const setUser = useAuthStore((state) => state.setUser)

	const form = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const loginMutation = useMutation({
		mutationFn: authApi.login,
		onSuccess: (user) => {
			setUser(user)
			toast.success(`Welcome back, ${user.name}!`)
			navigate('/')
		},
		onError: (error) => {
			if (error instanceof Error) {
				toast.error(error.message)
			} else {
				toast.error('Invalid credentials')
			}
		},
	})

	function onSubmit(data: LoginInput) {
		loginMutation.mutate(data)
	}

	return (
		<Card className='w-[400px]'>
			<CardHeader>
				<CardTitle>Login to your account</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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

						<Button
							type='submit'
							className='w-full'
							disabled={loginMutation.isPending}
						>
							{loginMutation.isPending ? 'Logging in...' : 'Login'}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
