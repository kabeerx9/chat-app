import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { api } from '@/convex/_generated/api';
import { useMutationState } from '@/hooks/useMutationState';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from 'convex/react';
import { ConvexError } from 'convex/values';
import { CirclePlus, X } from 'lucide-react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type Props = {};

const createGroupFormSchema = z.object({
	name: z.string().min(1).max(100),
	members: z.string().array().min(1).max(100),
});

const CreateGroupDialog = (props: Props) => {
	const friends = useQuery(api.friends.get);
	const { mutate: createGroup, pending } = useMutationState(
		api.conversation.createGroup
	);

	const form = useForm<z.infer<typeof createGroupFormSchema>>({
		resolver: zodResolver(createGroupFormSchema),
		defaultValues: {
			name: '',
			members: [],
		},
	});

	const members = form.watch('members', []);

	const unselectedFriends = useMemo(() => {
		return friends
			? friends.filter((friend) => !members.includes(friend._id))
			: [];
	}, [members?.length, friends?.length]);

	const handleSubmit = async (
		values: z.infer<typeof createGroupFormSchema>
	) => {
		await createGroup({
			name: values.name,
			members: values.members,
		})
			.then(() => {
				form.reset();
				toast.success('Group created');
			})
			.catch((error) => {
				toast.error(
					error instanceof ConvexError ? error.data : 'Unexpected error'
				);
			});
	};

	return (
		<Dialog>
			<Tooltip>
				<TooltipTrigger>
					<Button variant={'outline'} size={'icon'}>
						<DialogTrigger asChild>
							<CirclePlus />
						</DialogTrigger>
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Create Group</p>
				</TooltipContent>
			</Tooltip>

			<DialogContent className="block">
				<DialogHeader>
					<DialogTitle>Create Group</DialogTitle>
					<DialogDescription>Add your friends to get started</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => {
								return (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder="Group name..." {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>

						<FormField
							control={form.control}
							name="members"
							render={() => {
								return (
									<FormItem>
										<FormLabel>Friends</FormLabel>
										<FormControl>
											<DropdownMenu>
												<DropdownMenuTrigger
													asChild
													disabled={unselectedFriends.length === 0}>
													<Button className="w-full" variant={'outline'}>
														Select
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent className="w-full">
													{unselectedFriends.map((friend) => (
														<DropdownMenuCheckboxItem
															key={friend._id}
															className="flex items-center gap-2 w-full p-2"
															onCheckedChange={(checked) =>
																form.setValue('members', [
																	...members,
																	friend._id,
																])
															}>
															<Avatar className="h-8 w-8">
																<AvatarImage src={friend.imageUrl} />
																<AvatarFallback>
																	{friend.username.substring(0, 1)}
																</AvatarFallback>
															</Avatar>
															<h4 className="truncate">{friend.username}</h4>
														</DropdownMenuCheckboxItem>
													))}
												</DropdownMenuContent>
											</DropdownMenu>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
						{members && members.length ? (
							<Card
								className="
            flex items-center gap-3 overflow-x-auto w-full h-24 p-2 no-scrollbar">
								{friends
									?.filter((friend) => members.includes(friend._id))
									.map((friend) => {
										return (
											<div
												key={friend._id}
												className="flex flex-col items-center gap-1">
												<div className="relatiive">
													<Avatar className="h-8 w-8">
														<AvatarImage src={friend.imageUrl} />
														<AvatarFallback>
															{friend.username.substring(0, 1)}
														</AvatarFallback>
													</Avatar>
													<X
														className="text-muted-foreground w-4 h-4 absolute bottom-8 left-7 bg-muted rounded-full cursor-pointer "
														onClick={() => {
															form.setValue(
																'members',
																members.filter(
																	(member) => member !== friend._id
																)
															);
														}}
													/>
												</div>
												<p className="truncate text-sm">
													{friend.username.split(' ')[0]}
												</p>
											</div>
										);
									})}
							</Card>
						) : null}
						<DialogFooter>
							<Button type="submit" disabled={pending}>
								Submit
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateGroupDialog;
