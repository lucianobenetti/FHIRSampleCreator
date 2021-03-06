angular.module("sampleApp").controller('vsFinderCtrl',
    function ($scope, Utilities, appConfigSvc,SaveDataToServer,GetDataFromServer,currentBinding) {


        $scope.input = {};

        var config = appConfigSvc.config();
        $scope.termServer = appConfigSvc.getCurrentTerminologyServer().url;//  config.servers.terminology;
        //$scope.valueSetRoot = config.servers.terminology + "ValueSet/";

        $scope.input.arStrength = ['extensible','preferred','example'];

        $scope.input.strength = currentBinding.strength;
        $scope.input.description = currentBinding.description;


        $scope.selectVSForDisplay = function(vs){
            $scope.input.vspreview=vs;
            delete $scope.expansion;
            delete $scope.input.filter;
            delete $scope.queryError;
        }

        $scope.select = function() {
            $scope.$close({vs: $scope.input.vspreview,strength:$scope.input.strength,description : $scope.input.description});
        };

        //find matching ValueSets based on name
        $scope.search = function(filter){
            $scope.showWaiting = true;
            delete $scope.message;
            delete $scope.searchResultBundle;
            
            var url = $scope.termServer+"ValueSet?name="+filter;
            $scope.showWaiting = true;
            GetDataFromServer.adHocFHIRQueryFollowingPaging(url).then(
            //GetDataFromServer.adHocFHIRQuery(url).then(
                function(data){
                    $scope.searchResultBundle = data.data;
                    if (! data.data || ! data.data.entry || data.data.entry.length == 0) {
                        $scope.message = 'No matching ValueSets found'
                    }
                },
                function(err){
                    alert(angular.toJson(err))
                }
            ).finally(function(){
                $scope.showWaiting = false;
            })
        };
        

        $scope.showExpansion = function(id,filter) {
            delete $scope.expansion;
            delete $scope.queryError;
            var qry = $scope.termServer+"ValueSet/"+id + "/$expand";
            if (filter) {
                qry = $scope.termServer+ "ValueSet/"+  id + "/$expand?filter="+filter;
            }

            $scope.query = qry;
            $scope.showWaiting = true;
            GetDataFromServer.adHocFHIRQuery(qry).then(
                function(data) {
                    console.log(data)
                    $scope.expansion = data.data.expansion;
                },
                function(err){
                    //alert(angular.toJson(err))

                    $scope.queryError = err.data;


                }
            ).finally(function(){
                $scope.showWaiting = false;
            });
        }


    }
);