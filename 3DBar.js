// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Bar 3D - Type : Punch Card
// Version : 1.0.0
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function Display3DBarChart (widget, ID, Width, Height){

	var ChartData = widget.queryResult;
	//title to be used if required on chart
    var 
        xaxisTitle = (typeof widget.metadata.panel("X-Axis").items[0] != 'undefined') ? widget.metadata.panel("X-Axis").items[0].jaql.title : '',
		yaxisTitle = (typeof widget.metadata.panel("Y-Axis").items[0] != 'undefined') ? widget.metadata.panel("Y-Axis").items[0].jaql.title : '',
		zaxisTitle = (typeof widget.metadata.panel("Z-Axis").items[0] != 'undefined') ? widget.metadata.panel("Z-Axis").items[0].jaql.title : '',
		sizeColors = (typeof widget.metadata.panel("Size").items[0] != 'undefined') ? widget.metadata.panel("Size").items[0].format.color : null,
		Projection = widget.style.Projection,
		NumberFormat = widget.style.NumberFormat,
		AutoRotate = widget.style.AutoRotate,
		ChartShadow = widget.style.ChartShadow,
		ChartTooltip = widget.style.ChartTooltip,
		ColorSeries = widget.style.ColorSeries,
		ChartDistance = parseInt(widget.style.ChartDistance),
		BoxWidth = parseInt(widget.style.BoxWidth),
		BoxDepth  = parseInt(widget.style.BoxDepth),
		IntervalX  = parseInt(widget.style.IntervalX),
		IntervalY  = parseInt(widget.style.IntervalY);

	var static_color = ['#132114','#433525','#673566','#42678E','#4EB650','#5BBDBF','#6B69C7','#CF77CE','#D78786','#DCDE95','#433525','#673566','#42678E','#80BC47','#364B42','#4D6A62','#668883','#7EA7A5','#27742D','#4B9837','#80BC47','#75F176','#88ECC2','#B7DEE4','#BDE4E7','#C3E9EA','#C9EDEB','#CFEFEC','#9BDCE8','#ABBBE6']
	var color_series = ColorSeries.split(',').length > 1 ? ColorSeries.split(',') : static_color;
	var chartDom = document.getElementById(ID);
    var option;
	window.myChart = echarts.init(chartDom);
	
	option = {
		tooltip: {
			show: ChartTooltip,
			formatter: function (param) {
				let ZValue = (NumberFormat == 'Percent' ? (param.value[2] + '%') : param.value[2]);
				let temp = 'Drug: '+ChartData.YAxis[param.value[1]]+'</br>Date: '+ChartData.XAxis[param.value[0]]+'</br>Value: '+ZValue; 
				return temp;
			},   
		},
		visualMap: {
			// max: 50,
			// inRange: {
			// 	color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
			// 	colorHue: [20, 360]
			// }
			show: true,
			max: 50,
			textGap: 1,
			color: null,			
		},
		xAxis3D: {
			name: '',
			type: 'category',
            axisLabel: {
                interval: IntervalX,
                margin: 10,
                formatter: function (param, i) {
					let enable_nsize = ChartData.NSize.length > 0 ? ('\nn = '+ChartData.NSize[i]) : '';
                    return param + enable_nsize;
                },             
            }, 			
			data: ChartData.XAxis
		},
		yAxis3D: {
			name: '',
			type: 'category',
			axisLabel: {
				interval: IntervalY,  				
				// margin: 20,
			},							
			data: ChartData.YAxis
		},
		zAxis3D: {
			name: '',
			type: 'value',
			axisPointer: {
				show: true,
				label:{
					show: true,
					formatter: function (param) {
						return NumberFormat == 'Percent' ? (Math.round(param) + '%') : Math.round(param);
					},                  
				}
			},			
			axisLabel: {
				margin: 13,
				formatter: function (param) {
					return Math.round(param) == 0 ? '' : (NumberFormat == 'Percent' ? (param + '%') : param);
				},            
			}			
		},
		grid3D: {
			boxWidth: BoxWidth,
			boxDepth: BoxDepth,
			viewControl: {
				projection: (Projection == 'Perspective') ? 'perspective' : 'orthographic',
				autoRotate: AutoRotate,
				distance: ChartDistance,
				orthographicSize : ChartDistance,
				animation: true,				
			},
			light: {
				main: {
					intensity: 1.2,
					shadow: ChartShadow,
				},
				ambient: {
					intensity: 0.3
				}
			}
		},
		series: [{
			type: 'bar3D',
			data: ChartData.ZZAxis.map(function (item) {
				return {
					value: [item[1], item[0], item[2]],
					itemStyle:{
						color: color_series[item[0]]
					}					
				}
			}),
			shading: 'lambert',

			label: {
				fontSize: 16,
				borderWidth: 1,
				normal: {
					position: 'inner',
					formatter: function (param) {
						return NumberFormat == 'Percent' ? (Math.round(param.value[2]) + '%') : Math.round(param.value[2]);
					},
					fontWeight: 'bold',
				}, 				
			},

			emphasis: {
				label: {
					fontSize: 20,
					color: '#900'
				},
				itemStyle: {
					color: '#900'
				}
			}
		}]
	}

	option && window.myChart.setOption(option);	
}