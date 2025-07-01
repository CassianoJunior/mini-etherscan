import { defineConfig } from 'orval';

export default defineConfig({
	http: {
		input: './openapi.json',
		output: {
			target: './src/http',
			client: 'react-query',
			namingConvention: 'kebab-case',
			mode: 'tags-split',
			mock: true,
			override: {
				mutator: {
					path: 'src/lib/axios.ts',
					name: 'api',
				},
			},
		},
	},
})
