-- Create ROM metadata table
CREATE TABLE IF NOT EXISTS roms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    year VARCHAR(4),
    genre VARCHAR(50),
    rom_path VARCHAR(255) NOT NULL,
    license_type VARCHAR(100) NOT NULL,
    cover_image VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user save table
CREATE TABLE IF NOT EXISTS user_saves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    rom_id UUID REFERENCES roms(id),
    save_data BYTEA,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grants
GRANT SELECT ON roms TO anon;
GRANT SELECT ON roms TO authenticated;
GRANT ALL ON user_saves TO authenticated;

-- Seed sample ROMs
INSERT INTO roms (name, year, genre, rom_path, license_type, cover_image) VALUES
('NES Starter Kit', '1985', 'Test', 'https://raw.githubusercontent.com/battlelinegames/nes-starter-kit/master/starter.nes', 'MIT', 'https://picsum.photos/seed/starter/400/300'),
('NEStress.NES', '1990', 'Test', 'https://raw.githubusercontent.com/christopherpow/nes-test-roms/master/stress/NEStress.NES', 'See upstream', 'https://picsum.photos/seed/nestress/400/300'),
('nestest.nes', '1989', 'Test', 'https://raw.githubusercontent.com/christopherpow/nes-test-roms/master/other/nestest.nes', 'See upstream', 'https://picsum.photos/seed/nestest/400/300'),
('RasterDemo.NES', '1991', 'Test', 'https://raw.githubusercontent.com/christopherpow/nes-test-roms/master/other/RasterDemo.NES', 'See upstream', 'https://picsum.photos/seed/rasterdemo/400/300'),
('RasterTest1.NES', '1991', 'Test', 'https://raw.githubusercontent.com/christopherpow/nes-test-roms/master/other/RasterTest1.NES', 'See upstream', 'https://picsum.photos/seed/rastertest1/400/300');
