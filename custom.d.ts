// custom.d.ts
declare module '@clerk/nextjs/dist/types/server' {
	export interface WebhookEvent {
		type: string;
		data: any;
	}
}
