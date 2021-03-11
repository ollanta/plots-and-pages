<script>
  export let data;
  export let layout;

  var initialized;

  function scriptlyLoaded() {
	Plotly.newPlot('plotly-graph', data, layout);
    initialized = true;
  }

  let timeout;

  $: if (initialized) {
    // debounce updates
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      Plotly.react('plotly-graph', data, layout)
    }, 500);
  }
</script>

<svelte:head>
  <script src="https://cdn.plot.ly/plotly-latest.min.js" on:load="{scriptlyLoaded}"></script>
</svelte:head>

<div id="plotly-graph"></div>
