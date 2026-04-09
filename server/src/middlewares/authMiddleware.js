const supabase = require('../config/supabase');

const authenticateUser = async (req, res, next) => {
    let token = req.headers.authorization.split(' ')[1];;

    
    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }

    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            

            // 2.  Supabase to verify  token
            const { data: { user }, error } = await supabase.auth.getUser(token);

            if (error || !user) {
                return res.status(401).json({ message: "Not authorized, token failed" });
            }

            
            req.user = user;
            next();

        } catch (error) {
            res.status(401).json({ message: "Not authorized" });
            console.log("authentication failed");
        }
    }

};

module.exports = { authenticateUser };