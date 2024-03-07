import { Request, Response } from "express";

let todos = [
  { id: 1, text: "Buy milk", createdAt: new Date() },
  { id: 2, text: "Buy bread", createdAt: null },
  { id: 3, text: "Buy butter", createdAt: new Date() },
];

export class TodosController {
  constructor() {}

  public getTodos = (req: Request, res: Response) => {
    return res.json(todos);
  };

  public getTodosById = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      return res.status(400).json({ error: `id is not a number` });
    }

    const todo = todos.find((todo) => todo.id === id);

    todo
      ? res.json({ todo })
      : res.status(404).json({ error: `TODO with id ${id} not found` });
  };

  public createTodo = (req: Request, res: Response) => {
    const { text } = req.body;
    if (!text)
      return res.status(400).json({ error: "Text property is required" });

    const newTodo = {
      id: todos.length + 1,
      text: text,
      createdAt: null,
    };
    todos.push(newTodo);

    res.json(newTodo);
  };

  public updateTodo = (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      return res.status(400).json({ error: `id is not a number` });
    }
    const todo = todos.find((todo) => todo.id === id);
    
    if (!todo) {
      return res.status(404).json({ error: `TODO with id ${id} not found ` });
    }

    const { text, createdAt } = req.body

    todo.text = text || todo.text;
    (createdAt === null)
    ?todo.createdAt = null
    :todo.createdAt = new Date(createdAt || todo.createdAt)

    res.json(todo)
  };

  public deleteTodo = (req:Request, res:Response) =>{
    const id = +req.params.id;
    if (isNaN(id)) {
      return res.status(400).json({ error: `id is not a number` });
    }
    
    const todoEliminado = todos.filter(todo => todo.id === id)
    const todo = todos.filter(todo => todo.id !== id)

    
    if(todoEliminado.length === 0) return res.status(404).json({ error: `TODO with id ${id} not found ` })

    if (!todo) {
      return res.status(404).json({ error: `TODO with id ${id} not found ` });
    }
    todos = todo
    res.json(todoEliminado)
  }
}
