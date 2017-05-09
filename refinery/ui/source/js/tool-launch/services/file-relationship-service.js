(function () {
  'use strict';
  angular
    .module('refineryToolLaunch')
    .service('fileRelationshipService', fileRelationshipService);

  fileRelationshipService.$inject = [
    '_',
    'fileBrowserFactory',
    'selectedNodesService',
    'toolLaunchService'
  ];

  function fileRelationshipService (
    _,
    fileBrowserFactory,
    selectedNodesService,
    toolLaunchService
  ) {
    var nodeService = selectedNodesService;
    var toolService = toolLaunchService;
    var vm = this;
    vm.attributesObj = {}; // displayName: internalName, ex Name:
    vm.currentGroup = []; // index for the group coordinates
    vm.currentTypes = []; // tracks whether depths are pair or list
    vm.groupCollection = {}; // contains groups with their selected row's info
    vm.hideNodePopover = false;
    vm.inputFileTypes = []; // maintains the required input types
    vm.nodeSelectCollection = {}; // contains rows and their group info
    vm.refreshFileMap = refreshFileMap;
    vm.removeGroupFromCollections = removeGroupFromCollections;
    vm.resetInputGroup = resetInputGroup;
    vm.resetToolRelated = resetToolRelated;
    vm.setGroupCollection = setGroupCollection;
    vm.setNodeSelectCollection = setNodeSelectCollection;
    /*
     *-----------------------
     * Method Definitions
     * ----------------------
     */
    // helper method: convert attributes name array to attributes name obj,
    // displayName: internalName
    function generateAttributeObj () {
      var attributeArr = fileBrowserFactory.assayAttributes;
      for (var i = 0; i < attributeArr.length; i++) {
        vm.attributesObj[attributeArr[i].display_name] = attributeArr[i].internal_name;
      }
    }

    /**
     * Parses the tool definition api response into usable data structure by
     * views. File_relationship is a self-reference nested structure.
     * ex: file_relationship: [{file_relationship: []}]
     */
    function refreshFileMap () {
      if (_.isEmpty(toolService.selectedTool.file_relationship)) {
        return;
      }
      var scaledCopy = toolService.selectedTool.file_relationship;
      // initialize groups and types
      while (scaledCopy.file_relationship.length > 0) {
        vm.currentGroup.push(0);
        vm.currentTypes.push(scaledCopy.value_type);
        scaledCopy = scaledCopy.file_relationship[0];
      }
      angular.copy(scaledCopy.input_files, vm.inputFileTypes);
      vm.currentTypes.push(scaledCopy.value_type);
      vm.currentGroup.push(0);
      generateAttributeObj();
    }


    // Main method to remove a group from the groupCollection and
    // nodeSelectCollections
    function removeGroupFromCollections () {
      angular.forEach(vm.groupCollection[vm.currentGroup], function (nodeArr, inputTypeUuid) {
        removeGroupFromNodeSelectCollection(nodeArr, inputTypeUuid);
      });
      // Delete groupID property from obj since it is empty
      delete vm.groupCollection[vm.currentGroup];
    }

    // Helper method which finds index of currentGroupId and slices it from
    // groupId and it's associated inputFileType
    function removeGroupFromNodeSelectCollection (nodeList, TypeUuid) {
      for (var i = 0; i < nodeList.length; i++) {
        var groupInd = vm.nodeSelectCollection[nodeList[i].uuid].inputTypeList.indexOf(TypeUuid);
        if (groupInd > -1) {
          vm.nodeSelectCollection[nodeList[i].uuid].groupList.splice(groupInd, 1);
          vm.nodeSelectCollection[nodeList[i].uuid].inputTypeList.splice(groupInd, 1);
        }
       // Delete node property from obj if empty
        if (vm.nodeSelectCollection[nodeList[i].uuid].groupList === 0) {
          delete vm.nodeSelectCollection[nodeList[i].uuid];
        }
      }
    }

    /**
     * Resets the variables needed for clearing cart completely
     */
    function resetInputGroup () {
      // resets group coordinates
      for (var i = 0; i < vm.currentGroup.length; i++) {
        vm.currentGroup[i] = 0;
      }
      vm.groupCollection = {};
      vm.nodeSelectCollection = {};
    }

    /**
     * Resets the variables needed for new tool selection
     */
    function resetToolRelated () {
      vm.currentGroup = [];
      vm.currentTypes = [];
      vm.groupCollection = {};
      vm.hideNodePopover = false;
      vm.inputFileTypes = [];
      vm.nodeSelectCollection = {};
    }

    /**
     * Generates obj with groups with input file types and their selected
     * node uuid
     * @param {string} inputTypeUuid - uuid of the input file type from tool
     * definitions api
     * @param {obj} selectionObj - ui-select model tracks checkboxes
     * @param {string} deselectedFileUuid - OPTIONAL, uuid of deselected node
     */
    function setGroupCollection (inputTypeUuid, selectionObj, deselectedFileUuid) {
      var nodeUuid = deselectedFileUuid;
      // Node isn't deselected, grab the active row's uuid.
      if (!nodeUuid) {
        nodeUuid = nodeService.activeNodeRow.uuid;
      }
      // checkbox selected
      if (selectionObj[vm.currentGroup][inputTypeUuid][nodeUuid]) {
        if (_.has(vm.groupCollection, vm.currentGroup) === false) {
          // intialize groupCollection[groupId]
          vm.groupCollection[vm.currentGroup] = {};
        }
        if (_.has(vm.groupCollection[vm.currentGroup], inputTypeUuid) === false) {
          // add inputTypes to groupCollectio[groupId]
          vm.groupCollection[vm.currentGroup][inputTypeUuid] = [];
        }
        vm.groupCollection[vm.currentGroup][inputTypeUuid].push(
          angular.copy(nodeService.activeNodeRow)
        );
      } else {
        // remove property when checkbox deselected
        for (var i = 0; i < vm.groupCollection[vm.currentGroup][inputTypeUuid].length; i++) {
          if (vm.groupCollection[vm.currentGroup][inputTypeUuid][i].uuid === nodeUuid) {
            vm.groupCollection[vm.currentGroup][inputTypeUuid].splice(i, 1);
            break;
          }
        }
      }
    }

    /**
     * Generates obj with node uuids and their associated input file
     * types and groups.
     * @param {string} inputTypeUuid - uuid of the input file type from tool
     * definitions api
     * @param {obj} selectionObj - ui-select model tracks checkboxes
     * @param {string} deselectedFileUuid - OPTIONAL, uuid of deselected node
     */
    function setNodeSelectCollection (inputTypeUuid, selectionObj, deselectedFileUuid) {
      // Node isn't deselected, grab the active row's uuid.
      var nodeUuid = deselectedFileUuid;
      if (!nodeUuid) {
        nodeUuid = nodeService.activeNodeRow.uuid;
      }
      // checkbox selected
      if (selectionObj[vm.currentGroup][inputTypeUuid][nodeUuid]) {
        if (_.has(vm.nodeSelectCollection, nodeUuid) === true) {
          vm.nodeSelectCollection[nodeUuid].inputTypeList.push(angular.copy(inputTypeUuid));
          vm.nodeSelectCollection[nodeUuid].groupList.push(angular.copy(vm.currentGroup));
        } else {
          // intialize nodeSelectionCollection
          vm.nodeSelectCollection[nodeUuid] = {
            inputTypeList: [inputTypeUuid],
            groupList: [angular.copy(vm.currentGroup)]
          };
        }
      } else {
        // remove property when checkbox deselected
        for (var i = 0; i < vm.nodeSelectCollection[nodeUuid].inputTypeList.length; i++) {
          if (_.isEqual(vm.nodeSelectCollection[nodeUuid].groupList[i], vm.currentGroup)) {
            vm.nodeSelectCollection[nodeUuid].groupList.splice(i, 1);
            vm.nodeSelectCollection[nodeUuid].inputTypeList.splice(i, 1);
            break;
          }
        }
      }
    }
  }
})();