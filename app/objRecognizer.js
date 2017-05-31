const spawn = require('child_process').spawn;
const child_process = require('child_process');
const free = spawn('ls', ['-l']);
const async = require('async');
const Step = require("step");

var processImage = function(){

	let results;
	let position = {};
	let objDepth;
	let sumLine;
	let centerDepth;
	let degree;

	var p1 = new Promise((resolve, reject)=>{

			child_process.exec('cd ~/multipathnet/;th demo.lua -img ../ma-master/app/upload/5.jpg -maxsize 230', (error, stdout, stderr)=>{
					if(error){

						reject(error);
					}
					else{
						resolve(JSON.parse(stdout.split("##separator##")[1]));
					}

					});

			});

	p1.then((obj)=>{
			results = obj;
			return getLineNum("5.pcd");
	})
	.then((lineNum)=>{
		sumLine = lineNum;	
		console.log(sumLine);
	});


}

var getObjects = function(image){

	return new Promise((resolve, reject)=>{
		
			let commandStr = 'cd ~/multipathnet/;th demo.lua -img ../ma-master/app/upload/'+ image +' -maxsize 230';
			child_process.exec(commandStr, (error, stdout, stderr)=>{
					if(error){
						reject(error);
					}
					else{
						resolve(JSON.parse(stdout.split("##separator##")[1]));
					}
			});
	});
}

var getDepth = function(line, scope, filename){
	return new Promise((resolve, reject)=>{

		let depthCommandStr = "./averageDepth.sh " + line +" " + scope + " " + filename;
		child_process.exec('cd ~/ma-master/app/upload/;'+depthCommandStr, (error, stdout, stderr)=>{
			if(error){
				reject(error);
			}
			else{
				resolve(parseFloat(stdout.replace(/[\n]/g, '')));
			}
		});
	});

}

var getSumLines = function(fileName){

	return new Promise((resolve, reject)=>{

		let lineNumCommandStr = "cd ~/ma-master/app/upload/;wc -l " + fileName + "| awk '{print $1}'";
		child_process.exec(lineNumCommandStr, (error, stdout, stderr)=>{
			if(error){
				reject(error);
			}
			else{
				resolve(stdout);
			}
		});
	});

}

var getFrameDirection = function(fileName){
	return new Promise((resolve, reject)=>{
		let frameDirectionCommandStr = "cd ~/ma-master/app/upload/;head -n 1 "+fileName;
		child_process.exec(frameDirectionCommandStr, (error, stdout, stderr)=>{
			if(error){
				reject(error);
			}
			else{
				resolve(parseFloat(stdout.replace(/[\n]/g, '')));
			}
		});
	});
}


async function run(frameIndex){
	try{
		let image = frameIndex + ".jpg";
		let pcd = frameIndex + ".pcd";
		let [objs, sumLines] = await Promise.all([getObjects(image), getSumLines(pcd)]);
		let averageDepth = await getDepth(Math.round(sumLines/2), 20, pcd);
		let frameDirection = await getFrameDirection(pcd);
		for(let i in objs){
			let x = objs[i].location.x;
			let y = objs[i].location.y;
			let depth = await getDepth(Math.round(x*y/230/172*sumLines), 20, pcd);
			let angle = Math.acos(averageDepth/depth)*180/Math.PI;
			objs[i].depth = depth;
			if(x>=115){
				objs[i].direction = angle;
			}
			else{
				objs[i].direction = -angle;
			}
			objs[i].fameDirection = frameDirection;
		}
		return objs;
	}catch(e){
		//console.log(e);
	}
};


var testLayout = { frame0: 
   { '1': 
      { location: [Object],
        category: 'laptop',
        depth: 0.77569,
        direction: -18.670382264607127,
        fameDirection: 288.14468 } },
  frame1: 
   { '1': 
      { location: [Object],
        category: 'laptop',
        depth: 0.41094,
        direction: 24.58374624659668,
        fameDirection: 348.14468 } },
  frame2: 
   { '1': 
      { location: [Object],
        category: 'laptop',
        depth: 0.62051,
        direction: -54.64413944477056,
        fameDirection: 48.144684 } },
  frame3: undefined,
  frame4: 
   { '1': 
      { location: [Object],
        category: 'refrigerator',
        depth: 0.81861,
        direction: 56.47826968909082,
        fameDirection: 168.14465 } },
  frame5: 
   { '1': 
      { location: [Object],
        category: 'tv',
        depth: 1.28919,
        direction: 52.871002436878236,
        fameDirection: 228.14465 } } };

async function generateLayout(){

	let obj0 = await run(0);
	//console.log(obj0);
	let obj1 = await run(1);
	let obj2 = await run(2);
	let obj3 = await run(3);
	let obj4 = await run(4);
	let obj5 = await run(5);
	let layout = new Object();
	layout.frame0 = obj0;
	layout.frame1 = obj1;
	layout.frame2 = obj2;
	layout.frame3 = obj3;
	layout.frame4 = obj4;
	layout.frame5 = obj5;
	//console.log(layout);

	//let layout_obj = new Layout();
	//let frames = new Array();

	//let frame0 = new Frame();
	//frame0.attrs.id = "1";
	//frame0.attrs.timestamp = "123";
	//frame0.attrs.mode = "mode1";
	//frame0.attrs.cameraHeight = "100";
	//frame0.attrs.muteState = "0";

	//frame0.Orientation.attrs.yaw = "102";
	//frame0.Orientation.attrs.pitch = "202";
	//frame0.Orientation.attrs.roll = "303";


	//frame0.Saturation.attrs.rate = "0";
	//frame0.Saturation.attrs.area = "unKnown";
	//frame0.Obstacles = [];


	//let obstacle0 = new Obstacle();
	//obstacle0.attrs.id = "1";
	//obstacle0.attrs.obstacleType = "Grounded";
	//obstacle0.attrs.distance = "1.094015";
	//obstacle0.attrs.direction = "-19.23001736";
	//obstacle0.attrs.category = "keyboard";

	//obstacle0.Size.attrs.width = "2.2933636";
	//obstacle0.Size.attrs.height = "1.5839";
	//obstacle0.Size.attrs.depth = "1.389095";
	//
	//obstacle0.CentralPosition.attrs.x = "-0.5921668";
	//obstacle0.CentralPosition.attrs.y = "-0.06917104";
	//obstacle0.CentralPosition.attrs.z = "1.797589";


	//frame0.Obstacles.push(obstacle0);
	//frames.push(frame0);



	//layout_obj.SceneAnalyzerOutput.attrs.xmlns = "http://range-it.eu/xmlschemata/sceneanalyzeroutput";
	//layout_obj.SceneAnalyzerOutput.attrs.xsi = "http://www.w3.org/2001/XMLSchema-instance";
	//layout_obj.SceneAnalyzerOutput.AnalyzedFrames = frames;

	//console.log(layout_obj);


	let myLayout = new Layout();
	
	let myFrames = new Array();
	for(let frameIndex in layout){
		let frame = new Frame();
		let frameObj = layout[frameIndex];

		frame.attrs.id = frameIndex;
		frame.attrs.timestamp = "123";
		frame.attrs.mode = "mode1";
		frame.attrs.cameraHeight = "100";
		frame.attrs.muteState = "0";


		frame.Orientation.attrs.yaw = "102";
		frame.Orientation.attrs.pitch = "202";
		frame.Orientation.attrs.roll = "303";

		frame.Saturation.attrs.rate = "0";
		frame.Saturation.attrs.area = "unKnown";
		frame.Obstacles = new Array();

		for(let index in frameObj){
			let obj = frameObj[index];
			let obstacle = new Obstacle();

			obstacle.attrs.id = frameIndex + index;
			obstacle.attrs.obstacleType = "Grounded";
			obstacle.attrs.distance = obj.depth;
			obstacle.attrs.direction = obj.direction;
			obstacle.attrs.category = obj.category;
			obstacle.attrs.frameDirection = obj.frameDirection;
			

			obstacle.Size.attrs.width = "2.2933636";
			obstacle.Size.attrs.height = "1.5839";
			obstacle.Size.attrs.depth = "1.389095";

			obstacle.CentralPosition.attrs.x = "-0.5921668";
			obstacle.CentralPosition.attrs.y = "-0.06917104";
			obstacle.CentralPosition.attrs.z = "1.797589";

			frame.Obstacles.push(obstacle);
		}


		myFrames.push(frame);
	}

	myLayout.SceneAnalyzerOutput.attrs.xmlns = "http://range-it.eu/xmlschemata/sceneanalyzeroutput";
	myLayout.SceneAnalyzerOutput.attrs.xsi = "http://www.w3.org/2001/XMLSchema-instance";
	myLayout.SceneAnalyzerOutput.AnalyzedFrames = myFrames;
	
	//console.log(serialize(layout_obj));
	console.log(serialize(myLayout));
}


function serialize(layout){

	let head = '<?xml version="1.0" encoding="utf-8"?>';
	//let frames = '<AnalyzedFrames></AnalyzedFrames>';
	let frames = '';
	let sceneAnalyzerOutput_attrs = "";
	for(let attr in layout.SceneAnalyzerOutput.attrs){
		sceneAnalyzerOutput_attrs += " " + attr +"=" + "\"" + layout.SceneAnalyzerOutput.attrs[attr] + "\"";
	}

	//let SceneAnalyzerOutput = '<SceneAnalyzerOutput ' + sceneAnalyzerOutput_attrs + '>' + frames + '</SceneAnalyzerOutput>';

	let frameContainer = [];
	for(let index in layout.SceneAnalyzerOutput.AnalyzedFrames){
		let frameAttrs = "";
		for(let attrIndex in layout.SceneAnalyzerOutput.AnalyzedFrames[index].attrs){
			frameAttrs += " " + attrIndex + "=" + "\"" + layout.SceneAnalyzerOutput.AnalyzedFrames[index].attrs[attrIndex] + "\"";
		}


		let orienAttrs = "";
		for(let orienIndex in layout.SceneAnalyzerOutput.AnalyzedFrames[index].Orientation.attrs){
			orienAttrs += " " + orienIndex + "=" + "\"" + layout.SceneAnalyzerOutput.AnalyzedFrames[index].Orientation.attrs[orienIndex] + "\"";
		}

		let orientation = '<Orientation ' + orienAttrs + ' />';


		let saturationAttrs = "";
		for(let saturationIndex in layout.SceneAnalyzerOutput.AnalyzedFrames[index].Saturation.attrs){
			saturationAttrs += " " + saturationIndex + "=" + "\"" +layout.SceneAnalyzerOutput.AnalyzedFrames[index].Saturation.attrs[saturationIndex] + "\"";
		}

		let saturation = "<Saturation " + saturationAttrs + " />";
		//console.log(saturation);
		//console.log(orientation);
		//let singleFrame = '<AnalyzedFrame ' + frameAttrs +' >' + orientation + saturation + '</AnalyzedFrame>';
		//console.log(singleFrame);
		

		let obstacleContainer = [];

		for(let obstacleIndex in layout.SceneAnalyzerOutput.AnalyzedFrames[index].Obstacles){
			let obstacleAttrs = "";
			for(let obstacleAttrIndex in layout.SceneAnalyzerOutput.AnalyzedFrames[index].Obstacles[obstacleIndex].attrs){
				obstacleAttrs += " " + obstacleAttrIndex + "=" + "\"" + layout.SceneAnalyzerOutput.AnalyzedFrames[index].Obstacles[obstacleIndex].attrs[obstacleAttrIndex] + "\"";
			}


			let obstacleSizeAttrs = "";
			for(let obstacleSizeAttrsIndex in layout.SceneAnalyzerOutput.AnalyzedFrames[index].Obstacles[obstacleIndex].Size.attrs){
				obstacleSizeAttrs += " " + obstacleSizeAttrsIndex + "=" + layout.SceneAnalyzerOutput.AnalyzedFrames[index].Obstacles[obstacleIndex].Size.attrs[obstacleSizeAttrsIndex] + "\"";
			}
			let obstacleSize = "<Size " + obstacleSizeAttrs + " />"
			//console.log(obstacleSize);

			let CentralPositionAttrs = "";
			for(let CentralPositionAttrsIndex in layout.SceneAnalyzerOutput.AnalyzedFrames[index].Obstacles[obstacleIndex].CentralPosition.attrs){
			
				CentralPositionAttrs += " " + CentralPositionAttrsIndex + "=" + layout.SceneAnalyzerOutput.AnalyzedFrames[index].Obstacles[obstacleIndex].CentralPosition.attrs[CentralPositionAttrsIndex] + "\"";
			}
			let ObstacleCentralPosition = "<CentralPosition " + CentralPositionAttrs + " />";
			//console.log(ObstacleCentralPosition);


			let obstacle = '<Obstacle ' + obstacleAttrs + '> ' + obstacleSize + ObstacleCentralPosition + '</Obstacle>';
			obstacleContainer.push(obstacle);
			//console.log(obstacle);
		}

		let obstacleSet = "";
		for(let obstacle of obstacleContainer){
			obstacleSet += obstacle;
		}
		let singleFrame = '<AnalyzedFrame ' + frameAttrs +' >' + orientation + saturation + '<Obstacles>' + obstacleSet + '</Obstacles>' +  '</AnalyzedFrame>';

		//console.log(singleFrame);

		frameContainer.push(singleFrame);
	}

	let frameSet = "";
	for(let frame of frameContainer){
		frameSet += frame;
	}



	let SceneAnalyzerOutput = '<SceneAnalyzerOutput ' + sceneAnalyzerOutput_attrs + '>' + '<AnalyzedFrames>' + frameSet + '</AnalyzedFrames>'  + '</SceneAnalyzerOutput>';

		

	//return sceneAnalyzerOutput_attrs;
	return head + SceneAnalyzerOutput;
}

//function serialize(layout){
//
//	let head = '<?xml version="1.0" encoding="utf-8"?>';
//	//let frames = '<AnalyzedFrames></AnalyzedFrames>';
//	let frames = '';
//	let sceneAnalyzerOutput_attrs = "";
//	for(let attr in layout.SceneAnalyzerOutput.attrs){
//		sceneAnalyzerOutput_attrs += " " + attr +"=" + "\"" + layout.SceneAnalyzerOutput.attrs[attr] + "\"";
//	}
//
//	for(let index in layout.SceneAnalyzerOutput.AnalyzedFrames){
//		let frameAttrs = "";
//		for(let attrIndex in layout.SceneAnalyzerOutput.AnalyzedFrames[index]){
//			
//		}
//	}
//
//	let SceneAnalyzerOutput = '<SceneAnalyzerOutput ' + sceneAnalyzerOutput_attrs + '>' + frames + '</SceneAnalyzerOutput>';
//
//		
//
//	//return sceneAnalyzerOutput_attrs;
//	return head + SceneAnalyzerOutput;
//}

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


function Layout(){
        this.SceneAnalyzerOutput = {
                attrs:{
                        xmlns:"",
                        xsi:""
                },
                AnalyzedFrames:[]
        };
}

function Frame(){
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


generateLayout();

exports.run = run;
