import { ConvexError, v } from 'convex/values';
import { query } from './_generated/server';
import { getUserByClerkId } from './_utils';

export const get = query({
	args: {
		id: v.id('conversations'),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new Error('Unauthorized');

		const currentUser = await getUserByClerkId({
			ctx,
			clerkId: identity.subject,
		});

		if (!currentUser) {
			throw new ConvexError('User not found');
		}

		const membership = await ctx.db
			.query('conversationMembers')
			.withIndex('by_memberId_conversationId', (q) =>
				q.eq('memberId', currentUser._id).eq('conversationId', args.id)
			)
			.unique();

		if (!membership) {
			throw new ConvexError("You aren't a member of this conversation");
		}

		const messages = await ctx.db
			.query('messages')
			.withIndex('by_conversationId', (q) => q.eq('conversationId', args.id))
			.order('desc')
			.collect();

		const messagesWithUsers = await Promise.all(
			messages.map(async (message) => {
				const user = await ctx.db.get(message.senderId);

				if (!user) {
					throw new ConvexError('Could not find user of message   ');
				}

				return {
					message,
					senderImage: user.imageUrl,
					senderName: user.username,
					isCurrentUser: user._id === currentUser._id,
				};
			})
		);

		return messagesWithUsers;
	},
});
