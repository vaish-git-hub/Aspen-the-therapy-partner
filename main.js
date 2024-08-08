//imports
const path = require('path');
require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const multer = require('multer');
const Doctor = require('./routes/models/doctorSchema');
const Psychiatrist = require('./routes/models/Psychiatrist');
const Appointment = require('./routes/models/Appointment');
const Assessment = require('./routes/models/assessment');
const Story = require("./routes/models/story");
const Pen = require("./routes/models/Pen");
const app = express();
const PORT = process.env.PORT || 4000;
const fs = require('fs');
const collection=require('./routes/models/users');
// const Feedback = require('./models/feedback');

//database connection
mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;
// db.on('error', (error) => console.log(error));
db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

db.once('open', () => console.log(`connected to the database`));

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use(flash());
app.use(session({
    secret: 'SECRET',
    saveUninitialized: true,
    resave: false,
}));

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
// app.get('/therapists', async (req, res) => {
//     try {
//         // Fetch all therapist profiles from the database
//         const therapists = await Doctor.find({});

//         // Render the EJS template with the therapist data
//         res.render('therapists', { experts: 'Expert Therapists', therapists: therapists });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Error fetching therapist profiles' });
//     }
// });

//admin
// GET all therapists
app.get('/therapistad', async (req, res) => {
    try {
        const therapists = await Doctor.find();
        res.render('therapistad', { therapists: therapists });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// POST new therapist
app.post('/therapistad', upload.single('photo'), async (req, res) => {
    try {
        const { name, bio } = req.body;
        const photo = {
            data: fs.readFileSync(req.file.path),
            contentType: 'image/png' // Update with the actual image type
        };
        const newTherapist = new Doctor({ name, photo, bio });
        await newTherapist.save();
        res.redirect('/therapistad');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// GET therapist image
app.get('/therapistad/:id/image', async (req, res) => {
    try {
        const therapist = await Doctor.findById(req.params.id);
        res.json({ image: therapist.photo.data.toString('base64') });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// PUT update therapist
app.put('/therapistad/:id/edit', upload.single('photo'), async (req, res) => {
    try {
        const therapist = await Doctor.findById(req.params.id);
        therapist.name = req.body.name;
        therapist.bio = req.body.bio;
        if (req.file) {
            therapist.photo.data = fs.readFileSync(req.file.path);
            therapist.photo.contentType = 'image/png'; // Update with the actual image type
        }
        await therapist.save();
        res.json({ therapist: therapist });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// DELETE therapist
app.delete('/therapistad/delete/:id', async (req, res) => {
    try {
        await Doctor.findByIdAndDelete(req.params.id);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
//psychiatristad
// GET all psychiatrists
app.get('/psychiatristsad', async (req, res) => {
    try {
        const psychiatrists = await Psychiatrist.find();
        res.render('psychiatristsad', { psychiatrists: psychiatrists });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// POST new psychiatrist
app.post('/psychiatristsad', upload.single('photo'), async (req, res) => {
    try {
        const { name, bio } = req.body;
        const photo = {
            data: fs.readFileSync(req.file.path),
            contentType: 'image/png' // Update with the actual image type
        };
        const newPsychiatrist = new Psychiatrist({ name, photo, bio });
        await newPsychiatrist.save();
        res.redirect('/psychiatristsad');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// GET psychiatrist image
app.get('/psychiatristsad/:id/image', async (req, res) => {
    try {
        const psychiatrist = await Psychiatrist.findById(req.params.id);
        res.json({ image: psychiatrist.photo.data.toString('base64') });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// PUT update psychiatrist
app.put('/psychiatristsad/:id/edit', upload.single('photo'), async (req, res) => {
    try {
        const psychiatrist = await Psychiatrist.findById(req.params.id);
        psychiatrist.name = req.body.name;
        psychiatrist.bio = req.body.bio;
        if (req.file) {
            psychiatrist.photo.data = fs.readFileSync(req.file.path);
            psychiatrist.photo.contentType = 'image/png'; // Update with the actual image type
        }
        await psychiatrist.save();
        res.json({ psychiatrist: psychiatrist });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// DELETE psychiatrist
app.delete('/psychiatristsad/delete/:id', async (req, res) => {
    try {
        await Psychiatrist.findByIdAndDelete(req.params.id);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to fetch all appointments
app.get('/Appointad', async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('doctor');
    res.render('Appointad', { appointments }); // Render Appointad.ejs template
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Route to create a new appointment
app.post('/Appointad', async (req, res) => {
  const appointmentData = req.body;
  try {
    const newAppointment = await Appointment.create(appointmentData);
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Route to update an existing appointment
app.put('/Appointad/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedAppointment); // Return the updated appointment as JSON
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to delete an existing appointment
app.delete('/Appointad/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Assuming you are using Express.js
app.get('/storyad', async (req, res) => {
    try {
        const stories = await Story.find(); // Fetch stories from your database
        res.render('storyad', { stories }); // Render the storyad.ejs template and pass stories data
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.put('/storyad/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, imageUrl } = req.body;
        const updatedStory = await Story.findByIdAndUpdate(id, { title, content, imageUrl }, { new: true });
        res.json(updatedStory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
app.post('/storyad', async (req, res) => {
    try {
        const { title, content, imageUrl } = req.body;
        const newStory = new Story({ title, content, imageUrl });
        await newStory.save();
        res.status(201).json(newStory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// DELETE a story by ID
app.delete('/storyad/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Story.findByIdAndDelete(id);
        res.status(200).send({ message: 'Story deleted successfully.' });
    } catch (error) {
        res.status(500).send({ error: 'Unable to delete the story.' });
    }
});






app.get('/therapists', async (req, res) => {
    try {
        // Fetch all therapist profiles from the database
        const therapists = await Doctor.find({});
        console.log(therapists);
        // Render the EJS template with the therapist data
        // res.render('therapists', { experts: 'Expert Therapists', therapists: therapists });
        // Render the EJS template with the therapist data
        res.render('therapists', {
            experts: 'Expert Therapists',
            therapists: therapists,
            success: req.flash('success'),
            error: req.flash('error')
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching therapist profiles', details: err.message });
    }
});

// Use the upload middleware in your route
app.post('/therapists', upload.single('photo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const { name, bio } = req.body;
    const photo = {
        data: fs.readFileSync(req.file.path), // Read the image file
        contentType: req.file.mimetype, // Get the file type
    };
    // Create a new Doctor instance
    const newDoctor = new Doctor({
        name,
        photo,
        bio,
    });

    try {
        // Save the new doctor profile to the database using await
        await newDoctor.save();
        // res.status(201).json({ message: 'Doctor profile saved successfully' });
        // After successfully adding a therapist's profile
        req.flash('success', 'Doctor profile added successfully');
        res.redirect('/therapists'); // Redirect back to the page

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error saving the doctor profile' });
    }
});

//psychiatrists
app.get('/psychiatrists', async (req, res) => {
    try {
        // Fetch all psychiatrist profiles from the database
        const psychiatrists = await Psychiatrist.find({});

        // Render the EJS template with the psychiatrist data and flash messages
        res.render('psychiatrists', {
            expert: 'Expert Psychiatrists',
            psychiatrists: psychiatrists,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching psychiatrist profiles', details: err.message });
    }
});

// Use the upload middleware in your route
app.post('/psychiatrists', upload.single('photo'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const { name, bio } = req.body;
    const photo = {
        data: fs.readFileSync(req.file.path), // Read the image file
        contentType: req.file.mimetype, // Get the file type
    };

    // Create a new Psychiatrist instance
    const newPsychiatrist = new Psychiatrist({
        name,
        photo,
        bio,
    });

    try {
        // Save the new psychiatrist profile to the database
        await newPsychiatrist.save();
        req.flash('success', 'Psychiatrist profile added successfully');
        res.redirect('/psychiatrists');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error saving the psychiatrist profile' });
    }
});

//book
// app.post('/book', async (req, res) => {
//     try {
//         const { name, email, phone, doctor, date, time } = req.body;

//         // Create a new appointment using the Mongoose model
//         const newAppointment = new Appointment({
//             name,
//             email,
//             phone,
//             doctor,
//             date,
//             time,
//         });

//         // Save the appointment to the database
//         await newAppointment.save();

//         // Send a success response
//         res.json({
//             message: 'Appointment booked successfully',
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: 'Error booking appointment',
//         });
//     }
// });

// app.post('/book', async (req, res) => {
//     try {
//         const { name, email, phone, doctor, date, time, otherDoctorName } = req.body;

//         let doctorName;

//         if (doctor === 'custom') {
//             // Use the provided custom doctor name
//             doctorName = otherDoctorName; // Use the name entered in the form
//         } else {
//             // Use the selected doctor's name based on ObjectId
//             // Map the ObjectId to the corresponding doctor's name
//             const doctorMap = {
//                 "652b8e2e5346697517a4413b": "Dr. Sophia",
//                 "652ce9772d35ccd22c0124b8": "HO",
//                 "652d384986dce6c52afb9cf8": "Aishwarya",
//                 "65336a42e2747d48a0d7619b": "Dr.Pooja",
//             };
//             doctorName = doctorMap[doctor];
//         }

//         // Create a new appointment with the doctor's name
//         const newAppointment = new Appointment({
//             name,
//             email,
//             phone,
//             doctor: doctorName, // Use the doctor's name
//             date,
//             time,
//         });

//         // Save the appointment to the database
//         await newAppointment.save();

//         // Send a success response
//         return res.json({
//             message: 'Appointment booked successfully',
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: 'Error booking appointment',
//         });
//     }
// });
// app.post('/book', async (req, res) => {
//     try {
//         const { name, email, phone, doctor, date, time } = req.body;

//         let doctorName;

//         if (doctor === 'custom') { // Check if the selected doctor is "custom"
//             // Use the provided custom doctor name
//             doctorName = name; // Use the name entered in the form
//         } else {
//             // Use the selected doctor's name based on ObjectId
//             // Map the ObjectId to the corresponding doctor's name
//             const doctorMap = {
//                 "652b8e2e5346697517a4413b": "Dr. Sophia",
//                 "652ce9772d35ccd22c0124b8": "HO",
//                 "652d384986dce6c52afb9cf8": "Aishwarya",
//                 "65336a42e2747d48a0d7619b": "Dr.Pooja",
//             };
//             doctorName = doctorMap[doctor];
//         }

//         // Create a new appointment with the doctor's name
//         const newAppointment = new Appointment({
//             name,
//             email,
//             phone,
//             doctor: doctorName, // Use the doctor's name
//             date,
//             time,
//         });

//         // Save the appointment to the database
//         await newAppointment.save();

//         // Send a success response
//         return res.json({
//             message: 'Appointment booked successfully',
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: 'Error booking appointment',
//         });
//     }
// });

app.post('/book', async (req, res) => {
    try {
        const { name, email, phone, date, time, doctorType, doctorId } = req.body;

        // Validate input data
        if (!name || !email || !phone || !date || !time || !doctorType || !doctorId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Fetch the doctor using doctorId
        let doctor;
        doctor = await Doctor.findById(doctorId); // Assume you have a Doctor model

        // Check if the doctor exists
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        // Create a new appointment object
        const appointment = new Appointment({
            name,
            email,
            phone,
            date,
            time,
            doctor: doctorId,
            doctorType,
            doctorName: doctor.name, // Use the doctor's name from the fetched doctor object
        });

        // Save the appointment to the database
        await appointment.save();

        // Send a success response
        res.json({ message: 'Appointment booked successfully' });
    } catch (error) {
        console.error('Error booking appointment:', error);
        // Respond with a generic error status and message
        res.status(500).json({ error: 'Failed to book appointment' });
    }
});


app.get('/doctors', async (req, res) => {
    try {
        const doctors = await Doctor.find({}, 'name'); // Fetch doctors from your database, only returning the 'name' field
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
});


// app.get('/book', (req, res) => {
//     // Create an "Other" doctor
//     const otherDoctor = new Doctor({
//         name: 'Other',
//         photo: { data: null, contentType: null, size: 0 },
//         bio: 'Custom doctor for other cases',
//     });

//     // Save the "Other" doctor and get its ObjectId
//     otherDoctor.save()
//         .then((otherDoctor) => {
//             const otherDoctorId = otherDoctor._id;

//             // Render the EJS template and pass otherDoctorId as a variable
//             res.render('book', { otherDoctorId: otherDoctorId });
//         })
//         .catch((error) => {
//             console.error(error);
//             res.status(500).send('Error creating "Other" doctor');
//         });
// });


// Handle the login route
app.post('/login', async (req, res, next) => {
    try {
        const user = await collection.findOne({ email: req.body.email }).exec();

        if (user) {
            if (user.password === req.body.password) {
                user.loginCount++;
                await user.save();
                // Set a success flash message
                req.flash('success', 'Login successful');
                // Redirect the user to the assessment page after successful login
                res.redirect('/');
            } else {
                // Set an error flash message for wrong password
                req.flash('error', 'Wrong password!');
                res.redirect('/login');
            }
        } else {
            // Set an error flash message for unregistered email
            req.flash('error', 'This Email Is not registered!');
            res.redirect('/signup');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ "Error": "Internal server error" });
    }
});

// GET request to render the "Stories" page
app.get('/stories', async (req, res) => {
    try {
        const stories = await Story.find();
        res.render('stories', { stories });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stories', details: error.message });
    }
});

// POST request to submit a new story
app.post('/stories', upload.single('storyImage'), async (req, res) => {
    const { storyTitle, storyContent } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    try {
        if (!storyTitle || !storyContent || !imageUrl) {
            return res.status(400).json({ error: 'Title, content, and story image are required fields' });
        }

        // Additional validation for file type and size can be added here

        const newStory = new Story({
            title: storyTitle,
            content: storyContent,
            imageUrl,
        });

        await newStory.save();
        res.status(201).json({ message: 'Story posted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error saving the story', details: error.message });
    }
});

// Route to get the total count of psychiatrists
app.get('/psychiatristsad/total', async (req, res) => {
    try {
        const totalPsychiatrists = await Psychiatrist.countDocuments();
        res.json({ totalPsychiatrists });
    } catch (error) {
        console.error('Error fetching total psychiatrists:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Route to get the total count of therapists
app.get('/therapistad/total', async (req, res) => {
    try {
        const totalTherapists = await Doctor.countDocuments();
        res.json({ totalTherapists });
    } catch (error) {
        console.error('Error fetching total therapists:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Route to get the total count of appointments
app.get('/appointad/total', async (req, res) => {
    try {
        const totalAppointments = await Appointment.countDocuments();
        res.json({ totalAppointments });
    } catch (error) {
        console.error('Error fetching total appointments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// // Route to get the total count of signups
// app.get('/signup/total', async (req, res) => {
//     try {
//         const totalSignups = await User.countDocuments();
//         res.json({ totalSignups });
//     } catch (error) {
//         console.error('Error fetching total signups:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
// Route to get the total count of feedback

// // Define routes
// app.post('/quiz', async (req, res) => {
//     try {
//         const { user, depression, anxiety, stress } = req.body;
//         const newAssessment = new Assessment({ user, depression, anxiety, stress });
//         const savedAssessment = await newAssessment.save();
//         res.json(savedAssessment);
//     } catch (error) {
//         console.error('Error creating assessment:', error);
//         res.status(500).json({ error: 'Failed to create assessment' });
//     }
// });
// app.get('/quiz', async (req, res) => {
//     try {
//         const assessments = await Assessment.find();
//         res.json(assessments);
//     } catch (error) {
//         console.error('Error fetching assessments:', error);
//         res.status(500).json({ error: 'Failed to fetch assessments' });
//     }
// });
// Create a Mongoose schema for stories

// app.get('/pennn', async (req, res) => {
//     // Retrieve existing pens from the database and render them on a page
//     const pens = await Pen.find(); // You'll need to define this schema method
//     res.render('pennn', { pens }); // Assuming you're using a template engine like EJS or Handlebars
// });
app.use(bodyParser.json());

// app.post('/pennn', async (req, res) => {
//     // Create a new pen
//     const { text } = req.body;
//     const newPen = new Pen({ text, likes: 0, shares: 0, comments: 0 });

//     try {
//         await newPen.save();
//         res.json(newPen);
//     } catch (err) {
//         res.status(500).json({ error: 'Could not create pen' });
//     }
// });

// app.post('/pennn/:action/:id', async (req, res) => {
//     const { action, id } = req.params;

//     try {
//         const pen = await Pen.findById(id);

//         if (action === 'like') {
//             pen.likes++;
//             await pen.save();
//             res.json({ likes: pen.likes });
//         } else if (action === 'share') {
//             pen.shares++;
//             await pen.save();
//             res.json({ shares: pen.shares });
//         } else if (action === 'report') {
//             // Handle reporting logic here
//             // You can customize this route as needed
//             res.json({ message: 'Pen reported' });
//         } else if (action === 'comment') {
//             // Handle adding comments to pens here
//             // You can customize this route as needed
//             res.json({ message: 'Comment added' });
//         } else {
//             res.status(400).json({ error: 'Invalid action' });
//         }
//     } catch (err) {
//         res.status(500).json({ error: 'Error performing the action' });
//     }
// });


// Route to get the total count of stories
app.get('/stories/total', async (req, res) => {
    try {
        const totalStories = await Story.countDocuments();
        res.json({ totalStories });
    } catch (error) {
        console.error('Error fetching total stories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.set('view engine', 'ejs');
//route prefix
app.use("", require('./routes/routes'));

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
})
