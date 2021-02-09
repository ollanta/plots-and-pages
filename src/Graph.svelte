<script>
  import Plotly from './Plotly.svelte';

  export let ddPCR;
  export let LD;
  export let Observations;
  export let Treatments;

  var data;

  $: {
    LD['yaxis'] = 'y2';

    var colorMap = getRectData(Treatments).colorMap;
    var colorMapDummies = Object.keys(colorMap).map(function(k) {
      return {
        x: ddPCR.x,
        y: ddPCR.y,
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
      }
    });

    data = [
	  ddPCR,
	  LD,
      { // Dummy to force xaxis2 to show
        x: ddPCR.x,
        y: ddPCR.y,
        xaxis: 'x2',
        showlegend: false,
        opacity: 0,
      }
    ].concat(colorMapDummies);
  }
  
  var layout;
  $: {
    var lineData = getLineData(Observations);
    var rects = getRectData(Treatments).rects;

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
	    title: 'Värde - ddPCR',
	    rangemode: 'tozero',
	  },
	  yaxis2: {
	    title: 'Värde - LD',
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
    return {
      lines: observations.map(function(tr) {
	    return {
	      type: 'line',
	      xref: 'x',
	      yref: 'paper',
	      x0: tr.time,
	      x1: tr.time,
	      y0: 0,
	      y1: 1,
	      line: {
		    width: 2,
		    dash: 'dash',
	      }
	    }
      }),
      times: observations.map(function(tr) { return tr.time; }),
      names: observations.map(function(tr) { return tr.name; })
    };
  }

  function getRectData(treatments) {
    var colors = ['blue', 'red', 'green'];
    var colorMap = {}

    treatments.forEach(function(value) {
      if (!colorMap[value.name]) {
        colorMap[value.name] = colors.pop();
      }
      value.color = colorMap[value.name];
    });
    
    return {
      rects: treatments.map(function(tr) {
	    return {
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
	    };
      }),
      colorMap: colorMap
    };
  }
  
</script>

<Plotly {data} {layout}/>
