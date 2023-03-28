var express = require('express');
var router = express.Router();
const path = require('path');
var { Storage } = require('@google-cloud/storage');
const Dotenv = require('dotenv');
const multer = require('multer');

function getToday(){
  var date = new Date();
  var year = date.getFullYear();
  var month = ("0" + (1 + date.getMonth())).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);

  return year + "-" + month + "-" + day;
}

/////////////////////////////////////////////////////////////////////////
//CNS LandingPage -> GCS
/////////////////////////////////////////////////////////////////////////

const storage = new Storage({
  keyFilename: path.join(__dirname, '../lgcns-eloqua-fileupload-616c86993401.json'),
});

const lgcnsBucket = storage.bucket('lgcns-eloqua-fileupload');

const uploadFiles = (req, res, next) => {

    const uploadImage = multer({
        storage: multer.memoryStorage(),
        limits: {
            fileSize: 100 * 1024 * 1024, //MB
            files: 10,
        }
    }).array('image', 10)

    uploadImage(req, res, (error) => {
        if (error instanceof multer.MulterError){
            console.log('message >> multer Error');
            console.log('errorMessage >>' + error.message);
            console.log('errorCode >>' + error.code);
            return res.status(500).json({ 
                'Result': false,
                'errorMessage': error.message
            })
        } else if (error){
            console.log('message >> multer Error occured');
            console.log('errorMessage >>' + error.message);
            return res.status(500).json({ 
                'Result': false,
                'errorMessage': error.message
            })
        }
        next()
    })
}

router.post('/ImageGCS', uploadFiles, (req, res) => {
  console.log(req.body);
  //console.log(req.files);
 
  try {
    let filedata = req.files;
    let filename;
    // let originText = ScalpImgList[key][0]['buffer'];
    // base64EncodedText = Buffer.from(originText, "utf8").toString('base64');
    if (req.files.length !== 0) {
      console.log('file exist, trying to upload...');

      // const fileNaming = "";
      // const blob = lgcnsBucket.file(fileNaming);

      Promise.all(
        filedata.map((f) => {
        filename = req.body.campaignId+'_'+req.body.contactId+'_'+req.body.createDt+'_'+Buffer.from(f.originalname, 'latin1').toString('utf8')
        console.log(filename);

        return new Promise((resolve, reject) => {
            lgcnsBucket
              .file(`${req.body.campaignId}/${getToday()}/${filename}`) //file folder create and naming
              .createWriteStream()
              .on('finish', () => {
                console.log("Success fileUpload");
                resolve(f.originalname);
              })
              .on('error', (err) => {
                reject(err);
              })
              .end(f.buffer);
          });
        })
      )
        .then((result) => {
          //console.log(result);
          res.json({
            Result: true,
            LandingPage: result,
          });
        })
        .catch((err) => {
          console.log(err);
          res.json({
            Result: false,
            'errorMessage': err,
          });
        });``
        
    } else {
      //파일이 존재하지 않을때
      res.json({
        Result: true,
        LandingPage: 'files not exist',
      });
    }
  } catch (error) {
    console.log(error);
    console.log(error.stack);
    res.status(500).json({
      Result: false,
      'errorMessage': error
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
router.post('/test', (req, res) => {
  console.log(req.body);
  res.send('호출테스트 성공')
});

async function uploadFile() {
  await storage.bucket('lgcns-eloqua-landing-files').upload(filePath, {
    destination: `/${today}/${fileData.filename}`,
  });
  console.log(`${filePath} uploaded to ${bucketName}`);
}

async function listBuckets() {
  const [buckets] = await storage.getBuckets();
  console.log('Buckets:');
  buckets.forEach((bucket) => {
    console.log(bucket.name);
  });
}

module.exports = router;
