
const getTodo = async (req, res) => {
    try {
      const cacheKey = `quotes:user:${req.userId}`;

      const cached = await redisCache.get(cacheKey);
      if (cached) {
        return res.json({ source: 'cache', quotes: JSON.parse(cached) });
      }

      const quotes = await Quote.find({ userId: req.userId }).sort({ createdAt: -1 }).limit(50);

      await redisCache.set(cacheKey, JSON.stringify(quotes), 'EX', cacheTtlSeconds);

      res.json({ source: 'db', quotes });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

const addTodo = async((req, res) =>{
    try{

        const {}

    }catch(err){
        console.log(err)
    }
})

const updateTodo = async((req, res) =>{
    try{

        const {}

    }catch(err){
        console.log(err)
    }
})

const deleteTodo = async((req, res) =>{
    try{

        const {}

    }catch(err){
        console.log(err)
    }
})

module.exports =  {
    getTodo, addTodo, updateTodo, deleteTodo
}