<script>
  import Graph from './Graph.svelte';
  import PlotTable from './PlotTable.svelte';
  import StopTable from './StopTable.svelte';
  
  var ddPCR = {
    x: ['2020-01-01', '2020-01-15', '2020-01-28'],
    y: [1, 5, 6],
  };

  var LD = 	{
	x: ['2020-01-01', '2020-01-15', '2020-02-01'],
	y: [2, 7, 5],
  };

  var Observations = [
    {name: 'A', time: '2020-01-03'},
    {name: 'B', time: '2020-01-18'},
  ];

  var Treatments = [
	{name: 'Taf', start: '2020-01-05', end: '2020-01-14'},
	{name: 'Taf+Mek', start: '2020-01-14', end: '2020-01-20'},
	{name: 'Taf', start: '2020-01-20', end: '2020-02-02'},
  ];
</script>

<div style="display: flex;">
  <div style="display: flex; flex-direction: column; flex: 20%;">
    <PlotTable bind:data={ddPCR} name="ddPCR"/>
    <PlotTable bind:data={LD} name="LD"/>
    <StopTable bind:data={Observations} name="Observations" keys="{['name', 'time']}"/>
    <StopTable bind:data={Treatments} name="Treatments" keys="{['name', 'start', 'end']}"/>
  </div>

  <div style="flex: 70%">
    <Graph {ddPCR} {LD} {Observations} {Treatments}/>
  </div>
</div>
