// Data from the table
const experimentData = {
  AIME: [
    {model: 'Distill', acc: 36.7, len: 11382},
    {model: 'Instruct', acc: 16.7, len: 1172},
    {model: 'ShorterBetter', acc: 53.3, len: 5288},
    {model: 'Training Efficient', acc: 50.0, len: 8821},
    {model: 'O1-pruner', acc: 6.7, len: 4843}
  ],
  Olympiad: [
    {model: 'Distill', acc: 52.0, len: 7762},
    {model: 'Instruct', acc: 38.2, len: 944},
    {model: 'ShorterBetter', acc: 50.7, len: 3410},
    {model: 'Training Efficient', acc: 53.9, len: 5544},
    {model: 'O1-pruner', acc: 29.6, len: 3884}
  ],
  AMC: [
    {model: 'Distill', acc: 66.3, len: 7414},
    {model: 'Instruct', acc: 51.8, len: 1084},
    {model: 'ShorterBetter', acc: 75.9, len: 2580},
    {model: 'Training Efficient', acc: 72.3, len: 4596},
    {model: 'O1-pruner', acc: 30.1, len: 4304}
  ],
  Minerva: [
    {model: 'Distill', acc: 40.8, len: 5034},
    {model: 'Instruct', acc: 38.2, len: 1367},
    {model: 'ShorterBetter', acc: 44.1, len: 1341},
    {model: 'Training Efficient', acc: 40.4, len: 2796},
    {model: 'O1-pruner', acc: 23.5, len: 5277}
  ],
  MathQA: [
    {model: 'Distill', acc: 83.3, len: 3442},
    {model: 'Instruct', acc: 68.9, len: 2585},
    {model: 'ShorterBetter', acc: 85.4, len: 980},
    {model: 'Training Efficient', acc: 78.8, len: 1350},
    {model: 'O1-pruner', acc: 32.8, len: 6321}
  ],
  BBH: [
    {model: 'Distill', acc: 68.3, len: 2126},
    {model: 'Instruct', acc: 67.3, len: 953},
    {model: 'ShorterBetter', acc: 63.1, len: 535},
    {model: 'Training Efficient', acc: 62.1, len: 798},
    {model: 'O1-pruner', acc: 55.4, len: 5431}
  ],
  MMLU: [
    {model: 'Distill', acc: 66.3, len: 1528},
    {model: 'Instruct', acc: 76.0, len: 269},
    {model: 'ShorterBetter', acc: 68.6, len: 567},
    {model: 'Training Efficient', acc: 69.3, len: 891},
    {model: 'O1-pruner', acc: 72.3, len: 5979}
  ],
  LiveCodeBench: [
    {model: 'Distill', acc: 50.6, len: 8683},
    {model: 'Instruct', acc: 24.7, len: 189},
    {model: 'ShorterBetter', acc: 49.5, len: 5228},
    {model: 'Training Efficient', acc: 49.7, len: 7589},
    {model: 'O1-pruner', acc: 21.6, len: 9726}
  ]
};

const modelColors = {
  'Distill': '#1f77b4',
  'Instruct': '#ff7f0e',
  'ShorterBetter': '#2ca02c',
  'Training Efficient': '#d62728',
  'O1-pruner': '#9467bd'
};

function makePlot(task, containerId) {
  const data = experimentData[task];
  const traces = data.map(entry => ({
    x: [entry.len],
    y: [entry.acc],
    mode: 'markers',
    type: 'scatter',
    name: entry.model,
    marker: { size: 16, color: modelColors[entry.model] },
    showlegend: false,
    hovertemplate: '<b>%{fullData.name}</b><br>' +
                   'Length: %{x}<br>' +
                   'Accuracy: %{y}%<br>' +
                   '<extra></extra>'
  }));
  
  Plotly.newPlot(containerId, traces, {
    title: {
      text: `<b>${task}</b>`,
      font: { 
        size: 20,
        family: 'Google Sans, sans-serif'
      }
    },
    xaxis: { 
      title: {
        text: 'Length',
        font: { size: 16 }
      },
      zeroline: false,
      tickfont: { size: 16 },
      tickangle: 0,
      gridcolor: '#e8e8e8'
    },
    yaxis: { 
      title: {
        text: 'Accuracy (%)',
        font: { size: 16 }
      },
      zeroline: false,
      tickfont: { size: 16 },
      tickangle: 0,
      gridcolor: '#e8e8e8'
    },
    margin: { t: 60, r: 40, b: 60, l: 60 },
    width: null,
    height: 400,
    autosize: true,
    plot_bgcolor: '#fafafa',
    paper_bgcolor: 'white',
    hoverlabel: {
      font: { size: 16 }
    }
  }, {
    responsive: true,
    displayModeBar: false
  });
}

// Create global legend
function createGlobalLegend() {
  const legendData = Object.entries(modelColors).map(([model, color]) => ({
    x: [null],
    y: [null],
    mode: 'markers',
    type: 'scatter',
    name: model,
    marker: { size: 16, color: color },
    showlegend: true
  }));

  Plotly.newPlot('global-legend', legendData, {
    showlegend: true,
    legend: {
      orientation: 'h',
      y: 0.5,
      x: 0.5,
      xanchor: 'center',
      yanchor: 'middle',
      font: { size: 16 },
      title: {
        text: '<b>Models</b>',
        font: { size: 16 }
      }
    },
    xaxis: { visible: false },
    yaxis: { visible: false },
    margin: { t: 0, r: 0, b: 0, l: 0 },
    height: 60,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)'
  }, {
    displayModeBar: false
  });
}

// Initialize all plots
makePlot('AIME', 'plot-aime');
makePlot('Olympiad', 'plot-olympiad');
makePlot('AMC', 'plot-amc');
makePlot('Minerva', 'plot-minerva');
makePlot('MathQA', 'plot-mathqa');
makePlot('BBH', 'plot-bbh');
makePlot('MMLU', 'plot-mmlu');
makePlot('LiveCodeBench', 'plot-livecodebench');
createGlobalLegend(); 