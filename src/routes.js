import express from "express";

import {
    showProjectsPage,
    showProjectDetailsPage
} from "./controllers/projects.js";

import {
    showOrganizationsPage,
    showOrganizationDetailsPage
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

const router = express.Router();

router.get("/projects", showProjectsPage);

router.get("/organizations", showOrganizationsPage);

router.get("/project/:id", showProjectDetailsPage);

router.get("/organization/:id", showOrganizationDetailsPage);

router.get("/categories", showCategoriesPage);

router.get("/category/:id", showCategoryDetailsPage);

router.get("/new-category", showNewCategoryForm);

router.get("/edit-category/:id", showEditCategoryForm);

router.post(
    "/edit-category/:id",
    categoryValidation,
    processEditCategoryForm
);

router.post(
    "/new-category",
    categoryValidation,
    processNewCategoryForm
);

export default router;