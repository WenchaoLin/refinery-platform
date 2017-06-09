/**
 * Tool Select Service
 * @namespace toolSelectService
 * @desc Service tracks the selected tool, grabs the tool definition
 * list from service, and tracks if the panels are collapsed
 * @memberOf refineryApp.refineryToolLaunch
 */
(function () {
  'use strict';
  angular
    .module('refineryToolLaunch')
    .factory('toolSelectService', toolSelectService);

  toolSelectService.$inject = ['toolDefinitionsService'];

  function toolSelectService (toolDefinitionsService) {
    var selectedTool = {};
    var toolList = [];
    var isToolInfoCollapsed = true;
    var isToolPanelCollapsed = true;

    var service = {
      getTools: getTools,
      isToolInfoCollapsed: isToolInfoCollapsed,
      isToolPanelCollapsed: isToolPanelCollapsed,
      selectedTool: selectedTool,
      setSelectedTool: setSelectedTool,
      toolList: toolList
    };
    return service;

    /*
    *-----------------------
    * Method Definitions
    * ----------------------
    */
    function setSelectedTool (tool) {
      angular.copy(tool, selectedTool);
    }

    function getTools () {
      var toolDefs = toolDefinitionsService.query();
      toolDefs.$promise.then(function (response) {
        angular.copy(response, toolList);
      });
      return toolDefs.$promise;
    }
  }
})();
