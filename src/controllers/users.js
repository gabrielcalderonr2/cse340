
import bcrypt from "bcrypt";
import {
  registerUser,
  findUserByEmail,
  getAllUsers,
} from "../models/users.js";

import { getVolunteerProjects } from "../models/volunteers.js";

// Display the registration form
export function showRegister(req, res) {
  res.render("register", { title: "Register" });
}

// Register a new user
export async function processRegister(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !password ||
      password.length < 7
    ) {
      req.flash(
        "error",
        "Enter your name, a valid email, and a password of at least 7 characters."
      );
      return res.redirect("/register");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
      req.flash("error", "An account with that email already exists.");
      return res.redirect("/register");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await registerUser(name.trim(), normalizedEmail, passwordHash);

    req.flash("success", "Registration successful. Please log in.");
    return res.redirect("/login");
  } catch (error) {
    return next(error);
  }
}

// Display the login form
export function showLogin(req, res) {
  res.render("login", { title: "Login" });
}

// Authenticate a user and create a session
export async function processLogin(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      req.flash("error", "Enter your email and password.");
      return res.redirect("/login");
    }

    const user = await findUserByEmail(email.trim().toLowerCase());

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/login");
    }

    req.session.regenerate((error) => {
      if (error) return next(error);

      req.session.user = {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role_name: user.role_name,
      };

      req.session.save((saveError) => {
        if (saveError) return next(saveError);
        return res.redirect("/dashboard");
      });
    });
  } catch (error) {
    return next(error);
  }
}

// Log out the current user
export function processLogout(req, res, next) {
  req.session.destroy((error) => {
    if (error) return next(error);

    res.clearCookie("connect.sid");
    return res.redirect("/");
  });
}

// Protect routes that require authentication
export function requireLogin(req, res, next) {
  if (!req.session.user) {
    req.flash("error", "You must be logged in to access that page.");
    return res.redirect("/login");
  }

  return next();
}

// Protect routes that require a specific role
export function requireRole(role) {
  return function (req, res, next) {
    if (!req.session.user) {
      req.flash("error", "Please log in to continue.");
      return res.redirect("/login");
    }

    if (req.session.user.role_name !== role) {
      req.flash("error", "You do not have permission to access that page.");
      return res.redirect("/dashboard");
    }

    return next();
  };
}

// Display the authenticated user's dashboard

export async function showDashboard(req, res, next) {
  try {
    const user = req.session.user;

    const volunteerProjects = await getVolunteerProjects(user.user_id);

    return res.render("dashboard", {
      title: "Dashboard",
      name: user.name,
      email: user.email,
      volunteerProjects,
    });
  } catch (error) {
    return next(error);
  }
}


// Display all registered users (administrators only)
export async function showUsers(req, res, next) {
  try {
    const users = await getAllUsers();

    return res.render("users", {
      title: "Registered Users",
      users,
    });
  } catch (error) {
    return next(error);
  }
}
