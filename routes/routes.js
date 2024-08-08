const express = require('express');
const router = express.Router();
const collection = require('./models/users');
const Doctor = require('./models/doctorSchema');
const Appointment = require('./models/Appointment')
const Pen = require('./models/Pen');
const Comment = require('./models/Pen');

express.application.use(express.urlencoded({ extended: false }));
const app = express();

app.set('view engine', 'ejs');
const flash = require('express-flash');
// const Appointment = require('./models/Appointment');
const Feedback = require('./models/feedback');
const { Collection } = require('mongoose');

// Define a route for submitting feedback
router.post('/', async (req, res) => {
    try {
        // Create a new feedback instance using the model
        const newFeedback = new Feedback({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            gender: req.body.gender,
            note: req.body.note
        });

        // Save the feedback to the database
        await newFeedback.save();
        // Set a success flash message
        req.flash('success', 'Feedback submitted successfully');
        res.redirect('/');
        // Send a success response
        // res.json({ success: 'Feedback submitted successfully' });
    } catch (error) {
        // Handle errors and send an error response
        console.error(error);
        // res.status(500).json({ error: 'Feedback submission failed' });
        // Set an error flash message
        req.flash('error', 'Feedback submission failed');
        res.redirect('/'); // Redirect to the feedback page or a different page as needed

    }
});


app.use(flash());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3000;

router.post('/usersignup', async (req, res) => {
    try {
        const { name, email, password, cpassword, securityAnswer, role } = req.body;

        // Check if the passwords match
        if (password !== cpassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        // Check if a user with the same email already exists
        const existingUser = await collection.findOne({ email });

        if (existingUser) {
            // User with the same email already exists, render signup page with an error message
            return res.render('signup', { errorMessage: 'User with this email already exists. Please log in.' });
        }

        // Create a new user using the User model
        const newUser = new collection({
            name,
            email,
            password,
            cpassword,
            securityAnswer,
            role,
        });

        // Save the user to the database
        const savedUser = await newUser.save();
        console.log('User saved:', savedUser);
        // Render the expertsignup view with a success message
        res.render('usersignup', { usersignup: 'Expert registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
//Handle user and doctor sign-up
router.post('/expertsignup', async (req, res) => {
    try {
        const { name, email, password, cpassword, securityAnswer, role, licenseNumber } = req.body;

        // Check if the passwords match
        if (password !== cpassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        // Check if a user with the same email already exists
        const existingUser = await collection.findOne({ email });

        if (existingUser) {
            // User with the same email already exists, render signup page with an error message
            return res.render('signup', { errorMessage: 'User with this email already exists. Please log in.' });
        }

        // Create a new user using the User model
        const newUser = new collection({
            name,
            email,
            password,
            cpassword,
            securityAnswer,
            role,
            doctorInfo: { licenseNumber },
        });

        // Save the user to the database
        const savedUser = await newUser.save();
        console.log('User saved:', savedUser);
        // Render the expertsignup view with a success message
        res.render('expertsignup', { expertsignup: 'Expert registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Login route
router.post('/login', async (req, res, next) => {
    try {
        const user = await collection.findOne({ email: req.body.email }).exec();

        if (user) {
            if (user.password === req.body.password) {
                user.loginCount++;
                await user.save();
                // Set a success flash message
                req.flash('success', 'Login successful');
                res.redirect('/login');
                // res.redirect('/dashboard');
            } else {
                // Set an error flash message for wrong password
                req.flash('error', 'Wrong password!');
                res.redirect('/login');

            }
        } else {
            // Set an error flash message for unregistered email
            req.flash('error', 'This Email Is not registered!');
            // res.render('login', { error: req.flash('error') });
            res.redirect('/login');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ "Error": "Internal server error" });
    }
});

// // ...


router.post('/forgot', async (req, res, next) => {
    try {
        const user = await collection.findOne({ email: req.body.email }).exec();

        if (!user) {
            return res.send({ "Success": "This Email Is not registered!" });
        }

        if (req.body.password === user.password) {
            return res.send({ "Success": "New password cannot be the same as the current password." });
        }

        if (req.body.password !== req.body.cpassword) {
            return res.send({ "Success": "Password does not match! Both passwords should be the same." });
        }

        user.password = req.body.password;
        user.cpassword = req.body.cpassword;

        await user.save();

        res.send({ "Success": "Password changed!" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ "Error": "Internal server error" });
    }
});


// router.get('/user', async (req, res) => {
//     try {
//         // Fetch all users from the 'collection' model
//         const users = await collection.find();

//         // Render the 'user' EJS template and pass the 'users' data
//         res.render('user', { users });
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });


router.post('/user', async (req, res) => {
    try {
        const { name, email, password, cpassword, role, securityAnswer, doctorInfo } = req.body;
        
        // Create a new user
        const newUser = new collection({
            name,
            email,
            password,
            cpassword,
            role,
            securityAnswer,
            doctorInfo
        });

        // Save the new user to the database
        await newUser.save();

        res.status(201).json({ message: 'User created successfully!', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

router.get('/user', async (req, res) => {
    try {
        const users = await collection.find(); // Fetch all users from the database
        res.render('user', { users }); // Pass the users array to the EJS view
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Read a single user by ID
router.get('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Find the user by ID
        const user = await collection.findById(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});
// PUT route handler for updating a user
router.put('/user/:id', async (req, res) => {
    const userId = req.params.id; // Get the user ID from the URL
    const updatedData = req.body; // Get the updated user data from the request body

    try {
        // Find the user by ID and update their data
        const user = await collection.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Send the updated user data as the response
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Find and delete the user from the database
        const deletedUser = await collection.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully!' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

router.get('/usersignupad', async (req, res) => {
    try {
        const users = await collection.find();
        res.render('usersignupad', { users: users }); // Pass the users array to the EJS template
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
});
// GET all experts with license numbers
router.get('/expertsignupad', async (req, res) => {
    try {
        const experts = await collection.find({ 'doctorInfo.licenseNumber': { $exists: true, $ne: '' } });
        res.render('expertsignupad', { users: experts }); // Render the EJS file with data
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// POST - create a new expert
router.post('/expertsignupad', async (req, res) => {
    try {
        // Check if the email already exists in the database
        const existingExpert = await collection.findOne({ email: req.body.email });
        if (existingExpert) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Create a new expert
        const expert = new collection({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            cpassword: req.body.cpassword,
            role: req.body.role,
            securityAnswer: req.body.securityAnswer,
            doctorInfo: {
                licenseNumber: req.body.licenseNumber || '', // Use an empty string if licenseNumber is not provided
            }
        });

        const newExpert = await expert.save();
        res.status(201).json(newExpert);
    } catch (error) {
        console.error("Error creating expert:", error); // Log the error
        res.status(500).json({ message: "Error creating expert" });
    }
});
// PUT - update an expert by ID
// router.put('/expertsignupad/:id', async (req, res) => {
//     const id = req.params.id;

//     try {
//         const updatedExpert = await collection.findByIdAndUpdate(id, {
//             $set: {
//                 name: req.body.name,
//                 email: req.body.email,
//                 password: req.body.password,
//                 role: req.body.role,
//                 securityAnswer: req.body.securityAnswer,
//                 'doctorInfo.licenseNumber': req.body.licenseNumber
//             }
//         }, { new: true });

//         if (!updatedExpert) {
//             return res.status(404).json({ message: 'Expert not found' });
//         }

//         res.json(updatedExpert);
//     } catch (error) {
//         console.error("Error updating expert:", error);
//         res.status(500).json({ message: "Error updating expert" });
//     }
// });
// Update an expert
router.put('/expertsignupad/:id', async (req, res) => {
  try {
    const expert = await collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(expert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete('/expertsignupad/:id', async (req, res) => {
  try {
    await collection.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




// Middleware to get user by ID
async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "User not found" });
    }
    res.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
// Route to handle user creation
router.post('/usersignupad', async (req, res) => {
    try {
        const user = new collection(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
    }
});


// Update one user
router.patch('/usersignupad/:id', getUser, async (req, res) => {
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }
  if (req.body.email != null) {
    res.user.email = req.body.email;
  }
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  if (req.body.role != null) {
    res.user.role = req.body.role;
  }
  if (req.body.securityAnswer != null) {
    res.user.securityAnswer = req.body.securityAnswer;
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one user
router.delete('/usersignupad/:id', async (req, res) => {
  try {
    const user = await collection.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


async function getUser(req, res, next) {
  let user;
  try {
    user = await collection.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find user' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}



module.exports = router;




router.get('/', (req, res) => {
    res.render('index', { pagetitle: 'Home Page' });
});

app.get('/feedback', (req, res) => {
    res.render('index', { pagetitle: 'Home Page', success: '' });
});

router.get('/about', (req, res) => {
    res.render("about", { title: "About page" });
});
// router.get('/therapists', (req, res) => {
//     res.render("therapists", { experts: "therapists page" });
// });
router.get('/psychiatrists', (req, res) => {
    res.render("psychiatrists", { expert: "psychiatrists page" });
});
router.get('/stories', (req, res) => {
    res.render("stories", { stories: "stories page" });
});
router.get('/pennn', (req, res) => {
    res.render("pennn", { pennn: "pen page" });
});

router.get('/login', (req, res) => {
    res.render("login", {
        login: "Login Page",
        success: req.flash('success'),
        error: req.flash('error'),
    });
});
router.get('/forgot', (req, res) => {
    res.render("forgot", { forgot: "forgot page" });
});
router.get('/signup', (req, res) => {
    res.render("signup", { signup: "Signup page" });
});
router.get('/usersignup', (req, res) => {
    res.render("usersignup", { usersignup: "User signup page" });
});
router.get('/expertsignup', (req, res) => {
    res.render("expertsignup", { expertsignup: "Expert signup page" });
});
router.get('/quiz', (req, res) => {
    res.render("quiz", { quiz: "quiz  page" });
});
router.get('/chatbot', (req, res) => {
    res.render("chatbot", { chatbot: "chatbot  page" });
});
router.get('/resource', (req, res) => {
    res.render("resource", { resource: "resource  page" });
});
router.get('/book', (req, res) => {
    res.render("book", { book: "book  page" });
});

//admin
router.get('/user', (req, res) => {
    res.render("user", { user: "user  page" });
});
router.get('/therapistad', (req, res) => {
    res.render("therapistad", { therapistad: "therapistad  page" });
});

router.get('/psychiatristsad', (req, res) => {
    res.render("psychiatristsad", { psychiatristsad: "psychiatristsad  page" });
});
router.get('/Appointad', (req, res) => {
    res.render("Appointad", { Appointad: "Appointad  page" });
});
router.get('/signupad1', (req, res) => {
    res.render("signupad1", { signupad1: "signupad  page" });
});
router.get('/storyad', (req, res) => {
    res.render("storyad", { storyad: "storyad  page" });
});
router.get('/usersignupad', (req, res) => {
    res.render("usersignupad", { usersignupad: "usersignupad  page" });
});
router.get('/expertsignupad',(req, res) => {
    res.render("expertsignupad", { expertsignupad: "expertsignupad  page" });
});

// router.get('/doctor_schedule', (req, res) => {
//     res.render("doctor_schedule", { doctor_schedule: "doctor_schedule  page" });
// });
// router.get('/doctor_schedule', async (req, res) => {
//     console.log('Reached /doctor_schedule route');
//     try {
//         const appointments = await Appointment.find();
//         // .populate('doctor', 'name'); 
//         res.render('doctor_schedule', { appointments });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'An error occurred' });
//     }
// });
router.get('/admin', (req, res) => {
    res.render("admin", { admin: "admin  page" });
});
router.get('/resource',(req,res)=>{
    res.render('resource',{resource:"resource page"});
})

// router.get('/doctor_schedule', (req, res) => {
//     res.render("doctor_schedule", { Appointment: "appointments" });
// });
// Update your server-side code
// router.get('/doctor_schedule', async (req, res) => {
//     try {
//         // Fetch all appointments from the database, including doctor information
//         const appointments = await Appointment.find({}).populate('doctor', 'name'); // Assuming your doctor reference field is named 'doctor'

//         // Render the EJS template with the appointment data
//         res.render('doctor_schedule', {
//             appointments: appointments,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Error fetching appointments', details: err.message });
//     }
// });
// app.get('/doctor_schedule/:doctorId', async (req, res) => {
//     const { doctorId } = req.params;

//     try {
//         const appointments = await Appointment.find({ doctor: doctorId });

//         res.json(appointments);
//     } catch (error) {
//         console.error('Error fetching doctor schedule:', error);
//         res.status(500).json({ error: 'Failed to fetch doctor schedule' });
//     }
// });

// router.get('/doctor_schedule', async (req, res) => {
//     try {
//         // Fetch appointments data
//         const appointments = await Appointment.find().populate('doctor').exec();
//             // Log the appointments data
//         console.log('Appointments data:', appointments);
//         // Render the view and pass the appointments data
//         res.render("doctor_schedule", { appointments });
//     } catch (error) {
//         console.error('Error fetching appointments:', error);
//         // Respond with an error status and message
//         res.status(500).json({ error: 'Failed to fetch appointments' });
//     }
// });







// Define the route for the doctor's schedule page
router.get('/doctor_schedule', async (req, res) => {
    try {
        // Query the database to fetch appointments and populate the 'doctor' field
        const appointments = await Appointment.find()
            .populate('doctor') // This will populate the 'doctor' field with data from the Doctor model
            .exec();
        
        // Log the appointments data for debugging (optional)
        console.log('Appointments data:', appointments);
        
        // Render the view and pass the appointments data
        res.render('doctor_schedule', { appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        // Respond with an error status and message
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});


// Handle the POST request to book an appointment
router.post('/doctor_schedule', async (req, res) => {
    // Extract the appointment booking data from req.body
    const { name, email, phone, doctor, date, time } = req.body;

    // Implement your appointment booking logic here, similar to the code in your previous POST route.

    try {
        // Find the doctor by name
        const doctorDocument = await Doctor.findOne({ name: doctor.trim() });

        if (!doctorDocument) {
            // Handle the case where the doctor is not found
            res.status(400).json({ message: 'Doctor not found' });
            return;
        }
        // Example logic to save the appointment to the database (modify as needed)
        const newAppointment = new Appointment({
            name,
            email,
            phone,
            doctor: doctorDocument._id,// Use the doctor ID here
            date,
            time,
        });

        await newAppointment.save();

        // Send a success response
        res.json({
            message: 'Appointment booked successfully',
        });
    } catch (error) {
        // Handle errors and return an appropriate error response
        console.error(error);
        res.status(500).json({
            message: 'Error booking appointment',
        });
    }
});






router.post('/pennn', async (req, res) => {
    try {
        const { text } = req.body;
        const newPen = new Pen({ text });
        await newPen.save();
        // Return the new pen
        res.status(201).json(newPen);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/pennn/all', async (req, res) => {
    try {
        const pens = await Pen.find().populate('comments');
        res.json(pens);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/pennn/like/:penId', async (req, res) => {
    try {
        const penId = req.params.penId;

        // Find the pen document by its ID
        const pen = await Pen.findById(penId);

        if (!pen) {
            // If the pen is not found, return a 404 Not Found response
            return res.status(404).json({ error: 'Pen not found' });
        }

        // Increment the likes
        if (typeof pen.likes === 'number') {
            pen.likes += 1;
        } else {
            // If the likes property is not a number, initialize it to 1
            pen.likes = 1;
        }

        // Save the pen document
        await pen.save();

        // Send the updated likes count as a JSON response
        res.json({ likes: pen.likes });

    } catch (error) {
        // Log the error and respond with an internal server error
        console.error('Error liking pen:', error);
        res.status(500).json({ error: error.message });
    }
});

// // Route to handle sharing a pen
// router.post('/pennn/share/:penId', async (req, res) => {
//     try {
//         const penId = req.params.penId;

//         // Find the pen document by its ID
//         const pen = await Pen.findById(penId);

//         if (!pen) {
//             return res.status(404).json({ error: 'Pen not found' });
//         }

//         // Increment the shares count
//         pen.shares = (pen.shares || 0) + 1;

//         // Save the updated pen document
//         await pen.save();

//         // Send the updated shares count as a JSON response
//         res.json({ shares: pen.shares });
//     } catch (error) {
//         console.error('Error sharing pen:', error);
//         res.status(500).json({ error: error.message });
//     }
// });
// Route to handle sharing a pen and updating the share count
router.post('/pennn/share/:penId', async (req, res) => {
    try {
        const penId = req.params.penId;

        // Find the pen document by its ID
        const pen = await Pen.findById(penId);

        // Check if the pen exists
        if (!pen) {
            return res.status(404).json({ error: 'Pen not found' });
        }

        // Increment the shares count
        pen.shares = (pen.shares || 0) + 1;

        // Save the updated pen document
        await pen.save();

        // Send the updated shares count as a JSON response
        res.json({ shares: pen.shares });
    } catch (error) {
        console.error('Error sharing pen:', error);
        res.status(500).json({ error: error.message });
    }
});


router.post('/pennn/comment/:penId', async (req, res) => {
    try {
        // Get the pen ID from the URL
        const penId = req.params.penId;

        // Get the comment text from the request body
        const { comment: commentText } = req.body;

        // Retrieve the pen using the ID
        const pen = await Pen.findById(penId);
        if (!pen) {
            return res.status(404).json({ error: 'Pen not found' });
        }

        // Create a new Comment object
        const newComment = new Comment({
            text: commentText,
            date: new Date(),
        });

        // Save the new comment to the database
        await newComment.save();

        // Add the new comment ID to the pen's comments array
        pen.comments.push(newComment._id);
        await pen.save();

        // Respond with the newly added comment data
        res.json({ id: newComment._id, text: newComment.text, date: newComment.date });

    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Routes
router.get('/feedback', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.render('feedback', { feedbacks: feedbacks });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});


router.post('/feedback/add', async (req, res) => {
  const { name, email, mobile, gender, note } = req.body;
  const newFeedback = new Feedback({ name, email, mobile, gender, note });
  try {
    await newFeedback.save();
    res.redirect('/feedback');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
// Edit feedback - render edit form
router.get('/feedback/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).send('Feedback not found');
    }
    res.render('editFeedback', { feedback });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
// Update feedback
router.post('/feedback/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, gender, note } = req.body;
  try {
    await Feedback.findByIdAndUpdate(id, { name, email, mobile, gender, note });
    res.redirect('/feedback');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
// Delete feedback
router.post('/feedback/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Feedback.findByIdAndDelete(id);
    res.redirect('/feedback');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
router.get('/feedback/total', async (req, res) => {
    try {
        const totalFeedback = await Feedback.countDocuments();
        res.json({ totalFeedback });
    } catch (error) {
        console.error('Error fetching total feedback:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get total count and suggestion of usersignupad from the database
router.get('/usersignupad/total', async (req, res) => {
    try {
        const totalUsersignupad = await collection.countDocuments({
            'doctorInfo.licenseNumber': { $exists: false },
            'doctorInfo.category': { $exists: false },
            'doctorInfo.experience': { $exists: false }
        });
        let suggestion = 'usersignupad'; // Default suggestion
        if(totalUsersignupad === 0) {
            suggestion = 'usersignupad'; // If there are no usersignupad
        }
        res.json({ totalUsersignupad, suggestion });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Route to get total count and suggestion of expertsignupad from the database
router.get('/expertsignupad/total', async (req, res) => {
    try {
        const totalExpertSignupad = await collection.countDocuments({
            'doctorInfo.licenseNumber': { $exists: true },
         
        });
        let suggestion = 'expertsignupad'; // Default suggestion
        if(totalExpertSignupad === 0) {
            suggestion = 'expertsignupad'; // If there are no expertsignupad
        }
        res.json({ totalExpertSignupad, suggestion });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});











module.exports = router;