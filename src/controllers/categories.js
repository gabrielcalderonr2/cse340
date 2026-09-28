import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategory
} from "../models/categories.js";

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

export {
    showCategoriesPage,
    showCategoryDetailsPage
};