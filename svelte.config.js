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
			// pages: 'build',
			// assets: 'build',
			fallback: 'index.html',
		}),
		prerender: {	
			crawl: true,
			entries: ['/','/template', '/text1'] // the static adapter needs to know the existing texts
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