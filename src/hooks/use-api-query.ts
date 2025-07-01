import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

interface UseApiQueryOptions<T> {
	queryKey: string[];
	queryFn: () => Promise<T>;
	enabled?: boolean;
	onError?: (error: Error) => void;
}

export function useApiQuery<T>({
	queryKey,
	queryFn,
	enabled = true,
	onError,
}: UseApiQueryOptions<T>): UseQueryResult<T, Error> {
	const result = useQuery({
		queryKey,
		queryFn,
		enabled,
	});

	// Handle errors using useEffect since onError was removed
	if (result.error && onError) {
		onError(result.error);
	}

	return result;
}
