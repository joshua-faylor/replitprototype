-- HomeStyle 
INSERT INTO HomeStyle (style_id, style_name, image_url, sort_order) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Modern Minimalist', 'http://example.com/modern.jpg', 1);

-- User 
INSERT INTO User (user_id, email, password, display_name) 
VALUES ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'test@example.com', 'hashed_password', 'My Dream Home');

-- SavingsGoal 
INSERT INTO SavingsGoal (goal_id, user_id, goal_name, target_amount, current_amount) 
VALUES ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'First House Fund', 50000.00, 5000.00);

-- BuildPlan 
INSERT INTO BuildPlan (plan_id, goal_id, style_id, square_footage, bedrooms, bathrooms) 
VALUES ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '550e8400-e29b-41d4-a716-446655440000', 2500, 3, 2);

-- SavingsEntry 
INSERT INTO SavingsEntry (entry_id, goal_id, user_id, entry_date, amount, note) 
VALUES ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2026-02-20', 500.00, 'February savings');