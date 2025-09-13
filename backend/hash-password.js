import bcrypt from 'bcryptjs';

const plainPassword = 'password123';
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
    if (err) {
        console.error("Error hashing password:", err);
    } else {
        console.log("Copy this hashed password into your seeder.json file:");
        console.log(hash);
    }
});
