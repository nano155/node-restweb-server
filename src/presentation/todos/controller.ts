import { Request, Response } from "express";
import { prisma } from "../../data/postgresql";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dto";



export class TodosController {
  constructor() {}

  public getTodos = async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany()
    return res.json(todos);
  };

  public getTodosById = async (req: Request, res: Response) => {
    const id = +req.params.id;
    if (isNaN(id)) {
      return res.status(400).json({ error: `id is not a number` });
    }

    const todo = await prisma.todo.findUnique({
      where : {
        id:id
      }
    });

    (todo)
      ? res.json( todo )
      : res.status(404).json({ error: `TODO with id ${id} not found` });
  };

  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body)
    console.log(req.body);
    
    if(error) return res.status(400).json({ error })
    
    
      const todo = await prisma.todo.create({
        data: createTodoDto!
      })


    res.json(todo);
  };

  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [error, updateTodoDto] = UpdateTodoDto.create({ id,...req.body})
    if(error) return  res.status(400).json({ error });

    const todos = await prisma.todo.findUnique({
      where : {
        id:id
      }
    });
    if(!todos)

    return res.status(404).json({ error: `TODO with id ${id} not found` });

    
    const todo = await prisma.todo.update({
      where :{
        id:id
      },
      data: updateTodoDto!.values
    });

    if (!todo) {
      return res.status(404).json({ error: `TODO with id ${id} not found ` });
    }

    res.json(todo)
  };

  public deleteTodo = async (req:Request, res:Response) =>{
    const id = +req.params.id;
    if (isNaN(id)) {
      return res.status(400).json({ error: `id is not a number` });
    }
    const todos = await prisma.todo.findUnique({
      where : {
        id:id
      }
    });
    if(!todos)
    return res.status(404).json({ error: `TODO with id ${id} not found` });
    
    const todoEliminado = await prisma.todo.delete({
      where:{
        id:id
      }
    })

    res.json(todoEliminado)
  }
}
