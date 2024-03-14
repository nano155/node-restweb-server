"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodosController = void 0;
const postgresql_1 = require("../../data/postgresql");
const dto_1 = require("../../domain/dto");
class TodosController {
    constructor() {
        this.getTodos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const todos = yield postgresql_1.prisma.todo.findMany();
            return res.json(todos);
        });
        this.getTodosById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            if (isNaN(id)) {
                return res.status(400).json({ error: `id is not a number` });
            }
            const todo = yield postgresql_1.prisma.todo.findUnique({
                where: {
                    id: id
                }
            });
            (todo)
                ? res.json(todo)
                : res.status(404).json({ error: `TODO with id ${id} not found` });
        });
        this.createTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [error, createTodoDto] = dto_1.CreateTodoDto.create(req.body);
            console.log(req.body);
            if (error)
                return res.status(400).json({ error });
            const todo = yield postgresql_1.prisma.todo.create({
                data: createTodoDto
            });
            res.json(todo);
        });
        this.updateTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            const [error, updateTodoDto] = dto_1.UpdateTodoDto.create(Object.assign({ id }, req.body));
            if (error)
                return res.status(400).json({ error });
            const todos = yield postgresql_1.prisma.todo.findUnique({
                where: {
                    id: id
                }
            });
            if (!todos)
                return res.status(404).json({ error: `TODO with id ${id} not found` });
            const todo = yield postgresql_1.prisma.todo.update({
                where: {
                    id: id
                },
                data: updateTodoDto.values
            });
            if (!todo) {
                return res.status(404).json({ error: `TODO with id ${id} not found ` });
            }
            res.json(todo);
        });
        this.deleteTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = +req.params.id;
            if (isNaN(id)) {
                return res.status(400).json({ error: `id is not a number` });
            }
            const todos = yield postgresql_1.prisma.todo.findUnique({
                where: {
                    id: id
                }
            });
            if (!todos)
                return res.status(404).json({ error: `TODO with id ${id} not found` });
            const todoEliminado = yield postgresql_1.prisma.todo.delete({
                where: {
                    id: id
                }
            });
            res.json(todoEliminado);
        });
    }
}
exports.TodosController = TodosController;
