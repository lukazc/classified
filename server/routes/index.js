﻿const CONSTANTS = require("../constants");
const express = require("express");
const sampleData = require("../sampleData");

// file upload middleware
const multer = require('multer');
var upload = multer({ dest: 'datastore/' });

// getting datastore
const path = require("path");
const fs = require("fs");
let datastorePhotos = [];
const datastorePath = path.join('datastore');

// init Google Vision
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

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
	
	// PHOTO ENDPOINTS
	// upload photo
	router.post(CONSTANTS.ENDPOINT.PHOTO, upload.single('photo'), function(req, res) {
		console.log(req.file);
		// const encoded = req.file.buffer.toString('base64');
		res.json('xd');
	});
	
	// get photos
	router.get(CONSTANTS.ENDPOINT.PHOTO, function(req, res) {
		// res.writeHead(200, {
		//   "Content-Type": "application/octet-stream",
		//   "Content-Disposition": "attachment; filename=" + photo
		// });
		
		// if (req.query && req.query.name) {
		//   // get requested image
		//   fs.createReadStream(path.join(datastorePath, req.query.name), { encoding: 'base64' }).pipe(res);
		// }
		// else
		// {
		//   // or get list of all images
		// }
		
		let base64Photos = {};
		
		readDatastore();
		datastorePhotos.forEach(photo => {
			// fs.createReadStream(path.join(datastorePath, photo), { encoding: 'base64' }).pipe(res);
			
			// read binary data
			var bitmap = fs.readFileSync(path.join(datastorePath, photo));
			// convert binary data to base64 encoded string
			base64Photos[photo] = {};
			base64Photos[photo]['src'] = 'data:image/jpeg;base64,' + new Buffer.from(bitmap).toString('base64');
			
			// const [result] = await client.labelDetection('./resources/wakeupcat.jpg');
			// const labels = result.labelAnnotations;
			// console.log('Labels:');
			// labels.forEach(label => console.log(label.description));
			
			// !!!! MOVE TO UPLOAD AND STORE THE LABELS ONLY ONCE
			annotateImage(base64Photos[photo]['src']);
			
		});
		
		res.json(base64Photos);
	});
	
	router.delete(CONSTANTS.ENDPOINT.PHOTO + "/:name", function(req, res) {
		const { name } = req.params;
		fs.unlink(path.join(datastorePath, name), function(err) {
			if(err) throw err;
			
			console.log('File deleted ' + name);
			res.json({ name: name, text: "This photo was deleted" });
		});
	});
	
	
	// Grid Page Endpoint
	router.get(CONSTANTS.ENDPOINT.GRID, (req, res) => {
		res.json(sampleData.textAssets);
	});
	
	function readDatastore() {
		
		datastorePhotos = fs.readdirSync(datastorePath);
		// //passsing directoryPath and callback function
		// fs.readdir(datastorePath, function (err, files) {
		//   //handling error
		//   if (err) {
		//       return console.log('Unable to scan directory: ' + err);
		//   } 
		
		//   datastorePhotos = [];
		//   //listing all files using forEach
		//   files.forEach(function (file) {
		//       // Do whatever you want to do with the file
		//       datastorePhotos.push(file); 
		//   });
		// });
	}

	async function annotateImage(image) {
		try {
			const [result] = await client.annotateImage(
				{
					"image":{
					  "content": image,
					},
					"features": [
					  {
						"type": "LABEL_DETECTION",
						"maxResults": 5
					  }
					]
				  }
			);

			console.log('annotateImage RESULT ', result)
			// base64Photos[photo][labels] = result.imageAnnotations;

			return result;

		} catch (error) {
			console.log('annotateImage ERROR ', error);
		}
	}
	
	
	module.exports = router;
	