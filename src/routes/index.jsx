import { createFileRoute, Link } from '@tanstack/react-router'
import { css } from '@generated/css'

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <div>
            <header className={css({ mb: '2xl', pb: 'lg', borderBottom: '1px solid #abb8c3' })}>
                <h1 className={css({ fontSize: 'xlarge', mb: 'sm', color: 'text', fontWeight: 'normal', lineHeight: '1.1' })}>
                    Bums On Seats
                </h1>
                <p className={css({ fontSize: 'small', color: 'gray' })}>
                    Showing 1 visualization
                </p>
            </header>

            <div className={css({ mb: '3xl' })}>
                <article className={css({ display: 'flex', gap: '2xl', pb: '2xl', mb: '2xl', borderBottom: '1px solid #abb8c3' })}>
                    <img
                        src="/BumsOnSeats/IMG_6198.JPG"
                        alt="Performance visualization"
                        className={css({ width: '180px', height: '260px', objectFit: 'cover', objectPosition: 'center', border: '1px solid #abb8c3', flexShrink: '0' })}
                    />
                    <div className={css({ flex: '1' })}>
                        <h2 className={css({ fontSize: 'large', mb: 'lg', fontWeight: 'normal', lineHeight: '1.2' })}>
                            <Link
                                to="/performances"
                                className={css({ color: 'text', textDecoration: 'none', _hover: { textDecoration: 'underline' } })}
                            >
                                Monthly Performance Metrics
                            </Link>
                        </h2>
                        <p className={css({ fontSize: 'medium', mb: 'lg', lineHeight: '1.6', color: 'text' })}>
                            Interactive D3.js visualization showing monthly performance data trends and analytics.
                            Explore key metrics and patterns through an intuitive chart interface.
                        </p>
                        <div className={css({ fontSize: 'small', color: 'gray' })}>
                            <strong>Type:</strong> Data Visualization &nbsp;|&nbsp;
                            <strong>Format:</strong> D3.js Interactive Chart
                        </div>
                    </div>
                </article>
            </div>
        </div>
    )
}
