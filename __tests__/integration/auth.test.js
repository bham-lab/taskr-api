
import { afterAll, beforeAll, describe, expect,it } from "@jest/globals"

import fs from "fs/promises"
import request from "supertest"
import path from "path"
import { fileURLToPath } from "url"



process.env.JWT_SECRET     = "test-secret-32-chars-minimum-length"
process.env.JWT_EXPIRES_IN = "1d"
process.env.NODE_ENV       = "test"

import app from "../../index.js"



const __dirname  = path.dirname(fileURLToPath(import.meta.url))
const TEST_DB    = path.join(__dirname, "../../data/users.test.json")


let token = ""

beforeAll(async () => {
    await fs.writeFile(TEST_DB, '[]')
})

afterAll(async () => {
    await fs.writeFile(TEST_DB , "[]")
})



describe("POST /api/auth/register" ,() => {

    it("creates a new user and returns a token", async () => {
        const res = await request(app)
        .post("/api/auth/register")
        .send({name: "user1" , email: "user@gmail.com", password: "12345aM"})

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty("token")
        expect(res.body.user).toHaveProperty("id")
        expect(res.body.user.name).toBe("user1")
        expect(res.body.user).not.toHaveProperty("password")

        token = res.body.token
    })


    it("returns 409 when email is already registered", async () => {
           const res = await  request(app)
        .post("/api/auth/register")
        .send({name: "user2" , email: "user@gmail.com", password: "12345aM"})


        expect(res.status).toBe(409)
        expect(res.body).toHaveProperty("error")
   
    })

    it("returns 422 when name missing" , async () => {
          const res = await request(app)
        .post("/api/auth/register")
        .send({ email: "user2@gmail.com", password: "12345aM"})


        expect(res.status).toBe(422)
       
        expect(res.body.errors[0].field).toBe("name")
    })


    it("returns 422 when password is too weak", async () => {
          const res = await request(app)
        .post("/api/auth/register")
        .send({name: "user1" , email: "user3@gmail.com", password: "12345a"})
         
    expect(res.status).toBe(422)
    expect(res.body).toHaveProperty("error")
    expect(res.body.errors[0].field).toBe("password")
   
   
    })

})




describe("POST /api/auth/login", () => {

it("returns a token for valid credential" , async () => {


      const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "user@gmail.com", password: "12345aM"})


    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("token")
})

it("returns 401 when password is wrong" , async () => {

     const res = await request(app)
   .post("/api/auth/login")
   .send({ email: "user@gmail.com", password: "12345a"})

   expect(res.status).toBe(401)
   expect(res.body.error).not.toContain("password")



})

it("returns 401 on unknown email" , async () => {

      const res = await request(app)
   .post("/api/auth/login")
   .send({ email: "unknown@gmail.com", password: "12345a"})

   expect(res.status).toBe(401)
   expect(res.body.error).not.toContain("email")



})


})


describe("GET /api/auth/me" , () => {
    it("returns user when authenticated" , async () => {
        const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`)
      

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty("user")
        expect(res.body.user.name).toBe("user1")
    })
    it("returns 401 without token" , async () => {
        const res = await request(app)
        .get("/api/auth/me")
    

        expect(res.status).toBe(401)
    })
})