export const load = async ({ fetch }) => {
    const response = await fetch(`/api/posts`)
    const posts = await response.json()

    return {
        posts
    }
}

export const entries = (() => {
	return [
		{
			slug: 'template'
		},
	];
})

export const prerender = true;