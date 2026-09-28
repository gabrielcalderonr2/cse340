import express from "express"
import { fileURLToPath } from "url"
import path from "path"
import { testConnection } from "./src/models/db.js"
import routes from "./src/routes.js"

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "development"
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")))

// Configure EJS
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "src/views"))

// Routes
app.use(routes)

app.get("/", (req, res) => {
  const title = "Home"
  res.render("home", { title })
})

// 404 error handler
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found"
  })
})

// 500 error handler
app.use((err, req, res, next) => {
  console.error(err)

  res.status(500).render("500", {
    title: "Server Error"
  })
})

app.listen(PORT, async () => {
  try {
    await testConnection()
    console.log(`Server is running at http://127.0.0.1:${PORT}`)
    console.log(`Environment: ${NODE_ENV}`)
  } catch (error) {
    console.error("Error connecting to the database:", error)
  }
})