const bcrypt = require('bcrypt');

const password = 'test123'; // הסיסמה שתרצה עבור המשתמש הבסיסי
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log('Hashed password:', hash);
});
