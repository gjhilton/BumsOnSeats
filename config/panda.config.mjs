import { defineConfig } from '@pandacss/dev'

// Single source of truth for all color values
export const COLORS = {
    ink: '#ffffff',
    paper: '#000000',
    theatreA: '#E53935',
    theatreB: '#1E88E5',
    theatresBoth: '#7E3BA6'
}

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
                    ink: { value: COLORS.ink },
                    paper: { value: COLORS.paper },
                    theatreA: { value: COLORS.theatreA },
                    theatreB: { value: COLORS.theatreB },
                    theatresBoth: { value: COLORS.theatresBoth },
                },
                spacing: {
                    sm: { value: '0.5rem' },
                    md: { value: '1rem' },
                    lg: { value: '1.5rem' },
                    xl: { value: '2rem' },
                    '2xl': { value: '8rem' },
                },
                fontSizes: {
                    md: { value: '1rem' },
                    lg: { value: '1.5rem' },
                    xl: { value: '2rem' },
                    '2xl': { value: '5rem' },
                },
            },
        },
    },

    // The JSX framework to use
    jsxFramework: 'react',
})
