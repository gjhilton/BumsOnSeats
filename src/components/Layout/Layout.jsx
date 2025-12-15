import React from 'react'
import { Link } from '@tanstack/react-router'
import { css } from '@generated/css'
import { Footer } from '@components/Footer/Footer'

export function Layout({ children }) {
    return (
        <div className={css({ minHeight: '100vh', display: 'flex', flexDirection: 'column' })}>
            <nav className={css({ bg: 'background', borderBottom: '1px solid #abb8c3', py: 'lg', px: '0' })}>
                <div className={css({ maxWidth: '1200px', margin: '0 auto', px: 'xl', display: 'flex', gap: '2xl', alignItems: 'center' })}>
                    <Link to="/" className={css({ color: 'text', textDecoration: 'none', fontWeight: '600', fontSize: 'medium', _hover: { textDecoration: 'underline' } })}>
                        Bums On Seats
                    </Link>
                    <Link to="/performances" className={css({ color: 'text', textDecoration: 'none', fontSize: 'small', _hover: { textDecoration: 'underline' } })}>
                        Performances
                    </Link>
                </div>
            </nav>
            <main className={css({ flex: '1', maxWidth: '1200px', width: '100%', margin: '0 auto', py: '3xl', px: '2xl' })}>
                {children}
            </main>
            <footer className={css({ bg: '#f8f8f8', borderTop: '1px solid #e0e0e0', py: '2xl', mt: '5xl' })}>
                <div className={css({ maxWidth: '1200px', width: '100%', margin: '0 auto', px: 'xl' })}>
                    <Footer />
                </div>
            </footer>
        </div>
    )
}
