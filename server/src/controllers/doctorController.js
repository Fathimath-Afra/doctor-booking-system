const supabase = require('../config/supabase');
const { redisClient } = require('../config/redis');


const getAllDoctors = async (req, res) => {
    const cacheKey = 'doctors:all';

    try {
        //  getting data from Redis
        const cachedDoctors = await redisClient.get(cacheKey);

        if (cachedDoctors) {
            console.log(" Serving from Redis Cache");
            return res.status(200).json(JSON.parse(cachedDoctors));
        }

        // 2. If not in Redis, fetch from Supabase
        console.log(" Cache Missing - Fetching from Supabase");
        // We join 'doctors' with 'profiles' to get the full_name
        const { data: doctors, error } = await supabase
            .from('doctors')
            .select(`
                id,
                specialization,
                bio,
                hourly_rate,
                profiles (full_name, avatar_url)
            `);

        if (error) throw error;

        // 3. Save the result to Redis for 1 hour
        await redisClient.set(cacheKey, JSON.stringify(doctors), {
            EX: 3600
        });

        res.status(200).json(doctors);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getDoctorById = async (req, res) => {
    const { id } = req.params;
    const cacheKey = `doctor:${id}`;

    try {
        const cachedDoctor = await redisClient.get(cacheKey);
        if (cachedDoctor) return res.status(200).json(JSON.parse(cachedDoctor));

        const { data: doctor, error } = await supabase
            .from('doctors')
            .select('*, profiles(full_name)')
            .eq('id', id)
            .single();

        if (error || !doctor) return res.status(404).json({ message: "Doctor not found" });

        await redisClient.set(cacheKey, JSON.stringify(doctor), { EX: 3600 });
        res.status(200).json(doctor);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllDoctors, getDoctorById };