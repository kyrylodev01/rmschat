
import {useState, useCallback, useMemo, useRef, useEffect} from 'react';
import './RMSGraph.css';
import zoomPlugin from 'chartjs-plugin-zoom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  
} from 'chart.js';
import { Bar, getElementAtEvent } from 'react-chartjs-2';
//Chart.js background plugin
const backgroundPlugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, args, options) => {
    const {ctx} = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options.color || '#99ffff';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};
//Chart.js contextMenu plugin
const contextMenuPlugin = {
  id: 'contextMenu',
  afterInit: (chart, arg, options) => {
    var menu = document.getElementById("contextMenu");
    chart.canvas.addEventListener('contextmenu', handleContextMenu, false);
    chart.canvas.addEventListener('mousedown', handleMouseDown, false);
    var dlg = document.getElementById('dlg');
    function handleContextMenu(e){
      // const element = getElementAtEvent(chart, e);
      // const xClick = chart.scales.x.getValueForPixel(e.offsetX);
      // const element = chart.getDatasetMeta(0).data[xClick]
      // console.log(element);
      e.preventDefault();
      e.stopPropagation();
      menu.style.left = e.clientX + "px";
      menu.style.top = e.clientY + "px";
      dlg.style.left = `${e.layerX}px`;
      dlg.style.top = `${e.layerY}px`;      
      menu.style.display = "block";
      return(false);
    }

    function handleMouseDown(e){
      menu.style.display = "none";
    }    
  }
}
// const mouseOutPlugin = {
//   id: 'outCapture',
//   beforeEvent: (chart, args, pluginOptions) => {
//     const event = args.event;
//     if (event.type == 'mouseout')
//       chart.options.hover.mode = null;
//   }
// }
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  Tooltip,
  Title,
  zoomPlugin,
  backgroundPlugin,
  contextMenuPlugin
);

function RMSGraph(props){
  const {title, showDepthAxisLabel, depthRange, showNRMSAxisLabel, nrmsRange, width, height, barColors, backgroundColor, inputData, axisDirection, grid, NRMSAxisLabel, depthAxisLabel, showTitle} = props;
  const [bgColor, setbgColor] = useState(backgroundColor);
//   const [t, setT] = useState(title);
  const [menuLabel, setMenuLabel] = useState({
    ignoreLabel: 'Set Ignore',
    normalizeLabel: 'Set Normalize'
  })
  const [currentItem, setCurrentItem] = useState(null);
  
  const menuRef = useRef();
  const dlgRef = useRef();
  const chartRef = useRef();
  const [seriesData, setSeriesData] = useState(inputData)
  const [selection, setSelection] = useState([]);
  //Generate Chart Data from given props
  const getData = () => {
    return {
      datasets: [{
        data: 
        inputData.depth.map((x, index) => {
            if (axisDirection.toUpperCase() === 'HORIZONTAL')
              return {
                x: x,
                y: inputData.rms[index] / inputData.normRMS
              };
            else
              return {
                y: x,
                x: inputData.rms[index] / inputData.normRMS
              };
          })
        ,
        backgroundColor: inputData.color_type.map((x, index) => {
          
          const res = selection.includes(index) ? barColors[3] : barColors[x];
          return res;
        }),
        hoverBackgroundColor: barColors[3]
      }]
    };
  }

  //Change Chart background handler
  const changeBackgroundHandler = (e, fields) => {
    chartRef.current.onClick=null;
    setbgColor('#f0f0f0');
    // console.log(e);
    // console.log(getElementAtEvent(chartRef.current, e));
    if (e.native.ctrlKey && fields.length > 0){
      // const aa = ;
      // console.log(aa);
      const curIndex = fields[0].index;
      // chartRef.current.config.data.datasets[0].backgroundColor[fields[0].index] = barColors[3];
      var newSelection = selection;
      if (newSelection.includes(curIndex)){
        newSelection.splice(newSelection.indexOf(curIndex));
        chartRef.current.config.data.datasets[0].backgroundColor[curIndex] = barColors[seriesData.color_type[curIndex]];
      }else{
        newSelection.push(curIndex);
        chartRef.current.config.data.datasets[0].backgroundColor[curIndex] = barColors[3];
      }
      // setSeriesData(newState);
      // console.log(newSelection);
      setSelection(newSelection);


      // chartRef.current.setActiveElements({datasetIndex: 0, index: index})
      // console.log('ctrl pressed');
      // setSelection((s) => {
      //   console.log(s);
      //   if (s.includes(index))
      //     return s.slice(s.indexOf(index), 1);
      //   else
      //     return s.push(index);
      // });
      
      chartRef.current.update();
    }else {
      menuRef.current.style.display='none';
      dlgRef.current.style.display='none';
      console.log('Background Color Change Handler');  
    }
  }

  //Chart Hover handler
  const hoverHandler = (e, fields) => {
    if (fields.length > 0 && dlgRef.current.style.display == 'none'){
      const index = fields[0].index;
      setCurrentItem(index);
      var labels = {ignoreLabel: '', normalizeLabel: ''};
      if (selection.length > 0){
        var ignoreFlag = false;
        selection.every(v => {
          if (seriesData.color_type[v] != 2){
            ignoreFlag = true;
            return true;
          }
          return false;
        });
        if (ignoreFlag === true)
          labels.ignoreLabel = 'Ignore Site';
        else
          labels.ignoreLabel = 'Restore Site';
      }else {
        if (seriesData.color_type[index] === 0){
          labels.ignoreLabel = 'Ignore Site';
          labels.normalizeLabel = 'Set As normalization Site';
        }else if (seriesData.color_type[index] === 2 ){
          labels.ignoreLabel = 'Restore Site';
          labels.normalizeLabel = 'Set As normalization Site';
        } else if (seriesData.color_type[index] === 1){
          labels.ignoreLabel = 'Ignore Site';
          labels.normalizeLabel = 'Remove from Normalization Site';
        }
      }
      // dlgRef.current.style.left = `${e.x}px`;
      // dlgRef.current.style.top = `${e.y}px`;
      setMenuLabel(labels);
    }
  }
  //Generate Chart Option(title, axis, etc)
  const getOption = () => {
    console.log(axisDirection);
    return {
      onClick: changeBackgroundHandler,
      onHover: hoverHandler,
      responsive: true,
      interaction: {
        mode: 'nearest',
        // axis: axisDirection.toUpperCase() === 'HORIZONTAL' ? 'x' : 'y',
        axis: axisDirection.toUpperCase() == 'HORIZONTAL' ? 'x' : 'y',
        intersect: false
      },
      maintainAspectRatio: false,
      events: ['click', 'mousemove', 'mouseout'],
      indexAxis: axisDirection.toUpperCase() == 'HORIZONTAL' ? 'x' : 'y',
      parsing: {
        xAxisKey: 'x',
        yAxisKey: 'y'
      },
      plugins: {
        colors: {
          forceOverride: true,
          enabled: true
        },
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
              modifierKey: 'alt',
            },
            pinch: {
              enabled: true
              
            },
            mode: 'xy'
          }
        },
        legend: {
          display: false
        },
        
        customCanvasBackgroundColor: {
          color: bgColor
        },
        title: {
          display: showTitle,
          text: title
        },
        tooltip: {
          callbacks: {
            beforeBody: (items) => {
              return [`Depth: ${seriesData.depth[items[0].dataIndex]}`, `NRMS: ${seriesData.rms[items[0].dataIndex]}`]
            },
            title: () => '',
            label: () => ''
          }
        }
      },
      scales: {
        x: {
          type: 'linear',
          grid: {
            display: grid === 'ON'
          },
          title: {
            color: 'red',
            display: axisDirection.toUpperCase() === 'HORIZONTAL' ?showDepthAxisLabel : showNRMSAxisLabel,
            text: axisDirection.toUpperCase() === 'HORIZONTAL' ? depthAxisLabel : NRMSAxisLabel
          },
          min: axisDirection.toUpperCase() === 'HORIZONTAL' ? depthRange[0] : nrmsRange[0],
          max: axisDirection.toUpperCase() === 'HORIZONTAL' ? depthRange[1] : nrmsRange[1],
        },
        y: {
          type: 'linear',
          grid: {
            display: grid === 'ON'
          },
          title: {
            color: 'red',
            display: axisDirection.toUpperCase() === 'HORIZONTAL' ? showNRMSAxisLabel : showDepthAxisLabel,
            text: axisDirection.toUpperCase() === 'HORIZONTAL' ? NRMSAxisLabel: depthAxisLabel
          },        
          min: axisDirection.toUpperCase() === 'HORIZONTAL' ? nrmsRange[0] : depthRange[0],
          max: axisDirection.toUpperCase() === 'HORIZONTAL' ? nrmsRange[1] : depthRange[1]
        }
      }
    };
  }
  const chartData = useMemo(() => getData(), [inputData, barColors, backgroundColor, selection]);
  const chartOption = useMemo(() => getOption(), [seriesData, bgColor, title, showDepthAxisLabel, depthRange, showNRMSAxisLabel, nrmsRange, barColors, inputData, axisDirection, grid, NRMSAxisLabel, depthAxisLabel, barColors, backgroundColor, depthAxisLabel, NRMSAxisLabel, selection]);
  //SetIgnore Handler
  const setIgnore = (e) => {
    console.log('setIgnore', currentItem);
    var value = 2;
    var newState = seriesData;

    if (e.target.innerText == 'Ignore Site'){
      value = 2;
    }else {
      value = 0;
    }
    if (selection.length > 0){
      selection.forEach((item) => {
        newState.color_type[item] = value;
        chartRef.current.config.data.datasets[0].backgroundColor[item] = barColors[value];    
      })
    }else {
      newState.color_type[currentItem] = value;
      chartRef.current.config.data.datasets[0].backgroundColor[currentItem] = barColors[value];  
    }
    // }else {
    //   chartRef.current.config.data.datasets[0].backgroundColor[currentItem] = barColors[1];
    //   newState.color_type[currentItem] = 1;

    // }
    // if (selection.length > 0){
      
    // }
    
    // if (seriesData.color_type[currentItem] !== 2){
    //   newState.color_type[currentItem] = 2;
    //   chartRef.current.config.data.datasets[0].backgroundColor[currentItem] = barColors[2];
    // } else {
    //   chartRef.current.config.data.datasets[0].backgroundColor[currentItem] = barColors[1];
    //   newState.color_type[currentItem] = 1;
    // }
    setSeriesData(newState);
    setSelection([]);
    chartRef.current.update()
    menuRef.current.style.display = "none";
  }

  //SetNormalize Handler
  const setNormalize = () => {
    console.log('setNormalize');
    var newState = seriesData;
    if (seriesData.color_type[currentItem] !== 1){
      newState.color_type[currentItem] = 1;
      chartRef.current.config.data.datasets[0].backgroundColor[currentItem] = barColors[1];
    } else {
      chartRef.current.config.data.datasets[0].backgroundColor[currentItem] = barColors[0];
      newState.color_type[currentItem] = 0;
    }
    setSeriesData(newState);
    setSelection([]);
    chartRef.current.update()
    menuRef.current.style.display = "none";
  }

  //addMERNote Handler
  const addMERNote = () => {
    console.log('add MERNote');
    setSelection([]);
    menuRef.current.style.display = "none";
  }

  //selectMultipleSites Handler
  // const selectMultipleSites = () => {
  //   console.log('multiplesites');
  //   setSelection([]);
  //   menuRef.current.style.display = "none";
  // }

  //merSite Handler
  const merSite = () => {
    console.log('merSite');
    dlgRef.current.style.display = "block";
    menuRef.current.style.display = "none";
  }

  useEffect(() => {
    setbgColor(backgroundColor);
  }, [backgroundColor])
  useEffect(() => {
    setSeriesData(inputData)
  }, [inputData])
  useEffect(() => {
    var c = new Chart(chartRef.current.getContext('2d'), {
      type: 'bar',
      plugins: [{
        id: 'contextMenu',
        afterInit: (chart, arg, options) => {
          console.log('asdf')
          // var menu = document.getElementById("contextMenu");
          var menu=menuRef.current;
          chart.canvas.addEventListener('contextmenu', handleContextMenu, false);
          chart.canvas.addEventListener('mousedown', handleMouseDown, false);
          var dlg = dlgRef.current;
          function handleContextMenu(e){
            // const element = getElementAtEvent(chart, e);
            // const xClick = chart.scales.x.getValueForPixel(e.offsetX);
            // const element = chart.getDatasetMeta(0).data[xClick]
            // console.log(element);
            e.preventDefault();
            e.stopPropagation();
            menu.style.left = e.clientX + "px";
            menu.style.top = e.clientY + "px";
            dlg.style.left = `${e.layerX}px`;
            dlg.style.top = `${e.layerY}px`;      
            menu.style.display = "block";
            return(false);
          }
      
          function handleMouseDown(e){
            menu.style.display = "none";
          }    
        }
      }],
      options: getOption()
    })
  })
  return (
    <>
    <div style={{width: width, height: height}}>
    {/* <Bar options={chartOption} data={chartData} ref={chartRef}/> */}
    <canvas id={index} ref={chartRef} />
    </div>
    <ul id="contextMenu" style={{display:'none'}} ref={menuRef}>
      <li className="menu-item disabled" disabled>{inputData.depth[currentItem]}mm</li>
      <li className="menu-item" onClick={setIgnore}>{menuLabel.ignoreLabel}</li>
      <li className="menu-item" onClick={setNormalize}>{menuLabel.normalizeLabel}</li>
      <li className="menu-item" onClick={addMERNote}>Add MER Note</li>
      {/* <li className="menu-item" onClick={selectMultipleSites}>Select Multiple Sites</li> */}
      <li className="menu-item" onClick={merSite}>MER Site</li>
    </ul>
    <div ref={dlgRef} style={{position: 'absolute', background: 'gold', width: '100px', height: '30px', display: 'none'}} id="dlg">

    </div>
    </>
  )

}
export default RMSGraph;