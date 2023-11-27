import adapter from '@sveltejs/adapter-static';

import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', ...mdsvexConfig.extensions],
	preprocess: [
		mdsvex(mdsvexConfig)
	],
	kit: {
		adapter: adapter(	{
			fallback: 'index.html',
		}),
		prerender: {
			crawl: true,
			entries: ['/template'],
			handleHttpError: ({ path, message }) => {
				return
				// ignore deliberate link to shiny 404 page
				if (path === '/template') {
					return;
				}
				// otherwise fail the build
				throw new Error(message);
			}
		},
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		},
		alias: {
			'@components': 'src/components',
			'@stores': 'src/stores.js',
			'@utils': 'src/utils.js',
			'@setup': 'src/setup.json',
		}
	}
};

export default config;