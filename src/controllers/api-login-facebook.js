const axios = require('axios');
const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
class APILoginFacebook{
    
    async loginFacebook(req , res){
        const {accessToken } = req.body;
        try {
            const res = axios.get(`https://graph.facebook.com/v12.0/me?fields=id,name,email&access_token=${accessToken}`)
            const { id, name, email } = response.data;
            const customToken = await admin.auth().createCustomToken(id);
            res.status(200).json({ token: customToken });
            
        } catch (error) {
            console.log(error)
            
        }
    }

    
}
module.exports =  new APILoginFacebook;