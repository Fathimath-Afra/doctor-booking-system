const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectRedis } = require('./src/config/redis');
const supabase = require('./src/config/supabase');

const app = express();


app.use(cors());
app.use(express.json());


app.get('/test', (req, res) => {
    res.send("Server is running!");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    
    await connectRedis();

    
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    if (error) {
        console.log("❌ Supabase Connection Error:", error.message);
    } else {
        console.log("✅ Supabase Connected!");
    }

    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
};

startServer();