var GraphUtils = GraphUtils || {} ;



/*
 * 
 * Assumes data is a json string and the json is a sequence of edges, with third number being the thickness of the edge.
 * returns error object if format is wrong;
 */
GraphUtils.parseGraphData = function(data)
{
	// var gJson = JSON.parse(data);
	// if(gJson.constructor !== Array) return {success : false, errMsg : "wrong format of links list"};
	//	decrOne(data);
	
	var gJson = data.split(";");		/// separator between links and nodes
	var gJsonLinks = gJson[0].split(/\n+/);
	var graph = {nodes: [], links : []};
	var maxVertex = 0;
	var startIndex = 0;	// is different for different data sets
	gJsonLinks.forEach(function(str, index){
		if(str == "")	return;
		var el = str.split(/\s+/);
		el[0] = parseInt(el[0]) - startIndex;
		el[1] = parseInt(el[1]) - startIndex;
		var weight = parseInt(el[2]) || 1;
		var obj = {	source : el[0], target : el[1], value : weight };
		graph.links.push(obj);
		// if(el[0] > maxVertex) maxVertex = el[0];
		// if(el[1] > maxVertex) maxVertex = el[1];
	});

	var gJsonNodes = gJson[1].split(/\n+/);
	gJsonNodes.forEach(function(str, index){
		if(str == "")	return;
		var el = str.split(",");
		el[0] = parseInt(el[0]) - startIndex;
		el[1] = el[1].trim();
		graph.nodes[el[0]] = {	name : el[1]};
	})
	console.log(graph)

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
