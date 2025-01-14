<script lang="ts">
	import closeAsset from "../assets/close.svg";
	import { fade, slide } from "svelte/transition";
	import { Jellyfish } from "svelte-loading-spinners";
	import { toasts, ToastContainer, FlatToast } from "svelte-toasts";
	import { swipe } from "svelte-gestures";

	export let selectedIndex: number;
	export let klasser: string[];
	export let menuActive: boolean;

	let loading = false;

	let username: string;
	let password: string;
	let klasse: string;

	async function addNewUser() {
		loading = true;

		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		const raw = JSON.stringify({
			username: username,
			pass: password,
			class: klasse,
		});

		const requestOptions: RequestInit = {
			method: "POST",
			headers: myHeaders,
			body: raw,
		};

		const res = await fetch(
			"https://api.betterschool.cheesyphoenix.tk/addUser",
			requestOptions
		);

		if (res.status == 200) {
			toasts.add({
				title: "New user added successfully!",
				description: "Class list will update shortly",
				duration: 3000,
				placement: "bottom-right",
				type: "success",
				theme: "dark",
				showProgress: true,
			});
		} else {
			toasts.add({
				title: "Failed to add user",
				description: "Check your credentials!",
				duration: 3000,
				placement: "bottom-right",
				type: "error",
				theme: "dark",
				showProgress: true,
			});
		}

		loading = false;
	}

	function swipeHandler(
		event: CustomEvent<{
			direction: "top" | "right" | "bottom" | "left";
			target: EventTarget;
		}>
	) {
		if (event.detail.direction == "top") {
			menuActive = false;
		}
	}
</script>

<div
	id="menu"
	transition:slide
	use:swipe={{
		timeframe: 300,
		minSwipeDistance: 60,
		touchAction: "pan-x",
	}}
	on:swipe={swipeHandler}
>
	<h3 style="margin-left: 3rem;">Select class to view</h3>

	<select bind:value={selectedIndex} class="selectClass">
		{#if klasser}
			{#each klasser as klasse, index}
				<option value={index}>{klasse}</option>
			{/each}
		{/if}
	</select>

	<br />
	<br />
	<hr />
	<div style="margin-left: 3rem;">
		<h3>Register new class</h3>
		<h5>Username:</h5>
		<input type="text" bind:value={username} />
		<h5>Password:</h5>
		<input type="password" bind:value={password} />
		<h5>Class:</h5>
		<input type="text" bind:value={klasse} />
		<br />
		<br />
		<button on:click={addNewUser}>Register</button>
	</div>

	<a id="GitHub-link" href="https://github.com/CheesyPhoenix/BetterSchool">
		This project is open-source! Fork me on GitHub or submit an issue here!
	</a>

	{#if loading}
		<div class="loadingPanel" transition:fade>
			<Jellyfish />
		</div>
	{/if}

	<div
		class="settingsBtn"
		on:click={() => {
			menuActive = false;
		}}
		in:fade
		out:fade
	>
		<img
			src={closeAsset}
			alt="Forrige uke"
			class="buttonImg settingsImg"
			style="height: 35px;"
		/>
	</div>

	<ToastContainer placement="bottom-right" let:data>
		<FlatToast {data} />
	</ToastContainer>
</div>

<style>
	a {
		text-decoration: none;
		color: #999;
	}
	a:hover {
		text-decoration: underline;
	}

	#GitHub-link {
		text-align: center;
		width: auto;
		position: absolute;
		bottom: 1em;
		margin-left: 0.5em;
		margin-right: 0.5em;
	}

	input {
		background-color: #333;
		border: none;
		border-radius: 5px;
		min-height: 2em;
		color: #f5f5f5;
		transition-duration: 0.15s;
		outline: none;
		padding-left: 5px;
	}
	input:hover {
		background-color: #444;
	}
	input:focus {
		background-color: #555;
		border: none;
	}
	input:focus-visible {
		border: none;
	}

	h5 {
		margin: 0.5em 0;
	}

	select {
		background-color: #333;
		border: none;
		border-radius: 5px;
		min-height: 2em;
		color: #f5f5f5;
		transition-duration: 0.15s;
		outline: none;
	}
	select:hover {
		background-color: #444;
	}
	select:focus {
		background-color: #555;
	}

	button {
		color: #f5f5f5;
		background-color: #333;
		height: 3em;
		width: auto;
		padding: 0.5em 1em;
		border: none;
		border-radius: 5px;
		transition-duration: 0.15s;
		cursor: pointer;
		outline: none;
	}
	button:hover {
		background-color: #555;
	}

	button:focus {
		background-color: #555;
	}

	#menu {
		z-index: 10;
		position: absolute;
		width: 100%;
		height: 100%;
		margin: 0;
		background-color: #222;
	}

	.loadingPanel {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 11;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #000000aa;
	}

	.selectClass {
		margin-left: 3rem;
	}

	.settingsBtn {
		right: 0.75em;
		top: 0.75em;
		position: absolute;
		z-index: 2;
		user-select: none;
		transition-duration: 0.3s;
	}
	.settingsBtn:hover {
		cursor: pointer;
	}

	.settingsImg {
		filter: none;
		transition-duration: 0.15s;
	}
	.settingsImg:hover {
		filter: drop-shadow(2px 4px 6px black) brightness(1.5);
	}
</style>
