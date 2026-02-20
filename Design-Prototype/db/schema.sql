-- 1. User 
CREATE TABLE User (
    user_id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. HomeStyle 
CREATE TABLE HomeStyle (
    style_id UUID PRIMARY KEY,
    style_name VARCHAR(255) UNIQUE NOT NULL,
    image_url VARCHAR(255),
    sort_order INT
);

-- 3. SavingsGoal 
CREATE TABLE SavingsGoal (
    goal_id UUID PRIMARY KEY,
    user_id UUID REFERENCES User(user_id),
    goal_name VARCHAR(255) NOT NULL,
    target_amount DECIMAL(15, 2),
    current_amount DECIMAL(15, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. BuildPlan 
CREATE TABLE BuildPlan (
    plan_id UUID PRIMARY KEY,
    goal_id UUID REFERENCES SavingsGoal(goal_id),
    style_id UUID REFERENCES HomeStyle(style_id),
    square_footage INT,
    yard_size INT,
    size_category VARCHAR(50),
    has_basement BOOLEAN,
    has_pool BOOLEAN,
    has_solar BOOLEAN,
    bedrooms TINYINT,
    bathrooms TINYINT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. SavingsEntry 
CREATE TABLE SavingsEntry (
    entry_id UUID PRIMARY KEY,
    goal_id UUID REFERENCES SavingsGoal(goal_id),
    user_id UUID REFERENCES User(user_id),
    entry_date DATE,
    amount DECIMAL(15, 2),
    note VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. GoalMilestone 
CREATE TABLE GoalMilestone (
    milestone_id UUID PRIMARY KEY,
    goal_id UUID REFERENCES SavingsGoal(goal_id),
    title VARCHAR(255),
    threshold_amount DECIMAL(15, 2),
    icon_url VARCHAR(255),
    sort_order INT
);