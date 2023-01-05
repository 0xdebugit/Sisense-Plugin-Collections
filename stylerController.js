
mod.controller('stylerController', ['$scope',
    function ($scope) {

        /**
         * variables
         */


        /**
         * watches
         */
        $scope.$watch('widget', function (val) {
            $scope.model = $$get($scope, 'widget.style');
        });



        /**
         * public methods
		*/

		$scope.SetProjection = function (Value) {  
			$scope.model.Projection = Value;

            _.defer(function () {
                $scope.$root.widget.redraw();
            });
        };  

		$scope.SetAxisInterval = function (Axis,Value) {  
            if(Axis == 'x'){
                $scope.model.IntervalX = Value;
            }else{
                $scope.model.IntervalY = Value;
            }

            _.defer(function () {
                $scope.$root.widget.redraw();
            });
        };    

		$scope.SetBoxDepth = function (Value) {  
            $scope.model.BoxDepth = Value;

            _.defer(function () {
                $scope.$root.widget.redraw();
            });
        };     

		$scope.SetBoxWidth = function (Value) {  
            $scope.model.BoxWidth = Value;

            _.defer(function () {
                $scope.$root.widget.redraw();
            });
        };  

		$scope.SetChartDistance = function (Value) {  
            $scope.model.ChartDistance = Value;

            _.defer(function () {
                $scope.$root.widget.redraw();
            });
        };

		$scope.SetNumberFormat = function (Value) {  
            $scope.model.NumberFormat = Value;

            _.defer(function () {
                $scope.$root.widget.redraw();
            });
        };

		$scope.SetAutoRotate = function (Value) {  
            $scope.model.AutoRotate = Value;

            _.defer(function () {
                $scope.$root.widget.redraw();
            });
        }; 

		$scope.SetChartShadow = function (Value) {  
            $scope.model.ChartShadow = Value;

            _.defer(function () {
                $scope.$root.widget.redraw();
            });
        };                                                



		$scope.SetChartTooltip = function (Value) {  
			$scope.model.ChartTooltip = Value;
            _.defer(function () {
                $scope.$root.widget.redraw();
            });
        };       

		$scope.SetColorSeries = function (Value) {  
			$scope.model.ColorSeries = Value;
            _.defer(function () {
                $scope.$root.widget.redraw();
            });
        };       

		
		$scope.SetBackgroundColor = function (Value) {  
			$scope.model.BackgroundColor = Value;
            _.defer(function () {
                $scope.$root.widget.redraw();
            });
        };       
	}
]);