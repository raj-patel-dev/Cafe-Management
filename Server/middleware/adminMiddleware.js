const adminMiddelware = (req,res,next) => {
    if(req.user.role !=="admin") {
        return res.status(403).json({
            succes:false,
            message:"Access Denied"
        });
    }
    next();
}
module.exports = adminMiddelware;