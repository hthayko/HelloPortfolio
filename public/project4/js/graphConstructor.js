
function getRandGraph(vertexCount, edgeCount, groupName)
{
	groupName = groupName || 1;
	var g = {nodes : [], links:[]};
	for(var i = 0; i < vertexCount; ++i)
	{
		g.nodes.push({name : i, group : groupName});
	}
	for(var i = 0; i < edgeCount; ++i)
	{
		var s = getRand(0, vertexCount -1);
		g.links.push({source : s, target : getRand(0, vertexCount-1, s), value : getRand(1, 1)});
	}	

	return g;	
}

function getRand(start, end, notEq)
{
	notEq = notEq || -1;
	var ret = notEq;
	while(ret == notEq)
	{
		ret = Math.floor(Math.random()*(end - start + 1)) + start; 
	}
	return ret;
}

/*
 *
 *	Usage:
 *	getSmartGraph([
 *		{vertexCount : 100, edgeProb : 0.1 (or 1000 - number of edges)}, 
 *  	{vertexCount : 80, edgeProb : 0.01}
 *	], 
 *	0.5);
 */
function getSmartGraph(clusters, globalEdgeProb)
{
	var c, edges, currentVC;
	var smartGraph = {nodes : [], links : []};
	for(var i = 0; i < clusters.length; ++i)
	{
		c = clusters[i].vertexCount;
		
		if(clusters[i].edgeProb < 1 && clusters[i].edgeProb > 0)  clusters[i].edgeCount = clusters[i].vertexCount * (clusters[i].vertexCount - 1) / 2 * clusters[i].edgeProb;
		else clusters[i].edgeCount = clusters[i].edgeProb;
		
		clusters[i].graph = getRandGraph(clusters[i].vertexCount, clusters[i].edgeCount, i+1);
		currentVC = smartGraph.nodes.length;
		clusters[i].vertexStartNumber = currentVC;
		clusters[i].vertexEndNumber = currentVC + clusters[i].vertexCount - 1;
		smartGraph.nodes = smartGraph.nodes.concat(clusters[i].graph.nodes);
		edges = clusters[i].graph.links;		
		for(var j = 0; j < edges.length; ++j)
		{			
			smartGraph.links.push({ source : edges[j].source + currentVC, 
									target : edges[j].target + currentVC,
									value : edges[j].value});
		}
	}
	var globalEdgeCount = globalEdgeProb * clusters.length * (clusters.length - 1) / 2;
	var globalGraph = getRandGraph(clusters.length, globalEdgeCount);
	attachEdgesCount(globalGraph);
	var innerLinks1, innerLinks2, outerLinks1, outerLinks2, linksBetween, v1, v2;
	for(i = 0; i < globalGraph.links.length; ++i)
	{
		v1 = globalGraph.links[i].source;
		v2 = globalGraph.links[i].target;


		innerLinks1 = clusters[v1].edgeCount;
		innerLinks2 = clusters[v2].edgeCount;
		outerLinks1 = globalGraph.nodes[v1].edgeCount || 1;
		outerLinks2 = globalGraph.nodes[v2].edgeCount || 1;

		linksBetween = Math.ceil(Math.min(innerLinks1 / (8*outerLinks1), innerLinks2 / (8*outerLinks2)));

		for(j = 0; j < linksBetween; ++j)
		{
			smartGraph.links.push({ source : getRand(clusters[v1].vertexStartNumber, clusters[v1].vertexEndNumber),
									target : getRand(clusters[v2].vertexStartNumber, clusters[v2].vertexEndNumber),
									value : globalGraph.links[i].value});
		}
	}
	return smartGraph;
}

function attachEdgesCount(graph)
{
	for(var i = 0; i < graph.links.length; ++i)
	{
		graph.nodes[graph.links[i].source].edgeCount = graph.nodes[graph.links[i].source].edgeCount || 0;
		graph.nodes[graph.links[i].source].edgeCount++;
		graph.nodes[graph.links[i].target].edgeCount = graph.nodes[graph.links[i].target].edgeCount || 0;
		graph.nodes[graph.links[i].target].edgeCount++;
	}
}

function attachGroups(graph, groups)
{
	var g = groups.split("\n");
	for(var i = 0; i < graph.nodes.length; ++i)
	{
		graph.nodes[i].group = g[i];
	}
}