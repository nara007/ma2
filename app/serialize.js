
//var Obstacle = { 
//		attrs:{ id:"", obstacleType:"", distance:"", direction:"", category:""},
//		Size: { attrs:{ height:"", width:"", depth:""}},
//		CentralPosition: { attrs:{ x:"", y:"", z:""}}
//	};

//var Frame = {
//	attrs: { id:"id", timestamp:"", mode:"", cameraHeight:"", muteState:"bool"},
//	Orientation: { attrs: { yaw:"", roll:"", pitch:""}},
//	Saturation: { attrs: { rate:"", area:""}},
//	Obstacles: []
//};

//var Layout = {
//		SceneAnalyzerOutput:{
//					attrs:{xmlns:"namespace", xsi:"xsi"},
//					AnalyzedFrames:[]
//					}
//		}

function Layout(){
	this.SceneAnalyzerOutput = {
		attrs:{
			xmlns:"",
			xsi:""
		},
		AnalyzedFrames:[]
	};
}

function Obstacle(){

	this.attrs = {
		id:"",
		obstacleType: "",
		distance: "",
		direction: "",
		category: ""
	};

	this.Size = {
		attrs: {
			height:"",
			width:"",
			depth:""
		}
	};

	this.CentralPosition = {
		attrs: {
			x:"",
			y:"",
			z:"",
		}
	};
}

function Frame = {
	this.attrs = {
		id:"",
		timestamp:"",
		mode:"",
		cameraHeight:"",
		muteState:""
	};
	this.Orientation = {
		attrs: {
			yaw:"",	
			roll:"",	
			pitch:""	
		}
	};
	this.Saturation = {
		attrs: {
			rate:"",
			area:""
		}
	};

	this.Obstacles = [];
}

let o1 = new Obstacle();

console.log(o1);
//let o1 = new Obstacle();
//let o2 = new Frame();
//let o3 = new Layout();

//console.log(o1);
//console.log(o2);
//console.log(o3);


