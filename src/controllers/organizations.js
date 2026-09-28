import {
    getAllOrganizations,
    getOrganizationDetails,
    getProjectsByOrganization
} from "../models/organizations.js";

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

export {
    showOrganizationsPage,
    showOrganizationDetailsPage
};