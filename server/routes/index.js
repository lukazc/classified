const CONSTANTS = require("../constants");
const express = require("express");
const sampleData = require("../sampleData");

// file upload middleware
const multer = require('multer');
var upload = multer({ dest: 'datastore/' });

// getting datastore
const path = require("path");
const fs = require("fs");
let datastoreImages = [];
const datastorePath = path.join('datastore');

// init Google Vision
const vision = require('@google-cloud/vision');
const GOOGLE_APPLICATION_CREDENTIALS_PATH = 'credentials.json';
// exit process if there are no Vision API credentials
if(!fs.existsSync(GOOGLE_APPLICATION_CREDENTIALS_PATH)
	|| !JSON.parse(fs.readFileSync(GOOGLE_APPLICATION_CREDENTIALS_PATH, { encoding: 'utf8' }))['private_key']
	|| !JSON.parse(fs.readFileSync(GOOGLE_APPLICATION_CREDENTIALS_PATH, { encoding: 'utf8' }))['project_id']
)
{
	console.error("ERROR: Required file " + GOOGLE_APPLICATION_CREDENTIALS_PATH + " is not valid. Shutting down.");
	console.log("You can create your own Vision API credentials at http://console.cloud.google.com")
	process.exit();
}

const client = new vision.ImageAnnotatorClient({
	keyFilename: GOOGLE_APPLICATION_CREDENTIALS_PATH
});

const router = express.Router();

// MasterDetail Page Endpoint
router.get(CONSTANTS.ENDPOINT.MASTERDETAIL, (req, res) => {
	res.json(sampleData.textAssets);
});

// LIST ENDPOINTS
router.get(CONSTANTS.ENDPOINT.LIST, function(req, res) {
	res.json(sampleData.listTextAssets);
});

router.post(CONSTANTS.ENDPOINT.LIST, function(req, res) {
	let listItem = {
	text: req.body.text,
	_id: sampleData.listID
	};
	sampleData.listTextAssets.unshift(listItem);
	res.json(listItem);
	sampleData.listID++;
});

router.delete(CONSTANTS.ENDPOINT.LIST + "/:_id", function(req, res) {
	const { _id } = req.params;
	var index = sampleData.listTextAssets.findIndex(
	listItem => listItem._id === Number(_id)
	);
	if (index > -1) {
		sampleData.listTextAssets.splice(index, 1);
		res.json({ _id: Number(_id), text: "This commented was deleted" });
	} else {
		res.status(404).send("Could not find item with id:" + _id);
	}
});

// IMAGE ENDPOINTS
// upload image
router.post(CONSTANTS.ENDPOINT.IMAGE, upload.array('image'), function(req, res) {

	let images = [];

	req.files.forEach((image) => {
		const filename = image.filename;
		const filePath = image.path;
	
		// read binary data
		const bitmap = fs.readFileSync(filePath);
		// convert binary data to base64 encoded string
		const b64 = new Buffer.from(bitmap).toString('base64');

		images.push({ filename, filePath, b64 })
	});

	// pass response as callback to wait for Vision API response
	annotateImages(images, res);

	// res.json(imageAnnotations);
});

// get images
router.get(CONSTANTS.ENDPOINT.IMAGE, function(req, res) {

	let base64Images = [];

	readDatastore();
	datastoreImages.forEach(filename => {
		// fs.createReadStream(path.join(datastorePath, filename), { encoding: 'base64' }).pipe(res);
		
		let image = {};
		image['filename'] = filename;
		
		// read binary data
		let bitmap = fs.readFileSync(path.join(datastorePath, filename));
		// convert binary data to base64 encoded string
		let b64 = new Buffer.from(bitmap).toString('base64');
		// add image to response
		image['b64'] = 'data:image/jpeg;base64,' + b64;
		// add label annotations from Vision API
		let imageAnnotations;
		try {
			imageAnnotations = JSON.parse(fs.readFileSync('imageAnnotations.json', { encoding: 'utf8' }));
		} catch (error) {
			imageAnnotations = {};
			console.log('GET IMAGES readFile imageAnnotations ERROR -> ', error);
		}
		image['labelAnnotations'] = imageAnnotations[filename] ? imageAnnotations[filename]['labelAnnotations'] : null;
		
		base64Images.push(image);
	});

	res.json(base64Images);
});

router.delete(CONSTANTS.ENDPOINT.IMAGE + "/:filename", function(req, res) {
	const { filename } = req.params;
	fs.unlink(path.join(datastorePath, filename), function(err) {
		if(err) throw err;
		
		deleteImageAnnotations(filename);
		
		console.log('File deleted ' + filename);
		res.json({ filename: filename, text: "This image was deleted" });
	});
});


// Grid Page Endpoint
router.get(CONSTANTS.ENDPOINT.GRID, (req, res) => {
	res.json(sampleData.textAssets);
});

function readDatastore() {

	datastoreImages = fs.readdirSync(datastorePath);
	// //passsing directoryPath and callback function
	// fs.readdir(datastorePath, function (err, files) {
	//   //handling error
	//   if (err) {
	//       return console.log('Unable to scan directory: ' + err);
	//   } 

	//   datastoreImages = [];
	//   //listing all files using forEach
	//   files.forEach(function (file) {
	//       // Do whatever you want to do with the file
	//       datastoreImages.push(file); 
	//   });
	// });
}

async function annotateImages(images, response = false) {

	// generate request object for each image
	let annotationRequests = [];

	images.forEach((image) => {
		annotationRequests.push({
			"image":{
				"content": image.b64,
			},
			"features": [
				{
					"type": "LABEL_DETECTION",
					"maxResults": 5
				}
			]
		})
	});

	try {
		// TODO test additional features
		const [result] = await client.batchAnnotateImages({ requests: annotationRequests });

		let res = [];
		let newAnnotations = {};

		for (const [index, annotations] of result['responses'].entries()) {

			let filename = images[index]['filename'];
			// append encoding type to beginning so the img src can interpret it
			let b64 = 'data:image/jpeg;base64,' + images[index]['b64'];
			let labelAnnotations = annotations['labelAnnotations'];

			res.push({ filename, b64, labelAnnotations });

			//add annotations
			newAnnotations[filename] = annotations;
		}

		fs.readFile('imageAnnotations.json', 'utf8', (err, data) => {
			
			let imageAnnotations;
			
			if (err){ 
				imageAnnotations = {};
				console.log('readFile imageAnnotations ERROR -> ', err);
			} else {
				imageAnnotations = JSON.parse(data);
			}
			

			imageAnnotations = { ...imageAnnotations, ...newAnnotations };

			// write annotations to disk 
			fs.writeFile('imageAnnotations.json', JSON.stringify(imageAnnotations), 'utf8', (error) => {
				if(error) console.log('writeFile imageAnnotations ERROR -> ', error)
			});
		});
				
		if (response) response.json(res);
		
	} catch (error) {
		console.log('annotateImage ERROR ', error);
	}
}

function deleteImageAnnotations(filename) {
	fs.readFile('imageAnnotations.json', 'utf8', (err, data) => {
		
		let imageAnnotations;
		
		if (err){ 
			console.log('deleteImageAnnotations() -> readFile imageAnnotations ERROR -> ', err);
			return;
		} else {
			imageAnnotations = JSON.parse(data);
		}
		
		// delete annotations
		delete imageAnnotations[filename];
		
		console.log('deleteImageAnnotations() -> annotations after delete ', imageAnnotations);
		//convert it back to json
		json = JSON.stringify(imageAnnotations);
		// write to disk 
		fs.writeFile('imageAnnotations.json', json, 'utf8', (error) => {
			if(error) console.log('writeFile imageAnnotations ERROR -> ', error)
		});
	});
}


module.exports = router;
