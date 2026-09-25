import { beforeAll, describe, expect,it } from "@jest/globals";
import request from "supertest"
import app from "../../index.js";



process.env.JWT_SECRET     = "test-secret-32-chars-minimum-length"
process.env.JWT_EXPIRES_IN = "1d"

let token = ""
let todoId = ""
let otherToken = ""



beforeAll(async () => {
    await request(app)
    .post("/api/auth/register")
    .send({name: "user1" , email: "user@gmail.com", password: "12345aM"})

    const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "user@gmail.com", password: "12345aM"})

    token = loginRes.body.token

    await request(app)
    .post("/api/auth/register")
    .send({name: "user2" , email: "user2@gmail.com", password: "12345aM"})

    const otherLoginRes = await request(app)
    .post("/api/auth/login")
    .send({ email: "user2@gmail.com", password: "12345aM"})

    otherToken = otherLoginRes.body.token



})



describe("GET /api/todo" , () => {


    it("returns 401 without token" , async () => {   
    const res = await request(app)
    .get("/api/todo")

     expect(res.status).toBe(401)
    })

    it("returns empty array when no todos", async () => {
        const res = await request(app)
        .get("/api/todo")
        .set("Authorization", `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty("todos")
        expect(Array.isArray(res.body.todos)).toBe(true)
    })
})



describe("POST /api/todo", () => {
    it("create todo successfully", async () => {
        const res = await request(app)
        .post("/api/todo")
        .set("Authorization", `Bearer ${token}`)
        .send({text: "New task"})

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty("message")

        todoId = res.body.todo.id
    })

    it("returns 422 on empty text" , async () => {
        const res = await request(app)
        .post("/api/todo")
        .set("Authorization", `Bearer ${token}`)
        .send({text: ""})

        expect(res.status).toBe(422)
        expect(res.body.errors[0].field).toBe("text")
    })


    it("returns 422 on text over 200 chars" , async () => {
       const longText = "a".repeat(201)
       
        const res = await request(app)
        .post("/api/todo")
        .set("Authorization", `Bearer ${token}`)
        .send({text: longText})

        expect(res.status).toBe(422)
        expect(res.body.errors[0].field).toBe("text")
    })


    it("returns 401 without token" , async () => {

        const res = await request(app)
        .post("/api/todo")
        .send({text: "New task"})

        expect(res.status).toBe(401)
      
    })




})



describe("PATCH /api/todo", () => { 

it("updates own todo" , async () => {


const res = await request(app)
.patch(`/api/todo/${todoId}`)
.set("Authorization", `Bearer ${token}`)
.send({text: "updated task"})


expect(res.status).toBe(200)
expect(res.body).toHaveProperty("message")



})


it("returns 403 on another user's todo" , async () => {


const res = await request(app)
.patch(`/api/todo/${todoId}`)
.set("Authorization", `Bearer ${otherToken}`)
.send({text: "updated task"})


expect(res.status).toBe(403)
expect(res.body).toHaveProperty("error")



})


it("returns 404 on non-existent id" , async () => {


const res = await request(app)
.patch(`/api/todo/123`)
.set("Authorization", `Bearer ${token}`)
.send({text: "updated task"})


expect(res.status).toBe(404)
expect(res.body).toHaveProperty("error")



})



})




describe("DELETE /api/todo/:id" , () => {



it("returns 403 on another user's todo" , async () => {


const res = await request(app)
.delete(`/api/todo/${todoId}`)
.set("Authorization", `Bearer ${otherToken}`)


expect(res.status).toBe(403)
expect(res.body).toHaveProperty("error")



})




  it("deletes own todo" , async () => {
    const res = await request(app)
    .delete(`/api/todo/${todoId}` )
    .set("Authorization" , `Bearer ${token}`)


    expect(res.status).toBe(200)

  })


  it("returns 404 on non-existent id" , async () => {


const res = await request(app)
.delete(`/api/todo/${todoId}`)
.set("Authorization", `Bearer ${token}`)



expect(res.status).toBe(404)
expect(res.body).toHaveProperty("error")



})

})