'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutationState } from '@/hooks/useMutationState';
import { ConvexError } from 'convex/values';
import React from 'react';
import { toast } from 'sonner';

type Props = {
	conversationId: Id<'conversations'>;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const LeaveGroupDialog = ({ conversationId, open, setOpen }: Props) => {
	const { mutate: leaveGroup, pending } = useMutationState(
		api.conversation.leaveGroup
	);

	const handleLeaveGroup = async () => {
		leaveGroup({ conversationId })
			.then(() => {
				toast.success('Group left');
			})
			.catch((error) => {
				toast.error(
					error instanceof ConvexError ? error.data : 'An error occurred'
				);
			});
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure ?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone , you will not be able to see this
						group or message it
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
					<AlertDialogAction disabled={pending} onClick={handleLeaveGroup}>
						Leave
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default LeaveGroupDialog;
