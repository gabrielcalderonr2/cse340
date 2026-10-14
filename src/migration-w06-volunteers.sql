CREATE TABLE IF NOT EXISTS project_volunteers (
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    signup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT project_volunteers_pkey
        PRIMARY KEY (user_id, project_id),

    CONSTRAINT fk_volunteer_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_volunteer_project
        FOREIGN KEY (project_id)
        REFERENCES service_project(project_id)
        ON DELETE CASCADE
);
