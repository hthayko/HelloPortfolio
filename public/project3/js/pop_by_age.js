$.getJSON("data/populations.json", function(jsonData){
	var colData = [];

  // TODO
  // populate colData
  for(var i = 0; i < jsonData.USA.length; ++i){
  	colData.push([jsonData.USA[i].age, jsonData.USA[i].value])
  }


	chart = c3.generate({
		bindto: "#population-chart",
		size: {
			height: 450
		},	
		data: {
			columns: colData,
			type : 'pie'
		}
	});	
});
