const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
// const port = process.env.PORT || 3000;

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Set a file size limit (in bytes)
}).single('image');

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle image upload
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.send('Error uploading file.');
    } else {
      if (req.file) {
        res.redirect('/image/' + req.file.filename);
      } else {
        res.send('No file selected.');
      }
    }
  });
});

// Serve uploaded images
app.get('/image/:filename', (req, res) => {
  res.sendFile(path.join(__dirname, 'uploads', req.params.filename));
});

app.listen(5500 , () => {
  console.log(`Server is running on port ${5500 }`);
});
