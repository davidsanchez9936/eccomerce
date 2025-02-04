const User = require("../models/user.js")

exports.createOrUpdateUser = async (req, res) => {
  const {
    name,
    picture,
    email
  } = req.user;

  const user = await User.findOneAndUpdate({
    email
  }, {
    name: email.split("@")[0],
    picture
  }, {
    new: true
  })

  if (user) {
    res.json(user)
    console.log("User Updated", user)
  } else {
    const newUser = await new User({
      email,
      name: email.split("@")[0],
      picture
    }).save()
    console.log("USER CREATED", user)
    res.json(newUser)
  }
}

exports.currentUser = async (req, res) => {
  User.findOne({
    email: req.user.email
  }).then((user) => {
    res.json(user)
  }).catch((err) => {
    throw new Error(err)
  })
}





/* Firease User In Authcheck {
  iss: 'https://securetoken.google.com/eccomerce-e2b86',  
  aud: 'eccomerce-e2b86',    
  auth_time: 1713480543,     
  user_id: 'V8wvZIYLziMaBz3YuehZizoDsWL2',
  sub: 'V8wvZIYLziMaBz3YuehZizoDsWL2',
  iat: 1713480543,
  exp: 1713484143,
  email: 'andsuarez.3021@gmail.com',
  email_verified: true,
  firebase: { identities: { email: [Array] }, sign_in_provider: 'password' },
  uid: 'V8wvZIYLziMaBz3YuehZizoDsWL2'
} */

/* exports.createOrUpdateUser = async (req, res) => {
    const { name, picture, email } = req.user;
    const { name: nameFromBody } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { name: nameFromBody, picture },
      { new: true }
    );
  
    if (user) {
      const { _id, role } = user;
      res.json({ _id, role, email: user.email, name: user.name }); // Enviar _id, role, email y name en la respuesta
      console.log("User Updated", user);
    } else {
      const newUser = await new User({ email, name: nameFromBody, picture }).save();
      const { _id, role } = newUser;
      res.json({ _id, role, email: newUser.email, name: newUser.name }); // Enviar _id, role, email y name en la respuesta
      console.log("USER CREATED", newUser);
    }
  }; */