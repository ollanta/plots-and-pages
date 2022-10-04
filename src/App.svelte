<script>
  import Graph from './Graph.svelte';
  import PlotTables from './PlotTables.svelte';
  import StopTable from './StopTable.svelte';
  import StopTables from './StopTables.svelte';
  import PlotSettings from './PlotSettings.svelte';
  
  let MainSettings, LeftAxis, RightAxis, Observations, Treatments;

  function loadDummyData() {
    return {
      MainSettings: {
        title: '',
        log: false,
        xdays: false,
      },
      LeftAxis: {
        legend: "Värde - ddPCR",
        tables: [{
          x: ['2020-01-01', '2020-01-15', '2020-01-28'],
          y: [1, 5, 6],
          name: 'ddPCR',
        }]
      },
      RightAxis: {
        legend: "Värde - LD",
        tables: [{
	      x: ['2020-01-01', '2020-01-15', '2020-02-01'],
	      y: [2, 7, 5],
          name: 'LD',
        }]
      },
      Observations: {
        keys: ['name', 'time'],
        tables: [{
          data: [{name: 'A', time: '2020-01-03'},
                 {name: 'B', time: '2020-01-18'}]
        }],
      },
      Treatments: [
	    {name: 'Taf', start: '2020-01-05', end: '2020-01-14'},
	    {name: 'Taf+Mek', start: '2020-01-14', end: '2020-01-20'},
	    {name: 'Taf', start: '2020-01-20', end: '2020-02-02'},
      ],
    };
  }

  function getQueryData() {
    const url = new URL(window.location);
    const data = url.searchParams.get('d');

    if (data) {
      const parsed = JSON.parse(atob(decodeURIComponent(data)));
      // version conversion
      if (parsed.MainSettings == undefined) {
        parsed.MainSettings = {
          title: '',
          log: parsed.LeftAxis.log,
          xdays: false,
        }
      }
      return parsed
    }
  }

  function toUrlWithQueryData() {
    const url = new URL(window.location);
    const data =  encodeURIComponent(btoa(JSON.stringify(
      {MainSettings, LeftAxis, RightAxis, Observations, Treatments}
    )));

    url.searchParams.set('d', data);
    return url.toString();
  }

  function loadData() {
    const data = getQueryData();

    ({ MainSettings, LeftAxis, RightAxis, Observations, Treatments } = data || loadDummyData());
  }

  loadData();

</script>

<div style="display: flex;">
  <div style="display: flex; flex-direction: column; flex: 20%;">
    <h3>Main settings</h3>
    <PlotSettings bind:data={MainSettings}/>
    <h3>Left axis data</h3>
    <PlotTables bind:data={LeftAxis}/>
    <h3>Right axis data</h3>
    <PlotTables bind:data={RightAxis}/>
    <h3>Observations</h3>
    <StopTables bind:data={Observations}/>
    <h3>Treatments</h3>
    <StopTable bind:data={Treatments} keys="{['name', 'start', 'end']}"/>
  </div>

  <div style="flex: 70%">
    <Graph {MainSettings} {LeftAxis} {RightAxis} {Observations} {Treatments}/>
    <button on:click="{() => navigator.clipboard.writeText(toUrlWithQueryData())}">Copy link to clipboard</button>
  </div>
</div>


<style>
  button {
    margin-left: 4em;
  }
</style>
