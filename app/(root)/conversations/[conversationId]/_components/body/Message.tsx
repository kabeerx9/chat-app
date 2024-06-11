import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { currentUser } from '@clerk/nextjs/server';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Props = {
	fromCurrentUser: boolean;
	senderName: string;
	senderImage: string;
	lastByUser: boolean;
	content: string[];
	createdAt: number;
	type: string;
};

const Message = ({
	fromCurrentUser,
	senderName,
	senderImage,
	lastByUser,
	content,
	createdAt,
	type,
}: Props) => {
	const formatTime = (timeStamp: number) => {
		return format(timeStamp, 'HH:mm');
	};
	return (
		<div className={cn('flex items-end', { 'justify-end': fromCurrentUser })}>
			<div
				className={cn('flex flex-col w-full mx-2', {
					'order-1 items-end': fromCurrentUser,
					'order-2 items-start': !fromCurrentUser,
				})}>
				<div
					className={cn('px-4 py-2 rounded-lg max-w-[78%]', {
						'bg-primary text-primary-foreground': fromCurrentUser,
						'bg-secondary text-secondary-foreground': !fromCurrentUser,
						'rounded-br-none': !lastByUser && currentUser,
						'rounded-bl-none': !lastByUser && !currentUser,
					})}>
					{type === 'text' && (
						<p className="text-wrap break-words whitespace-pre-wrap break-all">
							{content}
						</p>
					)}
					<p
						className={cn('text-xs flex w-full my-1', {
							'text-primary-forground justify-end': fromCurrentUser,
							'text-secondary-foreground justify-start': !fromCurrentUser,
						})}>
						{formatTime(createdAt)}
					</p>
				</div>
			</div>
			<Avatar
				className={cn('relative w-8 h-8', {
					'order-2 ': fromCurrentUser,
					'order-1': !fromCurrentUser,
					invisible: lastByUser,
				})}>
				<AvatarImage src={senderImage} />
				<AvatarFallback>{senderName.substring(0, 1)}</AvatarFallback>
			</Avatar>
		</div>
	);
};

export default Message;
