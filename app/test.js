const spawn = require('child_process').spawn;
const child_process = require('child_process');
const free = spawn('ls', ['-l']);
const async = require('async');
const Step = require("step");

//free.stdout.on('data', function(data){
//	console.log(`${data}`);
//});



var processImage = function(){

	let results;
	let position = {};
	let objDepth;
	let sumLine;
	let centerDepth;
	let degree;
	//position.x = obj[1].location.x;
	//position.y = obj[1].location.y;

	var p1 = new Promise((resolve, reject)=>{

			child_process.exec('cd ~/multipathnet/;th demo.lua -img ../ma-master/app/upload/5.jpg -maxsize 230', (error, stdout, stderr)=>{
					if(error){

					reject(error);
					}
					else{
					//resolve(stdout);
					//resolve(stdout.split("##separator##")[1]);
					resolve(JSON.parse(stdout.split("##separator##")[1]));
					}
					//results = stdout.split("##separator##")[0];

					//console.log(stdout.split("##separator##")[1]);

					});

			});

	p1.then((obj)=>{
			results = obj;
			return getLineNum("5.pcd");
			//getLineNum("5.pcd")
			//.then((num)=>{
			//		sumLine = num;
			//		let line = Math.round(position.x*position.y/39560*num); 
			//		getDepth(line, 20, "5.pcd")
			//		.then((depth)=>{objDepth=depth;})
			//		.catch((err)=>{console.log(err)});

			//		getDepth(Math.round(sumLine/2), 20, "5.pcd")
			//		.then((depth)=>{centerDepth = depth;console.log(depth);})
			//		.catch((err)=>{console.log(err);});
			//})
			//.then(()=>{degree = Math.acos(centerDepth/objDepth)*180/Math.PI; console.log(degree);})
			//.catch((err)=>{ console.log(err); }); 
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
		console.log(e);
	}
}

run(0).then((results)=>{

	console.log(results);
});

//getDepth(5622, 20, "5.pcd");
//processImage();

//getLineNum("5.pcd");

//let results;


//var str = child_process.execSync('cd ~/multipathnet/;th demo.lua -img ../ma-master/app/upload/5.jpg -maxsize 230',{stdio:['pipe', 'pipe', '/dev/null']}).toString();
//console.log('123');
