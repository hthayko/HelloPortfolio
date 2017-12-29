var geoHelper = {

	/*
	 * by default, realDist is false and safe distance is returned, e.g. far from 0
	 */
	getDist : function(s, t, realDist)
	{
		realDist = realDist || false;
		var ret = Math.sqrt((s.x - t.x)*(s.x - t.x) 
			+ (s.y - t.y)*(s.y - t.y) 
			+ (s.z - t.z)*(s.z - t.z));
		
		if (!realDist){
			var eps = 2*graph.nodeRadius;
			if(ret < eps) ret = eps;
		}
		return ret;
	},

	getNorm : function(v){
		var ret = 0;
		var i;
		for(i = 0; i < v.length; ++i){
			ret += v[i] * v[i];
		}
		return ret;
	},

	getNorm3D : function(x, y, z){
		return Math.sqrt(x*x + y*y + z*z);
	}

}