

var clusterifier = {

	iterateTimeOutHandler : undefined,

	getRandColors : function(count){
		var ret = [];
		var i;
		for(i = 0; i < count; ++i){
			ret[i] = "0x"+((1<<24)*Math.random()|0).toString(16);
		};
		return ret;		
	},


	/*
	 * Kmeans++
	 */
	clusterify : function(nodes, clusterCount, interval, callback){
		if(clusterifier.iterateTimeOutHandler)	clearTimeout(clusterifier.iterateTimeOutHandler);
		var i;
		var cSize = Math.floor(nodes.length / clusterCount);
		var iterationCount = 100;
		var centroids = [];
		var groups = [];

		initialize();
		iterate();
		
		function initialize(){
			var i;
			centroids[0] = nodes[Math.floor(Math.random()*nodes.length)];
			var curBest, furthest;
			for(i = 1; i < clusterCount; ++i){
				furthest = getFurtestNode(nodes, centroids);
				centroids[i] = nodes[furthest];
			}
		}

		function iterate(){
			var eps = 0.5;
			var groups = groupClusters(nodes, centroids, true);
			var delta = refineCentroids(groups, nodes, centroids);
			console.log(delta);
			callback(groups);
			if(iterationCount > 0 && geoHelper.getNorm(delta) > eps){
				iterationCount--;
				clusterifier.iterateTimeOutHandler = setTimeout(iterate, interval);
			}
		}

		function refineCentroids(groups, nodes, centroids){
			var i, g, j, delta = [];
			for(i = 0; i < groups.length; ++i){
				var m = {};
				g = groups[i];
				m.x = m.y = m.z = 0;
				for(j = 0; j < g.length; ++j){
					m.x += nodes[g[j]].x;
					m.y += nodes[g[j]].y;
					m.z += nodes[g[j]].z;
				}

				if(g.length == 0){
					console.log("centroid deprived of its group !!!");
					m = centroids[i];
				} else {
					m.x /= g.length;
					m.y /= g.length;
					m.z /= g.length;					
				}				
				delta[i] = getDist(m, centroids[i]);
				centroids[i] = m;
			}
			return delta;
		}

		function groupClusters(nodes, centroids, equalize) {			
			var i, j;
			var groups = [];
			for(i = 0; i < centroids.length; ++i)	groups[i] = [];
			for(i = 0; i < nodes.length; ++i){
				nodes[i].group = getNearestCentroid(nodes, nodes[i], centroids);
				groups[nodes[i].group].push(i);
			}
			if(equalize){
				var clusterSizeUpperBound = Math.ceil(nodes.length / centroids.length)
				var groupsKeys = [];
				for(i = 0; i < groups.length; ++i)	groupsKeys[i] = i;
//				groupsKeys.sort(function(b, a){		return groups[a].length - groups[b].length});
				for(i = 0; i < groupsKeys.length; ++i){
					var gid = groupsKeys[i];
					if(groups[gid].length > clusterSizeUpperBound){
						distributeToOthers(gid);
					}
				}

				for(i = 0; i < groups.length; ++i){
					for(j = 0; j < groups[i].length; ++j){
						nodes[groups[i][j]].group = i;
					}
				}
			}
			return groups;


			function distributeToOthers(index){
				var g = groups[index];
				g.sort(function(a, b){	return getDist(nodes[a], centroids[index]) - getDist(nodes[b], centroids[index]);});
				var i, nearest, availableCentroids, nodeIndex;
				var toRemoveCount = g.length - clusterSizeUpperBound
				for(i = 0; i < toRemoveCount; ++i){
					nodeIndex = g.pop();
					nearest = getNearestCentroid(nodes, nodes[nodeIndex], centroids, clusterSizeUpperBound, groups);
					groups[nearest].push(nodeIndex);
				}
			}
		}

		function getFurtestNode(nodes, centroids){
			var furthestNodeIndex = 0;
			var furthestDist = 0;
			var j, nearest;
			for(j = 0; j < nodes.length; ++j){
				nearest = getNearestCentroid(nodes, nodes[j], centroids);
				if(getDist(centroids[nearest], nodes[j]) > furthestDist){
					furthestDist = getDist(centroids[nearest], nodes[j]);
					furthestNodeIndex = j;
				}
			}
			return furthestNodeIndex;
		}

		function getNearestCentroid(nodes, node, centroids, clusterSizeUpperBound, groups){
			var nearest = -1;
			var k;
			var isAvailable;
			for(k = 0; k < centroids.length; ++k){
				isAvailable = !clusterSizeUpperBound || (clusterSizeUpperBound && groups[k].length < clusterSizeUpperBound);
				if(isAvailable && (nearest == -1 || getDist(node, centroids[k]) < getDist(node, centroids[nearest]))){
					nearest = k;
				}
			}
			return nearest;
		}

		function getDist(a, b){
			return geoHelper.getDist(a, b, true);
		}
		
	}


}