<script>
  import Plotly from './Plotly.svelte';

  export let LeftAxis;
  export let RightAxis;
  export let Observations;
  export let Treatments;

  let example = LeftAxis.tables[0];

  let data;

  $: {
    RightAxis.tables.forEach(d => d['yaxis'] = 'y2');

    let colorMap = getRectData(Treatments).colorMap;
    let colorMapDummies = Object.keys(colorMap).map(k => ({
        x: example.x,
        y: example.y,
        showlegend: true,
        visible: 'legendonly',
        opacity: 0.8,
        mode: 'markers',
        marker: {
          color: colorMap[k],
          symbol: 'square',
          size: 15,
        },
        name: k
    }));

    data = [
	  ...LeftAxis.tables,
	  ...RightAxis.tables,
      { // Dummy to force xaxis2 to show
        x: example.x,
        y: example.y,
        xaxis: 'x2',
        showlegend: false,
        opacity: 0,
      }
    ].concat(colorMapDummies);
  }
  
  let layout;
  $: {
    let lineData = getLineData(Observations.tables);
    let rects = getRectData(Treatments).rects;

    layout = {
	  xaxis: {
	    side: 'top',
	    tickformat: '%Y-%m-%d',
	  },
	  xaxis2: {
	    side: 'bottom',
	    overlaying: 'x',
	    matches: 'x',
	    tickvals: lineData.times,
	    ticktext: lineData.names,
	    showgrid: false,
	    tickangle: 90,
	  },
	  yaxis: {
	    title: LeftAxis.legend,
	    rangemode: 'tozero',
	  },
	  yaxis2: {
	    title: RightAxis.legend,
	    side: 'right',
	    overlaying: 'y',
	    rangemode: 'tozero',
	  },
      legend: {
        itemclick: false,
        itemdoubleclick: false,
      },
	  shapes: lineData.lines.concat(rects)
    };
  }

  function getLineData(observations) {
    let dashtypes = ["dot", "dash", "longdash", "dashdot", "longdashdot"];
    let obslines = observations.reduce((acc, table, idx) => acc.concat(table.data.map(d => ({
        dash: dashtypes[idx],
        time: d.time,
        name: d.name
    }))), []);
    return {
      lines: obslines.map(tr => ({
	    type: 'line',
	    xref: 'x',
	    yref: 'paper',
	    x0: tr.time,
	    x1: tr.time,
	    y0: 0,
	    y1: 1,
	    line: {
		  width: 2,
		  dash: tr.dash,
	    }
	  })),
      times: obslines.map(tr => tr.time),
      names: obslines.map(tr => tr.name)
    };
  }

  function getRectData(treatments) {
    let colors = ['blue', 'red', 'green'];
    let colorMap = {}

    treatments.forEach(value => {
      if (!colorMap[value.name]) {
        colorMap[value.name] = colors.pop();
      }
      value.color = colorMap[value.name];
    });
    
    return {
      rects: treatments.map(tr => ({
	    type: 'rect',
	    xref: 'x',
	    yref: 'paper',
	    x0: tr.start,
	    x1: tr.end,
	    y0: 0,
	    y1: 0.1,
	    line: {
		  width: 0,
	    },
	    fillcolor: tr.color,
	    opacity: 0.3,
	  })),
      colorMap: colorMap
    };
  }
  
</script>

<Plotly {data} {layout}/>
