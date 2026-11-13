const express =  require('express');
const router =  express.Router();
const todoController =  require('./controllers/todo');

router.post('/add-todo', todoController.Register);
router.get('/get-todos', todoController.Login);
router.put('/update-todo', todoController.Login);
router.delete('/delete-todo', todoController.Login);

export default router;