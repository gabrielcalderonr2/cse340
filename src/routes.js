
import express from "express";

import {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    projectValidation
} from "./controllers/projects.js";

import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
} from "./controllers/organizations.js";

import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
} from "./controllers/categories.js";

import {
    showRegister,
    processRegister,
    showLogin,
    processLogin,
    processLogout,
    showDashboard,
    showUsers,
    requireLogin,
    requireRole
} from "./controllers/users.js";

const router = express.Router();

// ========================================
// Authentication Routes
// ========================================

router.get("/register", showRegister);
router.post("/register", processRegister);

router.get("/login", showLogin);
router.post("/login", processLogin);

router.post("/logout", processLogout);

// ========================================
// Dashboard and User Administration
// ========================================

router.get("/dashboard", requireLogin, showDashboard);

router.get(
    "/users",
    requireLogin,
    requireRole("admin"),
    showUsers
);

// ========================================
// Public Project Routes
// ========================================

router.get("/projects", showProjectsPage);

router.get("/project/:id", showProjectDetailsPage);

// ========================================
// Protected Project Routes (Admin Only)
// ========================================

router.get(
    "/new-project",
    requireLogin,
    requireRole("admin"),
    showNewProjectForm
);

router.post(
    "/new-project",
    requireLogin,
    requireRole("admin"),
    projectValidation,
    processNewProjectForm
);

router.get(
    "/edit-project/:id",
    requireLogin,
    requireRole("admin"),
    showEditProjectForm
);

router.post(
    "/edit-project/:id",
    requireLogin,
    requireRole("admin"),
    projectValidation,
    processEditProjectForm
);

router.get(
    "/project/:id/assign-categories",
    requireLogin,
    requireRole("admin"),
    showAssignCategoriesForm
);

router.post(
    "/project/:id/categories",
    requireLogin,
    requireRole("admin"),
    processAssignCategoriesForm
);

// ========================================
// Public Organization Routes
// ========================================

router.get("/organizations", showOrganizationsPage);

router.get("/organization/:id", showOrganizationDetailsPage);

// ========================================
// Protected Organization Routes (Admin Only)
// ========================================

router.get(
    "/new-organization",
    requireLogin,
    requireRole("admin"),
    showNewOrganizationForm
);

router.post(
    "/new-organization",
    requireLogin,
    requireRole("admin"),
    organizationValidation,
    processNewOrganizationForm
);

router.get(
    "/edit-organization/:id",
    requireLogin,
    requireRole("admin"),
    showEditOrganizationForm
);

router.post(
    "/edit-organization/:id",
    requireLogin,
    requireRole("admin"),
    organizationValidation,
    processEditOrganizationForm
);

// ========================================
// Public Category Routes
// ========================================

router.get("/categories", showCategoriesPage);

router.get("/category/:id", showCategoryDetailsPage);

// ========================================
// Protected Category Routes (Admin Only)
// ========================================

router.get(
    "/new-category",
    requireLogin,
    requireRole("admin"),
    showNewCategoryForm
);

router.post(
    "/new-category",
    requireLogin,
    requireRole("admin"),
    categoryValidation,
    processNewCategoryForm
);

router.get(
    "/edit-category/:id",
    requireLogin,
    requireRole("admin"),
    showEditCategoryForm
);

router.post(
    "/edit-category/:id",
    requireLogin,
    requireRole("admin"),
    categoryValidation,
    processEditCategoryForm
);

export default router;
