import bcrypt from 'bcrypt';
import crypto from 'crypto';

async function encryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
}

function generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
}

export {
    encryptPassword,
    generateVerificationToken
}