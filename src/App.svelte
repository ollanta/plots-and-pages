<script>
  import Graph from './Graph.svelte';
  import PlotTables from './PlotTables.svelte';
  import StopTable from './StopTable.svelte';
  
  var LeftAxis = {
    legend: "Värde - ddPCR",
    tables: [{
      x: ['2020-01-01', '2020-01-15', '2020-01-28'],
      y: [1, 5, 6],
      name: 'ddPCR',
    }]
  };

  var RightAxis = {
    legend: "Värde - LD",
    tables: [{
	  x: ['2020-01-01', '2020-01-15', '2020-02-01'],
	  y: [2, 7, 5],
      name: 'LD',
    }]
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
    <PlotTables bind:data={LeftAxis} name="Left axis data"/>
    <PlotTables bind:data={RightAxis} name="Right axis data"/>
    <StopTable bind:data={Observations} name="Observations" keys="{['name', 'time']}"/>
    <StopTable bind:data={Treatments} name="Treatments" keys="{['name', 'start', 'end']}"/>
  </div>

  <div style="flex: 70%">
    <Graph {LeftAxis} {RightAxis} {Observations} {Treatments}/>
  </div>
</div>
