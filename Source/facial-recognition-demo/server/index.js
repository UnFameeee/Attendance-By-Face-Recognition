const express = require('express')
const multer = require('multer')
const bodyParser = require('body-parser')
const path = require('path');
const { static } = require('express');
const cors = require('cors')
const app = express()

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/images/', static('images'));

const imageStorage = multer.diskStorage({
  // Destination to store image     
  destination: `images/${"QuocThang"}`,
  filename: (req, file, cb) => {
    // cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    cb(null, "QuocThang" + path.extname(file.originalname));

  }
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 10000000 // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      // upload only png and jpg format
      return cb(new Error('Please upload a Image'))
    }
    cb(undefined, true)
  }
})

// For Single image upload
app.post('/uploadImage', imageUpload.single('image'), (req, res) => {
  res.send(req.file)
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

const port = 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})