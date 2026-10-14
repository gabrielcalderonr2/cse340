
import express from "express";
import session from "express-session";
import flash from "connect-flash";
import { fileURLToPath } from "url";
import path from "path";
import { testConnection } from "./src/models/db.js";
import routes from "./src/routes.js";

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "development";
const PORT = process.env.PORT || 3000;
const isProduction = NODE_ENV === "production";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configure EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Trust the proxy used by Render when running in production
if (isProduction) {
  app.set("trust proxy", 1);
}

// Configure sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "cse340-dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60
    }
  })
);

// Configure flash messages
app.use(flash());

// Share session data and flash messages with EJS views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.user = req.session.user || null;
  res.locals.isLoggedIn = Boolean(req.session.user);
  next();
});

// Routes
app.use(routes);

app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found"
  });
});

// 500 handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).render("500", {
    title: "Server Error"
  });
});

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Database connection successful`);
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});
