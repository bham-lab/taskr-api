import pg from "pg"



const { Pool } = pg

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "1234",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})


pool.on("error", (err) => {
    console.error("Unexpected DB pool error:", err.message)
})



export const query = (text, params) => pool.query(text, params)


export const getClient = async () => {
    const client = await pool.connect()

    const release = client.release.bind(client)

    const timeout = setTimeout(() => {
        console.error("Client checked out for too long!")
        release()
    }, 5000)

    client.release = () => {
        clearTimeout(timeout)
        release()
    }
    return client
}


export default pool
