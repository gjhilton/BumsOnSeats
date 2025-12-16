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
                    primary: { value: '#32373c' },
                    accent: { value: '#cf2e2e' },
                    cyan: { value: '#0693e3' },
                    purple: { value: '#9b51e0' },
                    background: { value: '#ffffff' },
                    text: { value: '#000000' },
                    gray: { value: '#abb8c3' },
                    paper: { value: '#f4f0e8' },
                    inkBlack: { value: '#1a1614' },
                    inkFaded: { value: '#3d3734' },
                    shadowBrown: { value: 'rgba(101, 67, 33, 0.15)' },
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
