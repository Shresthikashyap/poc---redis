const express =  require('express');
const mongoose = require('mongoose');
const cors =  require('cors');
const Todo =  require('./models/todo')
const { createRedisClient } = require('./redisClient');

async function initializeExpressServer() {
  // initialize an Express application
  const app = express();
  app.use(cors());
  app.use(express.json());

  // connect to Redis
  const redisClient = await createRedisClient();

  app.get("/api/get-todos", async(req, res)=>{
    try{
        const cachedTodos = await redisClient.get('todos');

        if(!cachedTodos){
            console.log('no todos in the redis cache');
        }else{
            return res.status(201).json(cachedTodos);
        }

        const todos = await Todo.find({});
        
        const todoData = { name: 'new todo', text: 'testing new todo' };
        await redisClient.set('todos', JSON.stringify(todoData));
                
        if(!todos){
            return res.status(201).json({message:'no todos'});
        }
        res.status(201).json(JSON.parse(todos));
    }
    catch(err){
        console.log(err);
    }
  });

  app.post("/api/add-todo", async(req, res)=>{

    try{
        const{name, text} = req.body;

        const todo = new Todo({name, text});
        await todo.save();

        const allTodos = await Todo.find({});
        
        await redisClient.set('todos', JSON.stringify(allTodos));
                
        res.status(201).json({message: 'added successfully'});
    }
    catch(err){
        console.log(err);
    }
  });

    app.put("/api/update-todo/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, text } = req.body;

        const updatedTodo = await Todo.findByIdAndUpdate(
        id,
        { name, text },
        { new: true }
        );

        if (!updatedTodo) {
        return res.status(404).json({ message: "Todo not found" });
        }

        const allTodos = await Todo.find({});

        // const formattedTodos = allTodos.map(todo => ({
        // id: todo._id,
        // title: todo.name,
        // description: todo.text
        // }));

        // 4. Update the Redis cache with the newly structured list
        await redisClient.set("todos", JSON.stringify(allTodos));

        // 5. Respond with the single formatted updated item (or the full list)
        return res.status(200).json({
        message: "Todo updated successfully",
        // todo: {
        //     id: updatedTodo._id,
        //     title: updatedTodo.name,
        //     descri
        // ption: updatedTodo.text
        // }
        });

    } catch (error) {
        console.error("Error updating todo:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
    });

    app.delete("/api/delete-todo/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find and delete the document in MongoDB by its ID
    const deletedTodo = await Todo.findByIdAndDelete(id);

    // If the todo doesn't exist, return a 404
    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    // 2. Fetch the remaining items from MongoDB to sync the cache
    const remainingTodos = await Todo.find({});

    // 3. Format the list to match your clean structure (id, title, description)
    const formattedTodos = remainingTodos.map(todo => ({
      id: todo._id,
      title: todo.name,
      description: todo.text
    }));

    // 4. Update the Redis cache with the newly structured list
    await redisClient.set("todos", JSON.stringify(formattedTodos));

    // 5. Respond with a confirmation and the deleted item details
    return res.status(200).json({
      message: "Todo deleted successfully",
      deletedTodo: {
        id: deletedTodo._id,
        title: deletedTodo.name,
        description: deletedTodo.text
      }
    });

  } catch (error) {
    console.error("Error deleting todo:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



  // start the server
  const port = 3000;
  app.listen(port, async() => {
    console.log(`Server is running on http://localhost:${port}`);
      try {
        await mongoose.connect('mongodb://127.0.0.1:27017/todos');
        console.log("Connected to MongoDB successfully!");
      } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); 
      }
  });
}

initializeExpressServer()
  .then()
  .catch((e) => console.error(e));
