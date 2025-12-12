-- Insert dummy data into users table with mixed international names
INSERT INTO users (username, email, phone, role) VALUES
('santiago_rodriguez', 'santiago.rodriguez@email.com', '+54-11-2345-6789', 'DRIVER'),
('li_wei', 'li.wei@email.com', '+86-138-0011-2233', 'DRIVER'),
('sofia_papadopoulos', 'sofia.papadopoulos@email.com', '+30-210-987-6543', 'DRIVER'),
('kenji_tanaka', 'kenji.tanaka@email.com', '+81-90-1234-5678', 'DRIVER'),
('amina_al-mansoori', 'amina.al-mansoori@email.com', '+971-50-555-1234', 'DRIVER'),
('maria_garcia', 'maria.garcia@email.com', '+34-91-876-5432', 'USER'),
('oliver_smith', 'oliver.smith@email.com', '+44-20-7946-0958', 'USER'),
('isabella_rossi', 'isabella.rossi@email.com', '+39-06-1234-5678', 'USER'),
('alexandre_dupont', 'alexandre.dupont@email.com', '+33-1-42-86-97-54', 'USER'),
('chloe_nguyen', 'chloe.nguyen@email.com', '+84-28-3827-1891', 'USER'),
('admin_flota', 'admin@flota.com', '+1-555-0100', 'ADMIN'),
('supervisor_global', 'supervisor@flota.com', '+49-30-123456', 'ADMIN');

-- Insert dummy data into vehicle table
INSERT INTO vehicle (patente, marca, modelo, km_recorrido, driver_id) VALUES
('ABC123', 'Toyota', 'Corolla', 45000, 1),
('DEF456', 'Honda', 'Civic', 32000, 2),
('GHI789', 'Ford', 'Focus', 58000, 3),
('JKL012', 'Chevrolet', 'Cruze', 21000, 4),
('MNO345', 'Volkswagen', 'Golf', 67000, 5);