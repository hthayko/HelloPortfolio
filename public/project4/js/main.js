var camera, scene, light, renderer, container;
var meshs = [];
var grounds = [];
var isMobile = false;
var antialias = true;
var graph;
var stats;

var geos = {};
var mats = {};

//oimo var
var world = null;
var bodys = [];

var fps = [0,0,0,0];
var ToRad = Math.PI / 180;
var type=1;
var infos;

init(generateGraph(10, 20, 2));
loop();

$("#controls .control-slider input").on("change", function(ev){
	$input = $(ev.currentTarget);
	graph[$input.attr("data-to-change") + "Coef"] = parseInt($input.val());
	$input.next().html($input.val());
});

$("#controls .styled-file-input #graph-loader-fake").on("click", function(){	$(this).prev().click()});
$("#graph-loader").on("change", loadGraphFromFile);
$("#clusterifier").on("click", startClustering);

$("#graph-generator").on("click", function(ev){
	var maxVertexCount = 20000;
	var vertexCount = $("#nodesCount").val();
	if(vertexCount < 0) vertexCount = 10;
	if(vertexCount > maxVertexCount) vertexCount = maxVertexCount;

//		var maxEdgesCount = Math.min(20000, vertexCount * vertexCount / 2);
	var maxEdgesCount = 20000;
	var edgesCount = $("#edgesCount").val();
	if(edgesCount < 0) edgesCount = 10;
	if(edgesCount > maxEdgesCount) edgesCount = maxEdgesCount;

	var maxClustersCount = vertexCount;
	var clustersCount = $("#clustersCount").val();
	if(clustersCount <= 0) clustersCount = 1;
	if(clustersCount > clustersCount) clustersCount = maxClustersCount;

	var generatedGraph = generateGraph(vertexCount, edgesCount, clustersCount);		
	$("#clustersCount").val(clustersCount);
	$("#nodesCount").val(vertexCount);
	$("#edgesCount").val(edgesCount);
	initGraphPhysics(generatedGraph);
});

/*
 * uses getSmartGraph() to construct graph with given params
 */
function generateGraph(vertexCount, edgesCount, clustersCount)
{
	var param = [];
	for(var i = 0; i < clustersCount; ++i)
	{
		param.push({ vertexCount : vertexCount / clustersCount, edgeProb : edgesCount / clustersCount});
	}

	var clusterEdgeProb = 4 * param[0].edgesCount / param[0].vertexCount * param[0].vertexCount;

	return getSmartGraph(param,  2 / clustersCount );
}

function loadGraphFromFile()
{
	var input = $("#graph-loader")[0];
	if(!input.files || !input.files[0])
		return;		
	var reader = new FileReader();
	reader.onload = onReaderLoad;		
	reader.readAsText(input.files[0]);

	function onReaderLoad(ev)
	{
		$(input).val("");
		var data = ev.target.result;
		var result = GraphUtils.parseGraphData(data);
		if(!result.success)
		{
			console.log(result.errMsg);
			return;
		}
		initGraphPhysics(result.graph);			
	}
}

function startClustering(){
	clusterifyInterval = 400;
	graph.paused = true;
	// hideLinks();
	var filteredNodes = graph.vertices
	// var clustersCount = Math.ceil(filteredNodes.length / clusterSize);
	var clustersCount = parseInt($("#cluster-size").val());;
	var colors = clusterifier.getRandColors(clustersCount);
	clusterifier.clusterify(graph.vertices, clustersCount, clusterifyInterval, function(groups){
//		uncluster(graph.vertices, groups);
		var teams = getClusters(graph.vertices, groups);
		// clipboardPopup.setValue(teams);
		colorGraph(colors);
	});
}

function getClusters(nodes, groups){
	var ret = [];
	var i;
	for(i = 0; i < nodes.length; ++i){
		ret[nodes[i].group] = ret[nodes[i].group] || [];
		ret[nodes[i].group].push(nodes[i].name);
	}
	return ret;

}