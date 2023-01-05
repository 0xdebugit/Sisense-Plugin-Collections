// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Bar 3D - Type : Punch Card
// Version : 1.0.0
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


prism.registerWidget("bar3d", {
	name : "bar3d",
	family : "line",
	title : "3D Bar",
	iconSmall : "/plugins/Bar3D/resources/3dbar.png",
	styleEditorTemplate: "/plugins/Bar3D/styler.html",
	style: {
		ShowTooltip		: 'Off',
		ShowGridlines	: 'Show',
		BackgroundColor : 'Default',
		Projection		: 'Perspective',
		IntervalX		: '1',
		IntervalY		: '1',
		BoxDepth		: '150',
		BoxWidth		: '150',
		NumberFormat	: 'Percent',
		AutoRotate		: false,
		ChartDistance	: '300',
		ChartShadow		: false,
		ChartTooltip	: false,
		ColorSeries		: "#132114,#433525,#673566,#42678E,#4EB650,#5BBDBF,#6B69C7,#CF77CE,#D78786,#DCDE95,#433525,#673566,#42678E,#80BC47,#364B42,#4D6A62,#668883,#7EA7A5,#27742D,#4B9837,#80BC47,#75F176,#88ECC2,#B7DEE4,#BDE4E7,#C3E9EA,#C9EDEB,#CFEFEC,#9BDCE8,#ABBBE6", //preloaded colorseries
	},
	data : {
		selection : [],
		defaultQueryResult : {},	
		panels : [
			{
				name: 'X-Axis',
				type: "visible",
				metadata: {
					types: ['dimensions','measures'],
					maxitems: 1,
					sortable: {
						maxitems: 1
					}
				},
				itemAdded: function(widget, item) {
					if (item.jaql.datatype == 'datetime'){
						item["format"] = 
							{
									mask : 
								
										{
											minutes		: 'HH:mm',
											days		: 'shortDate',
											weeks		: 'ww yyyy',
											months 		: 'M/yyyy',
											quarters 	: 'Q yyyy',
											years		: 'yyyy'
										}
								}
					}
					else {
							item["format"] = 
							{
								mask : 
							
									{

										type: 'number',
										abbreviations: {
											t: true,
											b: true,
											m: true,
											k: true
										},
										separated: true,
										decimals: 'auto'
									}
							}
					}
					
				},
				visibility: true
			},
			{
				name: 'Y-Axis',
				type: "visible",
				metadata: {
					types: ['dimensions','measures'],
					maxitems: 1,
					sortable: {
						maxitems: 1
					}
				},
				itemAdded: function(widget, item) {
					if (item.jaql.datatype == 'datetime'){
						item["format"] = 
							{
									mask : 
								
										{
											minutes		: 'HH:mm',
											days		: 'shortDate',
											weeks		: 'ww yyyy',
											months 		: 'M/yyyy',
											quarters 	: 'Q yyyy',
											years		: 'yyyy'
										}
								}
					}
					else {
							item["format"] = 
							{
								mask : 
							
									{

										type: 'number',
										abbreviations: {
											t: true,
											b: true,
											m: true,
											k: true
										},
										separated: true,
										decimals: 'auto'
									}
							}
					}
					
				},
				visibility: true
			},
			{
				name: 'Z-Axis',
				type: "visible",
				metadata: {
					types: ['dimensions','measures'],
					maxitems: 1,
					sortable: {
						maxitems: 1
					}
				},
				itemAdded: function(widget, item) {
					if (item.jaql.datatype == 'datetime'){
						item["format"] = 
							{
									mask : 
								
										{
											minutes		: 'HH:mm',
											days		: 'shortDate',
											weeks		: 'ww yyyy',
											months 		: 'M/yyyy',
											quarters 	: 'Q yyyy',
											years		: 'yyyy'
										}
								}
					}
					else {
							item["format"] = 
							{
								mask : 
							
									{

										type: 'number',
										abbreviations: {
											t: true,
											b: true,
											m: true,
											k: true
										},
										separated: true,
										decimals: 'auto'
									}
							}
					}
					
				},
				visibility: true
			},
			// Custom Input to show N-size in the 3D Bar chart
			{
				name: 'Size',
				type: "visible",
				itemAttributes: ["color"],
				allowedColoringTypes: function() {
					return  {
						color: true,
						condition: true,
						range: true
					};
				},
				metadata: {
					types: ['measures'],
					maxitems: 1
				},
				
				visibility: true
			},
			{
				name: 'filters',
				type: 'filters',
				metadata: {
					types: ['dimensions'],
					maxitems: -1
				}
			}
		
		],
		
		canColor: function (widget, panel, item) {
			console.log('canColor');
			return (panel.name === "Size") ;
			/*if (panel.name == "Size") {
				return true;
			}
			else {
				return false;
			}
			*/
			
		},

		
		
		buildQuery: function (widget) {
			console.log('buildQuery');
			var query = { 
					datasource: widget.datasource, 
					format: "json",
					isMaskedResult:true,
					metadata: [] 
				};

			// Push input parameters to JAQL object
			widget.metadata.panel("X-Axis").items.forEach(function (item) {
                query.metadata.push(item);
            });				
			
			widget.metadata.panel("Y-Axis").items.forEach(function (item) {
                query.metadata.push(item);
            });				
				
			widget.metadata.panel("Z-Axis").items.forEach(function (item) {
                query.metadata.push(item);
            });	
			
			
			widget.metadata.panel("Size").items.forEach(function (item) {
                query.metadata.push(item);
            });				
			
			// force a sort by 
			//if ($$get(query, 'metadata.3.jaql')) {
		//		query.metadata[3].jaql.sort = "asc";
		//	};

			// pushing filters
			widget.metadata.panel('filters').items.forEach(function (item) {
				item = $$.object.clone(item, true);
				item.panel = "scope";
				query.metadata.push(item);
			});
			
			
			return query;		
		},

		
		
		//Create widget  Data Object and populate all values 
		processResult : function (widget, queryResult) {	
			console.log('processResult');
			
			var 
				Data = []
				XAxis = {},
				YAxis = {},
				ZAxis = {},
				ZZAxis = [],
				NSize = [],
				Values = [],
				rangeArray = [],
				rangeIncrements = 0,
				minDataValue = 0,
				maxDataValue = 0,
				RangeMode = 'auto',
				minColor = '#FF0000',
				maxColor = '#008000',
				rangeMaxSegments = 8;
			
			// Create Categories list for X Axis
			if (typeof queryResult.columns()[0] != "undefined"){
				queryResult.columns()[0].forEach(function (item, i) {
					XAxis[item.text] = 0;
				});			
				XAxis = Object.keys(XAxis);
			}

			// Create Categories list for Y Axis
			if (typeof queryResult.columns()[1] != "undefined"){
				queryResult.columns()[1].forEach(function (item, i) {
					YAxis[item.text] = 0;
				});			
				YAxis = Object.keys(YAxis);
			};

			// Create Categories list for Z Axis
			if (typeof queryResult.columns()[2] != "undefined"){
				queryResult.columns()[2].forEach(function (item, i) {
					ZAxis[item.text] = 0;
				});			
				ZAxis = Object.keys(ZAxis);
			};

			

			// Create value list in order to calc min, max values
			if (typeof queryResult.columns()[3] != "undefined"){
				queryResult.columns()[3].forEach(function (item, i) {
					Values[i] = item.data;
				});	
				maxDataValue = Math.max.apply(Math, Values);
				minDataValue = Math.min.apply(Math, Values);
				
				rangeIncrements = (maxDataValue - minDataValue) / rangeMaxSegments;
			};
			// Associating all element to a size group
			
			for (var i = 0; i < rangeMaxSegments; i++){
				rangeArray [i] = minDataValue + i * rangeIncrements;
			};
			
			
			function findRangeIndex(range){
				for (var i = rangeArray.length-1; i >= 0 ; i--){
					if (range >= rangeArray[i]){
						return i
					}
				}
			};
			
			// Build the points for plotting
			queryResult.$$rows.forEach(function (item, i) {
				Data[i] = 
					{
						x		: item[0].text,
						y		: item[1].text, 
						z		: item[2].text,
						nsize	: (typeof item[3] != 'undefined') ? item[3].text : 0,
						xdata	: item[0].data,
						ydata	: item[1].data,
						size 	: (typeof item[3] != 'undefined') ? findRangeIndex(item[3].data) : null,
						color	: (typeof item[3] != 'undefined') ? item[3].color : widget.dashboard.style.palette()[0],
					}
				});

			var last_date = XAxis[XAxis.length - 1];
			var temp_data = []

			Data.forEach(function (d,i) {
				if(d.x == last_date){
					temp_data.push(d);
				}
			});

			var ans = temp_data.sort((a, b) => {
				return parseInt(a.z) - parseInt(b.z);
			});			

			YAxis = ans.map(i=> {return(i.y)});
				
			YAxis.forEach(function (yitem, i) {
    			XAxis.forEach(function (xitem,j) {    			    
    			    Data.forEach(function (dataitem, k) {
    			        if(yitem == dataitem.y && xitem == dataitem.x){
    			            ZZAxis.push(parseInt(dataitem.z) > 0 ? [i,j,parseInt(dataitem.z)] : [i,j,0])
    			        }
    			        
    			    });
    			});			    
			});

			// Create N Size
			if (typeof queryResult.columns()[3] != "undefined"){
    			XAxis.forEach(function (xitem,j) {
    			    Data.forEach(function (dataitem, k) {
    			        if(YAxis[0] == dataitem.y && xitem == dataitem.x){
    			           NSize.push(dataitem.nsize)
    			        }
    			        
    			    });
    			});				
			};			
				

			
			/*
			// determine the color mode and set min max colors accodingly 
			if (typeof widget.metadata.panel("Value") != "undefined"){
					//if (typeof widget.metadata.panel("Value").items[0] != "undefined"){
				RangeMode = widget.metadata.panel("Value").items[0].format.color.rangeMode;
			};
			
			
			if (typeof RangeMode!= "undefined"){
				switch (RangeMode){
					case 'auto':
						minColor = '#FF0000',
						maxColor = '#008000'
						break;

					default:
						minColor = widget.metadata.panel("Value").items[0].format.color.min;
						maxColor = widget.metadata.panel("Value").items[0].format.color.max;
					
						
					
					
					
				}
			}
			*/
			return {minColor,maxColor,maxDataValue,minDataValue,XAxis,YAxis, ZAxis, ZZAxis, NSize, Data};

		}
	},
	
	beforequery: function(widget, args){
		/*var	
			widgetPanels = [];
			
			
		widgetPanels.push(widget.metadata.panel("X-Axis").items[0]);
		widgetPanels.push(widget.metadata.panel("Y-Axis").items[0]);
		
		for (var j=0; j <= (widgetPanels.length - 1); j++){
			var nodeDim = widgetPanels[j];
			
			//	Look for any dashboard filters
			var dashboardFilters = prism.activeDashboard.filters.$$items;

			//	Loop through the metadata
			for (var i=args.query.metadata.length-1; i>0; i--){

				//	Does this item match the node's dimension AND is a dashboard filter?
				var isMatch = (args.query.metadata[i].panel == "scope") && (args.query.metadata[i].jaql.dim == nodeDim.jaql.dim),
					//isNotWidgetFilter = (args.query.metadata[i].filterType !== "widget"),
					isWidgetFilter = (args.query.metadata[i].filterType == "widget"),
					isDashboardFilter = $.grep(dashboardFilters, function(w){
						return (w.jaql.dim == args.query.metadata[i].jaql.dim) && (typeof w.jaql.filter.all == "undefined");
					}).length > 0;
				//if (isMatch && isNotWidgetFilter && isDashboardFilter) {
				if (isMatch) {
					
					//	Create a new copy of the filter object
					var matchFilter = $$.object.clone(args.query.metadata[i], true);

					//	Remove the panel attribute
					delete matchFilter.panel

					//	Include with the node's dimension metadata
					//nodeDim.jaql.in = {selected: matchFilter}
					if (isWidgetFilter && defined(matchFilter.jaql.filter)) {
						nodeDim.jaql.filter = matchFilter.jaql.filter;
					}

					//	Remove from the metadata
					args.query.metadata.splice(i,1);
				}
			}		
		}
		*/
	},		

	render : function (widget, event) {
		console.log('render');
		var element = $(event.element),
			svgHeight = $(element).height(),
			svgWidth = $(element).width();
			
		
		// element.empty();
		
		
		var MyDiv = element[0],
			ObjectID = widget.oid,
			ChartDivName = "3dBarChart-" + ObjectID;
			
		MyDiv.setAttribute("id",ChartDivName);
		MyDiv.setAttribute("style","width: 99%; height: 99%; margin: 0 auto");
		
		Display3DBarChart
			(
				widget,
				ChartDivName, 
				svgWidth, 
				svgHeight
			);
		
	},

    options: {
        dashboardFiltersMode: "slice",
        selector: false,
        title: false
    },
    sizing: {

        minHeight: 50, //header
        maxHeight: 2048,
        minWidth: 320,
        maxWidth: 2048,
        height: 200,
        defaultWidth: 512
    }

});