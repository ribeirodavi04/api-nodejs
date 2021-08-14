const express = require('express');
const bcrypt = require('bcryptjs');
const {sign, verify} = require('../setup/jwt');
const User = require('../models/users');

const router = express.Router();

const authMiddleware = async (req, res, next) => {
    const [, token] = req.headers.authorization.split(' ')
    console.log(req.headers.authorization)
    try {
      const payload = await jwt.verify(token)
      const user = await UserModel.findById(payload.user)
  
      if (!user) {
        return res.send(401)
      }
  
      req.auth = user
  
      next()
    } catch (error) {
      res.send(401, error)
    }
  }

router.post('/register', async(req, res)=>{
    
    const { email } = req.body;

    try{

        if(await User.findOne({ email })){
            return res.status(400).send({ error: 'User already exists' })
        }

        const result = await User.create(req.body);
        const { password, ...user} = result.toObject();

        const token = sign({ user: user._id})

        return res.send({ user, token });
    }catch(err){
        return res.status(400).send({ error: 'Registration failed' });
    }
});

router.get('/authenticate', async (req, res)=>{
    const [, hash] = req.headers.authorization.split(' ')
  const [email, password] = Buffer.from(hash, 'base64')
    .toString()
    .split(':')

    //const [email, password] = Buffer.from(hash, 'base64').toString().split(':')
    
    try{
        const user = await User.findOne({ email }).select('+password');
    
        if(!user){
            return res.status(400).send({ error: 'User not found' }); 
        }

        if(!await bcrypt.compare(password, user.password)){
            return res.status(400).send(password);
        }

        user.password = undefined;

        const token = sign({ id: user._id })

        res.send({ user, token });

    }catch (error){
        res.send(error)
    }

    

})

module.exports = app => app.use('/auth', router);