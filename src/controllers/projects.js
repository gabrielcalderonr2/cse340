import {
    getUpcomingProjects,
    getProjectDetails,
    createProject,
    updateProject
} from "../models/projects.js";

import {
    getCategoriesByProject,
    updateProjectCategories,
    getAllCategories
} from "../models/categories.js";

import {
    getAllOrganizations
} from "../models/organizations.js";

import { body, validationResult } from "express-validator";

const NUMBER_OF_UPCOMING_PROJECTS = 5;


const projectValidation = [
    body("organization_id")
        .notEmpty()
        .withMessage("Organization is required.")
        .isInt({ min: 1 })
        .withMessage("Select a valid organization."),

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Project title is required.")
        .isLength({ max: 150 })
        .withMessage("Project title cannot exceed 150 characters."),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required."),

    body("location")
        .trim()
        .notEmpty()
        .withMessage("Location is required.")
        .isLength({ max: 150 })
        .withMessage("Location cannot exceed 150 characters."),

    body("project_date")
        .notEmpty()
        .withMessage("Project date is required.")
        .isISO8601()
        .withMessage("Enter a valid project date.")
];


const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);

    const title = "Upcoming Service Projects";

    res.render("projects", { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);
    const categories = await getCategoriesByProject(projectId);

    const title = "Service Project Details";

    res.render("project", {
        title,
        project,
        categories
    });
};


const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = "Create New Service Project";

    res.render("new-project", {
        title,
        organizations
    });
};

const processNewProjectForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("error", errors.array()[0].msg);
        return res.redirect("/new-project");
    }

    const {
        organization_id,
        title,
        description,
        location,
        project_date
    } = req.body;

    try {
        await createProject(
            organization_id,
            title,
            description,
            location,
            project_date
        );

        req.flash("success", "Service project created successfully.");
        return res.redirect("/projects");
    } catch (error) {
        console.error("Error creating service project:", error);
        req.flash("error", "There was an error creating the service project.");
        return res.redirect("/new-project");
    }
};


const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);

    if (!project) {
        req.flash("error", "Service project not found.");
        return res.redirect("/projects");
    }

    const organizations = await getAllOrganizations();
    const title = "Edit Service Project";

    res.render("edit-project", {
        title,
        project,
        organizations
    });
};

const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("error", errors.array()[0].msg);
        return res.redirect(`/edit-project/${projectId}`);
    }

    const {
        organization_id,
        title,
        description,
        location,
        project_date
    } = req.body;

    try {
        const updatedProject = await updateProject(
            projectId,
            organization_id,
            title,
            description,
            location,
            project_date
        );

        if (!updatedProject) {
            req.flash("error", "Service project not found.");
            return res.redirect("/projects");
        }

        req.flash("success", "Service project updated successfully.");
        return res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error("Error updating service project:", error);
        req.flash("error", "There was an error updating the service project.");
        return res.redirect(`/edit-project/${projectId}`);
    }
};


const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);

    if (!project) {
        req.flash("error", "Service project not found.");
        return res.redirect("/projects");
    }

    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProject(projectId);

    const assignedCategoryIds = assignedCategories.map(
        category => Number(category.category_id)
    );

    const title = "Assign Categories";

    res.render("assign-categories", {
        title,
        project,
        categories,
        assignedCategoryIds
    });
};


const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.id;

    const rawCategoryIds = req.body.category_ids;
    const categoryIds = rawCategoryIds
        ? (Array.isArray(rawCategoryIds) ? rawCategoryIds : [rawCategoryIds])
            .map(Number)
        : [];

    if (
        categoryIds.some(
            id => !Number.isInteger(id) || id < 1
        )
    ) {
        req.flash("error", "One or more categories are invalid.");
        return res.redirect(`/project/${projectId}/assign-categories`);
    }

    try {
        const project = await getProjectDetails(projectId);

        if (!project) {
            req.flash("error", "Service project not found.");
            return res.redirect("/projects");
        }

        await updateProjectCategories(projectId, categoryIds);

        req.flash("success", "Project categories updated successfully.");
        return res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error("Error updating project categories:", error);
        req.flash("error", "There was an error updating project categories.");
        return res.redirect(`/project/${projectId}/assign-categories`);
    }
};


export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    projectValidation
};