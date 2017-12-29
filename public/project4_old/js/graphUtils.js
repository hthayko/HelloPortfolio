var GraphUtils = GraphUtils || {} ;


/*
 * 
 * Assumes data is a json string and the json is a 
 * returns error object if format is wrong;
 */
GraphUtils.parseGraphData = function(data)
{
	// var gJson = JSON.parse(data);
	// if(gJson.constructor !== Array) return {success : false, errMsg : "wrong format of links list"};
	decrOne(data);
	var gJson = data.split(/\n+/);
	var graph = {nodes: [], links : []};
	var maxVertex = 0;
	gJson.forEach(function(str, index){
		var el = str.split(/\s+/);
		el[0] = parseInt(el[0]);
		el[1] = parseInt(el[1]);		
		var obj = {	source : el[0], target : el[1] };
		graph.links.push(obj);
		if(el[0] > maxVertex) maxVertex = el[0];
		if(el[1] > maxVertex) maxVertex = el[1];
	});
	if(maxVertex <= 0)	return {success : false, errMsg : "empty graph given"};
	
	for(var i = 0; i <= maxVertex; ++i)	graph.nodes.push({	name : i	});
	

	return {success : true, graph : graph};
}

// need to remove this useless guy
function decrOne(data)
{
	window.new_str = "";
	var gJson = data.split("\n");
	gJson.forEach(function(str, index){
		var el = str.split(" ");
		el[0] = parseInt(el[0]) - 1;
		el[1] = parseInt(el[1]) - 1;
		new_str += el[0] + " " + el[1] + "\n";
	});
}

function findMaxProperty(objArray, prop)
{
	var maxVal = -Infinity;
	var element;
	for(elIndex in objArray){
		element = objArray[elIndex];
		if(element.hasOwnProperty(prop) && element[prop] > maxVal){
			maxVal = element[prop];
		}
	}

	return maxVal;
}
