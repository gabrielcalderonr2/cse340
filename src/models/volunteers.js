
import db from './db.js';

// Add a user as a volunteer for a project
const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO project_volunteers (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
        RETURNING user_id, project_id;
    `;

    const result = await db.query(query, [userId, projectId]);

    return result.rows[0] || null;
};

// Remove a user's volunteer registration from a project
const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteers
        WHERE user_id = $1
          AND project_id = $2
        RETURNING user_id, project_id;
    `;

    const result = await db.query(query, [userId, projectId]);

    return result.rows[0] || null;
};

// Get all projects for which a user has volunteered
const getVolunteerProjects = async (userId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date,
            sp.organization_id,
            o.name AS organization_name,
            pv.signup_date
        FROM project_volunteers pv
        JOIN service_project sp
            ON pv.project_id = sp.project_id
        JOIN organization o
            ON sp.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY sp.project_date ASC;
    `;

    const result = await db.query(query, [userId]);

    return result.rows;
};

// Check whether a user has volunteered for a project
const isVolunteer = async (userId, projectId) => {
    const query = `
        SELECT 1
        FROM project_volunteers
        WHERE user_id = $1
          AND project_id = $2;
    `;

    const result = await db.query(query, [userId, projectId]);

    return result.rowCount > 0;
};

export {
    addVolunteer,
    removeVolunteer,
    getVolunteerProjects,
    isVolunteer
};
