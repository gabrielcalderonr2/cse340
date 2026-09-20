
-- ========================================
-- Organization Table
-- ========================================

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================

INSERT INTO organization (
    name,
    description,
    contact_email,
    logo_filename
)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);

-- ========================================
-- Service Projects Table
-- ========================================

CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    project_date DATE NOT NULL,

    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
);

-- ========================================
-- Insert sample data: Service Projects
-- ========================================

INSERT INTO service_project (
    organization_id,
    title,
    description,
    location,
    project_date
)
VALUES
-- BrightFuture Builders
(1, 'Community Park Renovation',
 'Help renovate a local community park.',
 'Quito, Ecuador', '2026-10-10'),

(1, 'School Building Repairs',
 'Assist with basic repairs at a local school.',
 'Conocoto, Ecuador', '2026-10-15'),

(1, 'Community Center Painting',
 'Paint and improve a neighborhood community center.',
 'Sangolqui, Ecuador', '2026-10-20'),

(1, 'Accessible Sidewalk Project',
 'Improve sidewalks to make them safer for pedestrians.',
 'Quito, Ecuador', '2026-10-25'),

(1, 'Community Garden Construction',
 'Build garden beds for a neighborhood community.',
 'Conocoto, Ecuador', '2026-11-01'),

-- GreenHarvest Growers
(2, 'Urban Garden Planting',
 'Plant vegetables in a shared urban garden.',
 'Quito, Ecuador', '2026-10-12'),

(2, 'Community Composting',
 'Help create a composting area for local residents.',
 'Conocoto, Ecuador', '2026-10-18'),

(2, 'Sustainable Farming Workshop',
 'Support a workshop about sustainable agriculture.',
 'Sangolqui, Ecuador', '2026-10-22'),

(2, 'Neighborhood Tree Planting',
 'Plant trees to improve neighborhood green spaces.',
 'Quito, Ecuador', '2026-10-28'),

(2, 'Food Donation Harvest',
 'Harvest fresh vegetables for local food donations.',
 'Conocoto, Ecuador', '2026-11-05'),

-- UnityServe Volunteers
(3, 'Food Bank Volunteer Day',
 'Organize food donations and assist the local food bank.',
 'Quito, Ecuador', '2026-10-11'),

(3, 'Elderly Community Support',
 'Help provide assistance to elderly community members.',
 'Sangolqui, Ecuador', '2026-10-16'),

(3, 'Neighborhood Cleanup',
 'Collect litter and clean public spaces.',
 'Conocoto, Ecuador', '2026-10-21'),

(3, 'Clothing Donation Drive',
 'Sort and distribute donated clothing.',
 'Quito, Ecuador', '2026-10-27'),

(3, 'Community Volunteer Fair',
 'Help organize a fair to connect volunteers with local causes.',
 'Sangolqui, Ecuador', '2026-11-03');
