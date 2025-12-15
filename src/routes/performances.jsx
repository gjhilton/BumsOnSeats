import { createFileRoute } from '@tanstack/react-router'
import { D3Chart } from '@components/D3Chart/D3Chart'
import { css } from '@generated/css'

export const Route = createFileRoute('/performances')({
    component: Performances,
})

function Performances() {
    // Sample data
    const sampleData = [
        { label: 'Jan', value: 45 },
        { label: 'Feb', value: 62 },
        { label: 'Mar', value: 38 },
        { label: 'Apr', value: 71 },
        { label: 'May', value: 55 },
        { label: 'Jun', value: 89 },
    ]

    return (
        <div>
            <h1
                className={css({
                    fontSize: '2.5rem',
                    marginBottom: 'lg',
                    color: 'text',
                })}
            >
                Performance Data
            </h1>
            <p
                className={css({
                    fontSize: '1.125rem',
                    marginBottom: 'xl',
                    color: 'gray.600',
                })}
            >
                Monthly performance metrics visualized with D3.js
            </p>
            <D3Chart data={sampleData} width={800} height={400} />
        </div>
    )
}
