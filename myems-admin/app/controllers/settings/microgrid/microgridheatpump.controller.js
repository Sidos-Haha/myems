'use strict';

app.controller('MicrogridHeatpumpController', function(
	$scope,
	$rootScope,
	$window,
	$translate,
	$uibModal,
	MicrogridService,
	MicrogridHeatpumpService,
	PointService,
	MeterService,
	toaster,
	SweetAlert) {
      $scope.microgrids = [];
      $scope.microgridheatpumps = [];
	  $scope.points = [];
	  $scope.meters = [];
      $scope.currentMicrogrid = null;
	  $scope.cur_user = JSON.parse($window.localStorage.getItem("myems_admin_ui_current_user"));
      $scope.getAllMicrogrids = function() {
		let headers = { "User-UUID": $scope.cur_user.uuid, "Token": $scope.cur_user.token };
  		MicrogridService.getAllMicrogrids(headers, function (response) {
  			if (angular.isDefined(response.status) && response.status === 200) {
  				$scope.microgrids = response.data;
  			} else {
  				$scope.microgrids = [];
  			}
  		});
  	};

	$scope.getAllPoints = function() {
		let headers = { "User-UUID": $scope.cur_user.uuid, "Token": $scope.cur_user.token };
		PointService.getAllPoints(headers, function (response) {
			if (angular.isDefined(response.status) && response.status === 200) {
				$scope.points = response.data;
			} else {
				$scope.points = [];
			}
		});
	};

	$scope.getAllMeters = function() {
		let headers = { "User-UUID": $scope.cur_user.uuid, "Token": $scope.cur_user.token };
		MeterService.getAllMeters(headers, function (response) {
			if (angular.isDefined(response.status) && response.status === 200) {
				$scope.meters = response.data;
			} else {
				$scope.meters = [];
			}
		});
	};
  	$scope.getMicrogridHeatpumpsByMicrogridID = function(id) {
		let headers = { "User-UUID": $scope.cur_user.uuid, "Token": $scope.cur_user.token };
  		MicrogridHeatpumpService.getMicrogridHeatpumpsByMicrogridID(id, headers, function (response) {
			if (angular.isDefined(response.status) && response.status === 200) {
				$scope.microgridheatpumps = response.data;
			} else {
          	$scope.microgridheatpumps=[];
        }
			});
  	};

  	$scope.changeMicrogrid=function(item,model){
    	$scope.currentMicrogrid=item;
    	$scope.currentMicrogrid.selected=model;
        $scope.is_show_add_microgrid_heatpump = true;
    	$scope.getMicrogridHeatpumpsByMicrogridID($scope.currentMicrogrid.id);
  	};

  	$scope.addMicrogridHeatpump = function() {

  		var modalInstance = $uibModal.open({
  			templateUrl: 'views/settings/microgrid/microgridheatpump.model.html',
  			controller: 'ModalAddMicrogridHeatpumpCtrl',
  			windowClass: "animated fadeIn",
  			resolve: {
  				params: function() {
  					return {
						meters: angular.copy($scope.meters),
						points: angular.copy($scope.points),
  					};
  				}
  			}
  		});
  		modalInstance.result.then(function(microgridheatpump) {
       		microgridheatpump.microgrid_id = $scope.currentMicrogrid.id;
			microgridheatpump.power_point_id = microgridheatpump.power_point.id;
			microgridheatpump.electricity_meter_id = microgridheatpump.electricity_meter.id;
			microgridheatpump.heat_meter_id = microgridheatpump.heat_meter.id;
			microgridheatpump.cooling_meter_id = microgridheatpump.cooling_meter.id;
			let headers = { "User-UUID": $scope.cur_user.uuid, "Token": $scope.cur_user.token };
  			MicrogridHeatpumpService.addMicrogridHeatpump(microgridheatpump, headers, function (response) {
  				if (angular.isDefined(response.status) && response.status === 201) {
  					toaster.pop({
  						type: "success",
  						title: $translate.instant("TOASTER.SUCCESS_TITLE"),
  						body: $translate.instant("TOASTER.SUCCESS_ADD_BODY", {template: $translate.instant("MICROGRID.MICROGRID_HEATPUMP")}),
  						showCloseButton: true,
  					});
  					$scope.getMicrogridHeatpumpsByMicrogridID($scope.currentMicrogrid.id);
            		$scope.$emit('handleEmitMicrogridHeatpumpChanged');
  				} else {
  					toaster.pop({
  						type: "error",
  						title: $translate.instant("TOASTER.ERROR_ADD_BODY", {template: $translate.instant("MICROGRID.MICROGRID_HEATPUMP")}),
  						body: $translate.instant(response.data.description),
  						showCloseButton: true,
  					});
  				}
  			});
  		}, function() {

  		});
		$rootScope.modalInstance = modalInstance;
  	};

  	$scope.editMicrogridHeatpump = function(microgridheatpump) {
  		var modalInstance = $uibModal.open({
  			templateUrl: 'views/settings/microgrid/microgridheatpump.model.html',
  			controller: 'ModalEditMicrogridHeatpumpCtrl',
    		windowClass: "animated fadeIn",
  			resolve: {
  				params: function() {
  					return {
  						microgridheatpump: angular.copy(microgridheatpump),
						meters: angular.copy($scope.meters),
						points: angular.copy($scope.points),
  					};
  				}
  			}
  		});

  		modalInstance.result.then(function(modifiedMicrogridHeatpump) {
        	modifiedMicrogridHeatpump.microgrid_id = $scope.currentMicrogrid.id;
			modifiedMicrogridHeatpump.power_point_id = modifiedMicrogridHeatpump.power_point.id;
			modifiedMicrogridHeatpump.electricity_meter_id = modifiedMicrogridHeatpump.electricity_meter.id;
			modifiedMicrogridHeatpump.heat_meter_id = modifiedMicrogridHeatpump.heat_meter.id;
			modifiedMicrogridHeatpump.cooling_meter_id = modifiedMicrogridHeatpump.cooling_meter.id;
			let headers = { "User-UUID": $scope.cur_user.uuid, "Token": $scope.cur_user.token };
  			MicrogridHeatpumpService.editMicrogridHeatpump(modifiedMicrogridHeatpump, headers, function (response) {
  				if (angular.isDefined(response.status) && response.status === 200) {
  					toaster.pop({
  						type: "success",
  						title: $translate.instant("TOASTER.SUCCESS_TITLE"),
  						body: $translate.instant("TOASTER.SUCCESS_UPDATE_BODY", {template: $translate.instant("MICROGRID.MICROGRID_HEATPUMP")}),
  						showCloseButton: true,
  					});
  					$scope.getMicrogridHeatpumpsByMicrogridID($scope.currentMicrogrid.id);
            		$scope.$emit('handleEmitMicrogridHeatpumpChanged');
  				} else {
  					toaster.pop({
  						type: "error",
  						title: $translate.instant("TOASTER.ERROR_UPDATE_BODY", {template: $translate.instant("MICROGRID.MICROGRID_HEATPUMP")}),
  						body: $translate.instant(response.data.description),
  						showCloseButton: true,
  					});
  				}
  			});
  		}, function() {
  			//do nothing;
  		});
		$rootScope.modalInstance = modalInstance;
  	};

  	$scope.deleteMicrogridHeatpump = function(microgridheatpump) {
  		SweetAlert.swal({
  				title: $translate.instant("SWEET.TITLE"),
  				text: $translate.instant("SWEET.TEXT"),
  				type: "warning",
  				showCancelButton: true,
  				confirmButtonColor: "#DD6B55",
  				confirmButtonText: $translate.instant("SWEET.CONFIRM_BUTTON_TEXT"),
  				cancelButtonText: $translate.instant("SWEET.CANCEL_BUTTON_TEXT"),
  				closeOnConfirm: true,
  				closeOnCancel: true
  			},
  			function(isConfirm) {
  				if (isConfirm) {
					let headers = { "User-UUID": $scope.cur_user.uuid, "Token": $scope.cur_user.token };
  					MicrogridHeatpumpService.deleteMicrogridHeatpump(microgridheatpump.id, headers, function (response) {
  						if (angular.isDefined(response.status) && response.status === 204) {
							toaster.pop({
								type: "success",
								title: $translate.instant("TOASTER.SUCCESS_TITLE"),
								body: $translate.instant("TOASTER.SUCCESS_DELETE_BODY", {template: $translate.instant("MICROGRID.MICROGRID_HEATPUMP")}),
								showCloseButton: true,
							});
							$scope.getMicrogridHeatpumpsByMicrogridID($scope.currentMicrogrid.id);
							$scope.$emit('handleEmitMicrogridHeatpumpChanged');
  						} else {
							toaster.pop({
								type: "error",
								title: $translate.instant("TOASTER.ERROR_DELETE_BODY", {template: $translate.instant("MICROGRID.MICROGRID_HEATPUMP")}),
								body: $translate.instant(response.data.description),
								showCloseButton: true,
							});
  				   		}
  					});
  				}
  			});
  	};

  	$scope.getAllMicrogrids();
	$scope.getAllPoints();
	$scope.getAllMeters();
    $scope.$on('handleBroadcastMicrogridChanged', function(event) {
      $scope.getAllMicrogrids();
  	});

  });


  app.controller('ModalAddMicrogridHeatpumpCtrl', function($scope, $uibModalInstance, params) {

  	$scope.operation = "MICROGRID.ADD_MICROGRID_HEATPUMP";
	$scope.points=params.points;
	$scope.meters=params.meters;
  	$scope.ok = function() {
  		$uibModalInstance.close($scope.microgridheatpump);
  	};

  	$scope.cancel = function() {
  		$uibModalInstance.dismiss('cancel');
  	};
  });

  app.controller('ModalEditMicrogridHeatpumpCtrl', function($scope, $uibModalInstance, params) {
  	$scope.operation = "MICROGRID.EDIT_MICROGRID_HEATPUMP";
  	$scope.microgridheatpump = params.microgridheatpump;
	$scope.points=params.points;
	$scope.meters=params.meters;
  	$scope.ok = function() {
  		$uibModalInstance.close($scope.microgridheatpump);
  	};

  	$scope.cancel = function() {
  		$uibModalInstance.dismiss('cancel');
  	};
  });
