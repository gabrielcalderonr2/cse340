import {
    getAllOrganizations,
    getOrganizationDetails,
    getProjectsByOrganization,
    createOrganization,
    updateOrganization
} from "../models/organizations.js";

import { body, validationResult } from "express-validator";


const organizationValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Organization name is required.")
        .isLength({ max: 150 })
        .withMessage("Organization name cannot exceed 150 characters."),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required."),

    body("contact_email")
        .trim()
        .notEmpty()
        .withMessage("Contact email is required.")
        .isEmail()
        .withMessage("Enter a valid email address.")
        .isLength({ max: 255 })
        .withMessage("Contact email cannot exceed 255 characters."),

    body("logo_filename")
        .trim()
        .notEmpty()
        .withMessage("Logo filename is required.")
        .isLength({ max: 255 })
        .withMessage("Logo filename cannot exceed 255 characters.")
];


const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();

    const title = "Partner Organizations";

    res.render("organizations", {
        title,
        organizations
    });
};

const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;

    const organization = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganization(organizationId);

    const title = "Organization Details";

    res.render("organization", {
        title,
        organization,
        projects
    });
};


const showNewOrganizationForm = async (req, res) => {
    const title = "Create New Organization";

    res.render("new-organization", {
        title
    });
};

const processNewOrganizationForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("error", errors.array()[0].msg);
        return res.redirect("/new-organization");
    }

    const {
        name,
        description,
        contact_email,
        logo_filename
    } = req.body;

    try {
        await createOrganization(
            name,
            description,
            contact_email,
            logo_filename
        );

        req.flash("success", "Organization created successfully.");
        return res.redirect("/organizations");
    } catch (error) {
        console.error("Error creating organization:", error);
        req.flash("error", "There was an error creating the organization.");
        return res.redirect("/new-organization");
    }
};


const showEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const organization = await getOrganizationDetails(organizationId);

    if (!organization) {
        req.flash("error", "Organization not found.");
        return res.redirect("/organizations");
    }

    const title = "Edit Organization";

    res.render("edit-organization", {
        title,
        organization
    });
};

const processEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash("error", errors.array()[0].msg);
        return res.redirect(`/edit-organization/${organizationId}`);
    }

    const {
        name,
        description,
        contact_email,
        logo_filename
    } = req.body;

    try {
        const updatedOrganization = await updateOrganization(
            organizationId,
            name,
            description,
            contact_email,
            logo_filename
        );

        if (!updatedOrganization) {
            req.flash("error", "Organization not found.");
            return res.redirect("/organizations");
        }

        req.flash("success", "Organization updated successfully.");
        return res.redirect(`/organization/${organizationId}`);
    } catch (error) {
        console.error("Error updating organization:", error);
        req.flash("error", "There was an error updating the organization.");
        return res.redirect(`/edit-organization/${organizationId}`);
    }
};


export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
};