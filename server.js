
import express from "express"
import { fileURLToPath } from "url"
import path from "path"
import { testConnection } from "./src/models/db.js"
import { getAllProjects } from "./src/models/projects.js"
import { getAllOrganizations } from "./src/models/organizations.js"


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
app.get("/", (req, res) => {
  const title = "Home"
  res.render("home", { title })
})

// Organizations route
app.get("/organizations", async (req, res) => {
  const organizations = await getAllOrganizations()
  const title = "Organizations"

  res.render("organizations", { title, organizations })
})

// Service Projects route
// Service Projects route
app.get("/projects", async (req, res) => {
  const projects = await getAllProjects()

  const title = "Service Projects"

  res.render("projects", { title, projects })
})

app.get("/categories", (req, res) => {
  const title = "Categories"
  res.render("categories", { title })
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
