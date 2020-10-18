var casesByState;
var casesByMonth;


d3.csv("./data/casesByMonth.csv", load_casesByMonth);

function load_casesByMonth(error, dataset){
	casesByMonth = dataset;	
}

console.log(casesByState);
console.log(casesByMonth);

export { casesByState, casesByMonth };