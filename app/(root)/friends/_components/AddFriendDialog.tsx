'use client';
import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutationState } from '@/hooks/useMutationState';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { ConvexError } from 'convex/values';

type Props = {};

const AddFriendFormSchema = z.object({
	email: z
		.string()
		.min(1, { message: "This field can't be empty" })
		.email({ message: 'Invalid email address' }),
});

const AddFriendDialog = (props: Props) => {
	const form = useForm<z.infer<typeof AddFriendFormSchema>>({
		resolver: zodResolver(AddFriendFormSchema),
		defaultValues: {
			email: '',
		},
	});

	const { mutate: createRequest, pending } = useMutationState(
		api.request.create
	);

	const handleSubmit = async (values: z.infer<typeof AddFriendFormSchema>) => {
		await createRequest({ email: values.email })
			.then(() => {
				toast.success('Friend request sent');
				form.reset();
			})
			.catch((err) => {
				toast.error(err instanceof ConvexError ? err.data : 'Unexpected error');
				console.error(err);
			});
	};

	return (
		<Dialog>
			<Tooltip>
				<TooltipTrigger>
					<Button size={'icon'} variant={'outline'}>
						<DialogTrigger>
							<UserPlus />
						</DialogTrigger>
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Add Friend</p>
				</TooltipContent>
			</Tooltip>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Friend</DialogTitle>
					<DialogDescription>
						Send a friend request to someone by entering their email address.
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-8">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="Email ..." {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}></FormField>
						<DialogFooter>
							<Button type="submit" disabled={pending}>
								Send
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default AddFriendDialog;
