var express = require('express');
var router = express.Router();
const ToyModel = require('../models/ToyModel')

//Image upload
const multer = require('multer');
// const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../frontend/public/images/'); // Destination folder where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Set the filename of the uploaded file
  }
});

// const fileFilter = (req, file, cb) => {
//     const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
//     if(allowedFileTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// }

const upload = multer({ storage: storage })

router.get('/', async(req, res)=>{
 const data = await ToyModel.find({})
 res.json({success : true, data:data})
})

//add
router.post('/create', upload.single('image'), async (req, res) => {
  try {
    const { name, year, age_restriction, price, category, description } = req.body;

    // Access the uploaded file using req.file
    const image = req.file;

    // Create a new instance of the ToyModel and set the properties
    const toy = new ToyModel({
      name,
      year,
      age_restriction,
      price,
      category,
      description,
      image: image.filename // Save the filename in the 'image' field
    });

    await toy.save();

    res.send({ success: true, message: 'Added successfully', data: toy });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Server error' });
  }
});

// router.post('/create',  async(req, res)=>{
//  const data = new ToyModel(req.body) //lay data tu req 
//  await data.save()
//  res.send({success: true, message: "Added successfully", data: data})
// })

//update
//Update kieu nay thi phai nhap ca id cua sp vao phan req chu k phai lay tu url
// router.put('/update', async(req, res)=>{
//  const {_id,...rest} = req.body //... la de lay du lieu con lai, neu k co thi k chay dc
//  const data = await ToyModel.updateOne({_id:_id}, rest) //{_id:id} de tim id matching voi _id trong database va update phan rest
//  res.send({success: true, message:"updated successfully", data: data})
// })

router.put('/update', upload.single('image'), async (req, res) => {
  try {
    const { _id, ...rest } = req.body;
    const { name, year, age_restriction, price, category, description } = req.body;
    const image = req.file;

    let newData = {
      name,
      year,
      age_restriction,
      price,
      category,
      description,
    };

    if (image) {
      newData.image = image.filename;
    }

    const updatedData = await ToyModel.findByIdAndUpdate(_id, newData, { new: true });

    res.send({ success: true, message: 'Updated successfully', data: updatedData });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Server error' });
  }
});

//delete
router.delete('/delete/:id', async(req, res)=>{
 const id = req.params.id
 await ToyModel.deleteOne({_id:id})
 res.send({success: true, message:"Deleted successfully"})
})


module.exports = router;