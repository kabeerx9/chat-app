import Image from 'next/image';
import React from 'react';

type Props = {
	size?: number;
};

const LoadingLogo = ({ size = 100 }: Props) => {
	return (
		<div className="w-full h-full flex justify-center items-center">
			<Image
				src={'/logo.svg'}
				alt="Logo"
				width={size}
				height={size}
				className="animate-pulse duration-700"
			/>
		</div>
	);
};

export default LoadingLogo;
