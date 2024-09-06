// createFolders.js
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Setup readline to get user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Ask the user for the directory name
rl.question('Enter the name of the directory: ', (dirName) => {
    const publicDir = path.join(__dirname, 'public', dirName);

    // Paths for original and thumbnail directories
    const originalDir = path.join(publicDir, 'original');
    const thumbnailDir = path.join(publicDir, 'thumbnail');

    // Create the directories
    [publicDir, originalDir, thumbnailDir].forEach((dir) => {
        fs.mkdirSync(dir, { recursive: true });
        // Create .gitkeep file in each directory
        fs.writeFileSync(path.join(dir, '.gitkeep'), '');
    });

    console.log(`Directories and .gitkeep files created successfully in: ${publicDir}`);

    rl.close();
});
