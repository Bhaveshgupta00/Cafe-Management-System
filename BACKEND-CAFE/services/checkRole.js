require('dotenv').config();

function checkRole(req,res,next){
    console.log("Role check is happeining...");
    if(res.locals.role == process.env.USER)
        res.sendStatus(401)
    else
    next()
}

module.exports = { checkRole: checkRole }