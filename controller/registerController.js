const User     = require('../model/user');
const bcrypt   = require('bcryptjs');

const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate
    if (!username || !email || !password || !role) {
      return res.render('register', {
        error: 'All fields are required',
        formData: { username, email, role },
      });
    }

    // Check duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.render('register', {
        error: 'An account with that email already exists',
        formData: { username, email, role },
      });
    }

    // Hash & save
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashPassword, role });
    await newUser.save();

    console.log('Saved user:', newUser);
if (role === 'doctor') {
      return res.redirect(`/register/doctor/${newUser._id}`);
    }

    return res.redirect('/login');

  } catch (error) {
    console.error('Error registering user:', error);
    res.render('register', { error: 'Server error. Please try again.' });
  }
};

module.exports = { registerUser };
