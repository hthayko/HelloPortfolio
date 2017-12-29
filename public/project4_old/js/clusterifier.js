

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
			var groups = groupClusters(nodes, centroids);
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

		/*
		* returns k groups based on n nodes and k centroids
		* getNearestCentroid(nodes, nodes[i], centroids) returns 
		* the index of the nearest centroid
		* nodes[i].group should be the index of the group
		* groups[i] should be an array of node indices
		*/
		function groupClusters(nodes, centroids){
			var groups = [];

			// 1. petq e groups-um avelacnel centroids.length []
			// 2. for-ov gnal bolor gagatneri vrayov
			// 3. amen mi gagati hamar kanchel getNearestCentroid()
			// 4. hamapatasxan group-um avelacnel ed gagati indexy

			return groups;
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