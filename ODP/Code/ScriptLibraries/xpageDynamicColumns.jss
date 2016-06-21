function showColumn(columnName){
	var columns = viewScope.get("columnValues");
	if(columns != null) {
		for(var i = 0; i<columns.length;i++) {
			if(columns[i]==columnName){
				return true;
			}
		}
		return false;
	} else {
		return true;
	}
}