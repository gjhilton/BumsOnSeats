import { defineConfig } from '@pandacss/dev'

export default defineConfig({
    // Where to look for your css declarations
    include: ['./src/**/*.{js,jsx,ts,tsx}'],

    // Files to exclude
    exclude: [],

    // Output directory for generated files
    outdir: 'styled-system',

    // The output directory for your css system
    emitPackage: true,

    // Generate static CSS file
    outExtension: 'mjs',
    emitTokensOnly: false,

    // Useful for theme customization
    theme: {
        extend: {
            tokens: {
                colors: {
                    ink: { value: '#ffffff' },
                    paper: { value: '#000000' },
                    theatreA: { value: '#E53935' },
                    theatreB: { value: '#1E88E5' },
                    theatresBoth: { value: '#7E3BA6' },
                },
                spacing: {
                    sm: { value: '0.44rem' },
                    md: { value: '1rem' },
                    lg: { value: '1.5rem' },
                    xl: { value: '2rem' },
                    '2xl': { value: '3rem' },
                    '3xl': { value: '4rem' },
                    '4xl': { value: '5rem' },
                    '5xl': { value: '5.06rem' },
                },
                fontSizes: {
                    xs: { value: '10px' },
                    small: { value: '13px' },
                    medium: { value: '20px' },
                    large: { value: '36px' },
                    xlarge: { value: '42px' },
                    '2xl': { value: '64px' },
                    '3xl': { value: '96px' },
                },
            },
        },
    },

    // The JSX framework to use
    jsxFramework: 'react',
})
