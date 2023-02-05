var express = require('express');
var router = express.Router();
const path = require('path');
var {Storage} = require('@google-cloud/storage');
const Dotenv = require('dotenv');
const multer = require('multer');
const logger = require('../config/winston');


const today = new Date().toISOString().substring(0,10).replace(/-/g,'');

/////////////////////////////////////////////////////////////////////////
//CNS LandingPage -> GCS
/////////////////////////////////////////////////////////////////////////

const storage = new Storage({
	keyFilename: path.join(__dirname, '../lgcns-eloqua.json')
});

const lgcnsBucket = storage.bucket('lgcns-eloqua-landing-files')

const uploadImage = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024, //MB
        files: 10,
       
    },
	//여기서 파일이름 컨트롤 가능
});

router.post('/ImageGCSTest', uploadImage.array('image', 10), (req, res) => {
    
    console.log(req.files);
    
    try{

        let filedata = req.files;

        if(req.files.length !== 0){
            console.log('file exist, trying to upload...');
            
            // const fileNaming = "";
            // const blob = lgcnsBucket.file(fileNaming);
            
            Promise.all(filedata.map((f)=>{
                    return new Promise((resolve, reject) => {
                        lgcnsBucket
                        .file(`${today}/${Date.now()}-${f.originalname}`) //file folder create and naming
                        .createWriteStream()
                        .on('finish', () => {
                            //console.log("Success");
                            resolve(f.originalname)
                        })
                        .on('error', err => {
                            reject(err)
                        })
                        .end(f.buffer);
                    })
                })
            )
            .then((result) =>{
                console.log(result);
                res.json({ 
                    "Result": true,
                    "LandingPage" : result
                })         
            })
            .catch((err) => {
                console.log(err);
                res.json({ 
                    "Result": false,
                    "LandingPage" : err
                })
            })

        } else { //파일이 존재하지 않을때 
            res.json({ 
                "Result" : true,
                "LandingPage" : "files not exist"
            })
        }
             
	}catch (error){
        console.log(error);
        console.log(error.stack);
        res.status(500).json({ 
            "Result" : false
        });
	}
    
});

// router.post('/GCSTest', function (req, res, next){

// 	// listBuckets();
// 	// storage.getBuckets('lgcns-eloqua-landing-files')
// 	// .then(x => console.log(x));
// 	console.log(storage.bucket('lgcns-eloqua-landing-files'))
// 	res.send('success')

// });

async function uploadFile() {
	

	await storage.bucket('lgcns-eloqua-landing-files').upload(filePath, {
		destination: `/${today}/${fileData.filename}`,
	  });
	console.log(`${filePath} uploaded to ${bucketName}`);
}


async function listBuckets() {
	const [buckets] = await storage.getBuckets();
	console.log('Buckets:');
	buckets.forEach(bucket => {
	  console.log(bucket.name);
	});
}

module.exports = router;