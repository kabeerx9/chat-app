'use client';

import LoadingLogo from '@/components/shared/LoadingLogo';
import { ClerkProvider, SignIn, useAuth } from '@clerk/nextjs';
import {
	AuthLoading,
	Authenticated,
	ConvexReactClient,
	Unauthenticated,
} from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { usePathname } from 'next/navigation';
import React from 'react';

type Props = {
	children: React.ReactNode;
};

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;

const convex = new ConvexReactClient(CONVEX_URL);

const ConvexClientProvider = ({ children }: Props) => {
	const pathname = usePathname();
	const isRootRoute = pathname === '/';

	return (
		<ClerkProvider>
			<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
				{isRootRoute ? (
					children
				) : (
					<>
						<Authenticated>{children}</Authenticated>
						<AuthLoading>
							<LoadingLogo />
						</AuthLoading>
						<Unauthenticated>
							<SignIn routing="hash" path="/sign-in" />
						</Unauthenticated>
					</>
				)}
			</ConvexProviderWithClerk>
		</ClerkProvider>
	);
};

export default ConvexClientProvider;
