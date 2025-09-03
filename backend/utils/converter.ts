export const jsonToServerProperties = (json: Record<string, any>) => {
	return Object.entries(json)
		.map(
			([key, value]) =>
				`${key}=${typeof value === 'boolean' ? value.toString().toLowerCase() : value}`,
		)
		.join('\n')
}
