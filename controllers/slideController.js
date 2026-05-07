// controllers/slideController.js
const Slide = require('../models/Slide');

// មុខងារទាញយក Slide ទាំងអស់បង្ហាញលើ Home Page
exports.getAllSlides = async (req, res) => {
    try {
        const slides = await Slide.find();
        res.status(200).json(slides);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// មុខងារបញ្ចូល Slide ថ្មី (សម្រាប់ Admin)
exports.createSlide = async (req, res) => {
    const slide = new Slide({
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        link: req.body.link
    });

    try {
        const newSlide = await slide.save();
        res.status(201).json(newSlide);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};