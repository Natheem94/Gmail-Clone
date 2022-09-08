const AesEncryption = require('aes-encryption');
const jwt = require('jsonwebtoken');

const aes = new AesEncryption()
aes.setSecretKey('11122233344455566677788822244455555555555555555231231321313aaaff')

let secretKey = 'asdfgert'

const aesEncryptPassword = async (password) => {
    return await aes.encrypt(password);
}
const aesDesryptPassword = async (password) => {
    return await aes.decrypt(password)
}

const CreateToken = async ({email})=>{
    return jwt.sign({ email }, secretKey, { expiresIn: '4m' });
}

const VerifyToken = async (token) => {
    let toggle;
    await jwt.verify(token, secretKey, (err, valid) => {
        if (err) {
            toggle = false;
        }
        else {
            toggle = true;
        }
    })
    return toggle;
}
module.exports = {aesEncryptPassword,aesDesryptPassword,CreateToken,VerifyToken}