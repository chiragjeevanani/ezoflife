const fs = require('fs');
const path = 'c:/Users/Hp/Desktop/ezoflife/frontend/src/lib/api.js';
let content = fs.readFileSync(path, 'utf8');

const getConfigCode = `    },
    getConfig: async () => {
        try {
            const response = await fetch(\`\${BASE_URL}/admin/config\`);
            return await response.json();
        } catch (error) {
            console.error('Get Config Error:', error);
            throw error;
        }
    },
    updateConfig: async (key, value) => {
        try {
            const response = await fetch(\`\${BASE_URL}/admin/config\`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value })
            });
            return await response.json();
        } catch (error) {
            console.error('Update Config Error:', error);
            throw error;
        }
    }
};`;

// Use a regex that is less sensitive to whitespace around deleteSupplier
const newContent = content.replace(/deleteSupplier: async \(id\) => \{[\s\S]*?\}\s*\},?\n\s*\};/, (match) => {
    return match.replace(/\}\s*\},?\n\s*\};/, getConfigCode);
});

if (content !== newContent) {
    fs.writeFileSync(path, newContent);
    console.log('Successfully updated api.js');
} else {
    // Try a simpler replace if the above fails
    const alternativeContent = content.replace(/deleteSupplier: async \(id\) => \{[\s\S]*?\}\s*\};/, (match) => {
        return match.replace(/\}\s*\};/, getConfigCode);
    });
    
    if (content !== alternativeContent) {
        fs.writeFileSync(path, alternativeContent);
        console.log('Successfully updated api.js (alternative)');
    } else {
        console.log('Failed to match target in api.js');
    }
}
