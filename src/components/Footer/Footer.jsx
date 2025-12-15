import React from 'react'
import { Link } from '@tanstack/react-router'
import { css } from '@generated/css'

const GITHUB_URL = 'https://github.com/gjhilton/BumsOnSeats'

export function Footer() {
    return (
        <div>
            <div className={css({ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2xl', mb: 'xl' })}>
                <div>
                    <h3 className={css({ fontSize: 'small', fontWeight: '600', mb: 'md', textTransform: 'uppercase' })}>
                        About
                    </h3>
                    <ul className={css({ listStyle: 'none', fontSize: 'small' })}>
                        <li className={css({ mb: 'sm' })}>
                            <a href={GITHUB_URL}>GitHub</a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className={css({ fontSize: 'small', fontWeight: '600', mb: 'md', textTransform: 'uppercase' })}>
                        Resources
                    </h3>
                    <ul className={css({ listStyle: 'none', fontSize: 'small' })}>
                        <li className={css({ mb: 'sm' })}>
                            <Link to="/performances">Visualizations</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={css({ borderTop: '1px solid #abb8c3', pt: 'lg', fontSize: 'small', color: 'gray' })}>
                Design and code copyright ©2025 g.j.hilton
            </div>
        </div>
    )
}
