import ConversationFallback from '@/components/shared/conversations/ConversationFallback';
import ItemList from '@/components/shared/item-list/ItemList';
import React from 'react';

type Props = {};

const FriendsPage = (props: Props) => {
	return (
		<>
			<ItemList title="Friends">Friends Page</ItemList>
			<ConversationFallback />
		</>
	);
};

export default FriendsPage;
