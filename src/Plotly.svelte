<script>
  export let data;
  export let layout;

  let initialized;

  function scriptlyLoaded() {
	Plotly.newPlot('plotly-graph', data, layout);
    initialized = true;
  }

  let timeout;

  function fixOpacity() {
    // Our hack to add legends for rects make them disabled by default
    // and adds opacity 0.5, which looks ugly
    for (let el of document.getElementsByClassName('traces')) {
      if (el.style.opacity != 1) {
        el.style.opacity = 1;
      }
    }
  }

  $: if (initialized) {
    // debounce updates
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      Plotly.react('plotly-graph', data, layout);
      fixOpacity();
    }, 500);
  }
</script>

<svelte:head>
  <script src="https://cdn.plot.ly/plotly-latest.min.js" on:load="{scriptlyLoaded}"></script>
</svelte:head>

<div id="plotly-graph"></div>
