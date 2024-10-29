<script>
	import { graphSteps, hoverNode, selectedMarkdownItem } from '@stores';
	import { getNestedValue } from '@utils';
	import * as config from '@setup';
	import { onDestroy, afterUpdate } from 'svelte';
	export let datum;
	export let entities;
	export let updatePosition;
	export let essaysItems;
	export let site;
	export let openNode;
	let imageSrc;

	let previousNode = null;

	afterUpdate(() => {
		const currentNode = datum.source;
		if (currentNode == `item_${$selectedMarkdownItem}` && currentNode != previousNode) {
			openNode(datum, 1);
		}
		previousNode = `item_${$selectedMarkdownItem}`;
	});

	onDestroy(() => {
		$updatePosition = true;
	});

	function handleLoad() {
		$updatePosition = true;
	}

	function handleError(event) {
		event.target.style.display = 'none'; // Hide image on error
	}

	function getImageByNode(node) {
		const id = node;
		const datum = $entities.find((d) => {
			return d['@id'] == id;
		});
		return getNestedValue(datum, config.paths.img.join('.'));
	}

	$: {
		imageSrc = getImageByNode(datum.target);
	}

	$: source = datum?.source; //?.split('/').slice(-1)[0];
	$: target = datum?.target; //?.split('/').slice(-1)[0];

	$: essaysItemsLinks = essaysItems.find((d) => d.id == target);
	$: selected = $graphSteps.some((d) => d?.id == datum.target);

	let card;
	function handleMouseEnter(target) {
		const dataId = target;
		const nodeElement = document.querySelector(`.node-highlite[data-id="${dataId}"]`);
		if (nodeElement) {
			nodeElement.classList.add('hover');
		}
		card.classList.add('hover');
	}

	function handleMouseLeave(target) {
		const dataId = target;
		const nodeElement = document.querySelector(`.node-highlite[data-id="${dataId}"]`);
		if (nodeElement) {
			nodeElement.classList.remove('hover');
		}
		card.classList.remove('hover');
	}
</script>

<div
	class="node"
	class:selected
	class:linkToEssay={essaysItemsLinks != undefined}
	title={datum.title}
	{source}
	{target}
	data-id={target}
	bind:this={card}
	on:mouseover={() => {
		$hoverNode = target;
		handleMouseEnter(target);
	}}
	on:mouseleave={handleMouseLeave(target)}
	on:click
	on:keydown
	on:focus
>
	{#if datum.img}
		<img
			src={datum.img.replace('square', 'large')}
			alt={datum.title}
			on:load={handleLoad}
			on:error={handleError}
		/>
		{#if datum.title}
			<div class="title">{datum.title?.replace(config.url, '')}</div>
		{/if}
	{:else if imageSrc}
		<img src={imageSrc} alt={datum.title} on:load={handleLoad} on:error={handleError} />
		{#if datum.title}
			<div class="title">{datum.title?.replace(config.url, '') || ''}</div>
		{/if}
	{:else}
		<div class="title">{datum.title?.replace(config.url, '') || ''}</div>
	{/if}

	<!-- Links -->
	{#if essaysItemsLinks != undefined}
		{#each essaysItemsLinks.essays as d}
			<a class="link" href={d.url} target="_blank" rel="noopener noreferrer">
				→<em>{d.title}</em></a
			>
		{/each}
	{/if}

	<!-- not title == is media -->
	{#if site}
		{#if datum.title == undefined || datum.title.length == 1}
			<a class="link" href={`${site}/media/${target}`} target="_blank" rel="noopener noreferrer"
				>→ Metadata</a
			>
		{:else}
			<a class="link" href={`${site}/item/${target}`} target="_blank" rel="noopener noreferrer"
				>→ Metadata</a
			>
		{/if}
	{/if}
</div>

<style>
	.node {
		background-color: #f6f6f6;
		padding: 5px 10px;
		margin-bottom: 15px;
		box-shadow: 0px 0px 4px 0px #f6f6f6;
		width: 220px;
	}

	.node:hover,
	.selected {
		background-color: white;
		color: black;
		box-shadow: inset -1px 1px 13px 0px var(--theme-color);
		opacity: 1;
	}

	.title {
		font-size: 0.7rem;
		overflow-wrap: break-word;
	}

	.link {
		margin-top: 1rem;
		margin-bottom: 0.5rem;
		font-size: 0.7rem;
		display: none;
		padding-bottom: 1rem;
		border-bottom: 1px solid gainsboro;
	}

	.selected > .link {
		display: block;
	}

	img {
		padding-top: 0.5rem;
		width: 100%;
		object-fit: contain;
	}

	.linkToEssay {
		border: 1px solid var(--theme-color);
		box-shadow: inset -1px 1px 13px 0px var(--theme-color);
	}
</style>
