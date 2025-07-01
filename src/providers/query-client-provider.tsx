"use client";

import { QueryClientProvider as ReactQueryProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/query-client";

export function QueryClientProvider({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<ReactQueryProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</ReactQueryProvider>
	);
}
