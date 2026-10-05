import { body, validationResult } from "express-validator";

import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategory,
    createCategory,
    updateCategory
} from "../models/categories.js";

const categoryValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required.")
        .isLength({ min: 3, max: 100 })
        .withMessage("Category name must be between 3 and 100 characters.")
];

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();

    const title = "Categories";

    res.render("categories", {
        title,
        categories
    });
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;

    const category = await getCategoryDetails(categoryId);
    const projects = await getProjectsByCategory(categoryId);

    const title = "Category Details";

    res.render("category", {
        title,
        category,
        projects
    });
};

const showNewCategoryForm = async (req, res) => {
    const title = "New Category";

    res.render("new-category", {
        title
    });
};

const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;

    const category = await getCategoryDetails(categoryId);

    const title = "Edit Category";

    res.render("edit-category", {
        title,
        category
    });
};

const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("error", errors.array()[0].msg);
        return res.redirect(`/edit-category/${categoryId}`);
    }

    const { name } = req.body;

    try {
        await updateCategory(categoryId, name);

        req.flash("success", "Category updated successfully.");

        res.redirect("/categories");
    } catch (error) {
        
        req.flash("error", "There was an error updating the category.");
        res.redirect(`/edit-category/${categoryId}`);
    }
};

const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("error", errors.array()[0].msg);
        return res.redirect("/new-category");
    }

    const { name } = req.body;

    try {
        await createCategory(name);

        req.flash("success", "Category created successfully.");

        res.redirect("/categories");
    } catch (error) {
        req.flash("error", "There was an error creating the category.");
        res.redirect("/new-category");
    }
};



export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
};