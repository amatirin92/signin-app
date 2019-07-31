const express = require('express');
const router = express.Router();

router.get('/signin',(req,res)=>{
    res.status(200).render('signIn')
})

router.get('/signup', (req,res)=>{
    res.status(200).render('signUp')
})

module.exports = router