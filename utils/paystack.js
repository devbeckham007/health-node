const axios = require('axios');


const payStack = axios.create({
    baseURL :'https://api.paystack.co/',
    headers:{
        authorization:`Bearer ${process.env.PAY_STACK_KEY}`,
        content_type:" application/json"
    }
});
module.exports =payStack
