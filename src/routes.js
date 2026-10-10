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

const router = express.Router();

router.get("/projects", showProjectsPage);

router.get("/organizations", showOrganizationsPage);

router.get("/project/:id", showProjectDetailsPage);

router.get("/organization/:id", showOrganizationDetailsPage);

router.get("/categories", showCategoriesPage);

router.get("/category/:id", showCategoryDetailsPage);

router.get("/new-category", showNewCategoryForm);

router.get("/edit-category/:id", showEditCategoryForm);

router.get("/edit-organization/:id", showEditOrganizationForm);

router.get("/new-project", showNewProjectForm);

router.get("/edit-project/:id", showEditProjectForm);

router.post(
    "/edit-project/:id",
    projectValidation,
    processEditProjectForm
);

router.post(
    "/new-project",
    projectValidation,
    processNewProjectForm
);

router.post(
    "/edit-organization/:id",
    organizationValidation,
    processEditOrganizationForm
);

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

router.get("/new-organization", showNewOrganizationForm);

router.post(
    "/new-organization",
    organizationValidation,
    processNewOrganizationForm
);

router.get(
    "/project/:id/assign-categories",
    showAssignCategoriesForm
);

router.post(
    "/project/:id/categories",
    processAssignCategoriesForm
);

export default router;