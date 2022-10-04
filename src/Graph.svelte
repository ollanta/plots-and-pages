<script>
  import Plotly from './Plotly.svelte';

  export let MainSettings;
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
        opacity: 0.3,
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
      title: MainSettings.title,
	  xaxis: {
	    side: 'top',
	    tickformat: MainSettings.xdays ? '' : '%Y-%m-%d',
	  },
	  xaxis2: {
	    side: 'bottom',
	    overlaying: 'x',
	    matches: 'x',
	    tickvals: lineData.times,
	    ticktext: lineData.names.map(n => ' ' + n),
	    showgrid: false,
	    tickangle: 90,
	    automargin: true,
	  },
      yaxis: getLeftAxis(MainSettings, LeftAxis),
      yaxis2: getRightAxis(MainSettings, LeftAxis, RightAxis),
      legend: {
        x: 1.05,
        itemclick: false,
        itemdoubleclick: false,
      },
	  shapes: lineData.lines.concat(rects)
    };
  }

  function getLeftAxis(mainSettings, leftAxis) {
    if (!mainSettings.log) {
      let ltickrange = getVariableTickRange(leftAxis.tables);

      return {
        title: leftAxis.legend,
        range: ltickrange.range,
        tickvals: ltickrange.tickvals,
      };
    } else {
      let ltickrange = getVariableLogTickRange(leftAxis.tables);

      return {
        type: 'log',
        title: leftAxis.legend,
        range: ltickrange.range,
        tickvals: ltickrange.tickvals,
      };
    }
  }

  function getRightAxis(mainSettings, leftAxis, rightAxis) {
    if (!mainSettings.log) {
      let ltickrange = getVariableTickRange(leftAxis.tables);
      let rtickrange = getFixedTickRange(rightAxis.tables, ltickrange.nticks);

      return {
	    title: rightAxis.legend,
	    side: 'right',
	    overlaying: 'y',
        range: rtickrange.range,
        tickvals: rtickrange.tickvals,
	  };
    } else {
      let ltickrange = getVariableLogTickRange(leftAxis.tables);
      let rtickrange = getFixedLogTickRange(rightAxis.tables, ltickrange.nTicks);

      return {
        type: 'log',
        title: rightAxis.legend,
	    side: 'right',
	    overlaying: 'y',
        range: rtickrange.range,
        tickvals: rtickrange.tickvals,
      }
    }
  }

  function getVariableLogTickRange(tables) {
    let maxy = Math.max(...tables.map(t => Math.max(...t.y)));
    let miny = Math.min(...tables.map(t => Math.min(...t.y)));

    if (miny <= 0) {
      return {
        range: [0, Math.log10(maxy)],
        tickvals: [0, Math.log10(maxy)],
      }
    }

    let logmax = Math.ceil(Math.log10(maxy));
    let logmin = Math.floor(Math.log10(miny));
    let size = logmax - logmin

    // TODO: limit number of tickvals

    return {
      range: [logmin - size * 0.1, logmax + size * 0.1],
      tickvals: [...Array(1+size).keys()].map(i => Math.pow(10, logmin+i)),
      nTicks: size+1
    }
  }

  function getFixedLogTickRange(tables, nTicks) {
    let maxy = Math.max(...tables.map(t => Math.max(...t.y)));
    let miny = Math.min(...tables.map(t => Math.min(...t.y)));

    if (miny <= 0) {
      return {
        range: [0, Math.log10(maxy)],
        tickvals: [0, Math.log10(maxy)],
      }
    }

    let logmax = Math.ceil(Math.log10(maxy));
    let logmin = Math.floor(Math.log10(miny));
    let size = logmax - logmin

    return {
      range: [logmin - size * 0.1, logmax + size * 0.1],
      tickvals: [...Array(nTicks).keys()].map(i => Math.pow(10, logmin+i*size/(nTicks-1))),
    }
  }

  function getVariableTickRange(tables) {
    let maxy = Math.max(...tables.map(t => Math.max(...t.y)));
    let expansionFactor = 1.1;
    // let the max val be somewhat above the max tick
    let contractedMaxy = 2 * maxy / (1+expansionFactor);

    let one = Math.pow(10, Math.floor(Math.log10(contractedMaxy)));

    let tickd;
    let nTicks;
    for (let base of [2, 1, 0.5, 0.2]) {
      tickd = base * one;
      if (Math.round(maxy / tickd) >= 4) {
        nTicks = Math.ceil(maxy / tickd) + 1;
        break;
      }
    }

    return {
      range: [0, tickd * (nTicks-1) * expansionFactor],
      tickvals: [...Array(nTicks).keys()].map(i => i * tickd),
      nticks: nTicks,
    }
  }

  function getFixedTickRange(tables, nTicks) {
    let maxy = Math.max(...tables.map(t => Math.max(...t.y)));
    let expansionFactor = 1.1;
    // let the max val be somewhat above the max tick
    let contractedMaxy = 2 * maxy / (1+expansionFactor);

    let one = Math.pow(10, Math.floor(Math.log10(contractedMaxy)));

    let tickd;
    for (let base of [1, 0.5, 0.1]) {
      base *= one;
      tickd = Math.ceil(contractedMaxy / (nTicks - 1) / base) * base;
      if (tickd * (nTicks - 1) * 0.75 <= maxy) { break; }
    }

    return {
      range: [0, tickd * (nTicks-1) * expansionFactor],
      tickvals: [...Array(nTicks).keys()].map(i => i * tickd),
    }
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
