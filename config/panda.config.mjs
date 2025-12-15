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

    // Useful for theme customization
    theme: {
        extend: {
            tokens: {
                colors: {
                    primary: { value: '#3b82f6' },
                    secondary: { value: '#8b5cf6' },
                    background: { value: '#ffffff' },
                    text: { value: '#1f2937' },
                },
                spacing: {
                    sm: { value: '0.5rem' },
                    md: { value: '1rem' },
                    lg: { value: '1.5rem' },
                    xl: { value: '2rem' },
                },
            },
        },
    },

    // The JSX framework to use
    jsxFramework: 'react',
})
