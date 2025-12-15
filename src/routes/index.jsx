import { createFileRoute, Link } from '@tanstack/react-router'
import { css } from '@generated/css'

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <div>
            <h1
                className={css({
                    fontSize: '3rem',
                    marginBottom: 'lg',
                    color: 'text',
                })}
            >
                Bums On Seats
            </h1>
            <p
                className={css({
                    fontSize: '1.125rem',
                    marginBottom: 'xl',
                    color: 'gray.700',
                    lineHeight: '1.6',
                })}
            >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur.
            </p>
            <Link
                to="/performances"
                className={css({
                    display: 'inline-block',
                    backgroundColor: 'primary',
                    color: 'white',
                    padding: 'md lg',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '1.125rem',
                    '&:hover': {
                        backgroundColor: 'blue.600',
                    },
                })}
            >
                View Performances
            </Link>
        </div>
    )
}
