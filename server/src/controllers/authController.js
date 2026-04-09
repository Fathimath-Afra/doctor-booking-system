const supabase = require('../config/supabase');


const signup = async (req, res) => {
    const { email, password, full_name, role } = req.body;

    
    if (!email || !password || !full_name || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        //  Call Supabase Auth
        //  SQL trigger in Supabase will catch these and put them in the 'profiles' table automatically!
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: full_name,
                    role: role,
                },
            },
        });

        if (error) throw error;

        res.status(201).json({
            message: "User registered successfully. Please check your email for verification.",
            user: data.user,
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;

        res.status(200).json({
            message: "Login successful",
            session: data.session, // This contains the Access Token (JWT)
            user: data.user
        });

    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

module.exports = { signup, login };