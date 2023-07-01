const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    sassOptions: {
        includePaths: [
            path.join(__dirname, 'app/styles'),
            path.join(__dirname, 'src/interface'),
        ]
    },
    
}

module.exports = nextConfig
