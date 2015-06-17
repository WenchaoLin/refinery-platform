/*! refinery-platform-ui 2015-06-16 */

angular.module("refineryStatistics",[]).controller("refineryStatisticsController",["$scope","$http",function(a,b){function c(a,b){var c=1.6,e=document.getElementById(b).offsetWidth,f=e/c,g=c3.generate({bindto:"#"+b,data:{x:"x",columns:[["x","public","private","private shared"],[" ",a["public"],a["private"],a.private_shared]],type:"bar"},bar:{width:{ratio:.5}},size:{width:e,height:f},axis:{x:{type:"category"},y:{tick:{format:d3.format("d")}}},legend:{show:!1}});d[b]={chart:g,data:a}}var d={};b.get("/api/v1/statistics/?format=json&dataset&workflow&project").success(function(b){a.users=b.objects[0].user,a.groups=b.objects[0].group,a.files=b.objects[0].files,a.data_sets=b.objects[0].dataset.total,a.workflows=b.objects[0].workflow.total,a.projects=b.objects[0].project.total;var d=b.objects[0].dataset,e=b.objects[0].workflow,f=b.objects[0].project;jQuery.isEmptyObject(d)||c(d,"dataSetChart"),jQuery.isEmptyObject(e)||c(e,"workflowChart"),jQuery.isEmptyObject(f)||c(f,"projectChart")}),window.onresize=function(a){for(var b in d)c(d[b].data,b)}}]).directive("statisticsData",function(){return{templateUrl:"/static/partials/statistics.tpls.html",restrict:"A"}});
//# sourceMappingURL=statistics.js.map