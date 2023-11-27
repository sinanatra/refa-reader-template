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
		adapter: adapter({
		    pages: 'build',
		    assets: 'build',
		    strict: false,
		    fallback: '404.html'
	    }),
		// prerender: {
		// 	crawl: true,
		// 	entries: ['/template'],
		// },
		paths: {
			assets: 'https://uclab-potsdam.github.io/refa-reader-template-static',
			// base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
			base: '/refa-reader-template-static',
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