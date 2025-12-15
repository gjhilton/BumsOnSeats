import React from 'react'
import { Link } from '@tanstack/react-router'
import { css } from '@generated/css'
import { Footer } from '@components/Footer/Footer'

export function Layout({ children }) {
    return (
        <div
            className={css({
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
            })}
        >
            <nav
                className={css({
                    backgroundColor: 'primary',
                    padding: 'md',
                    color: 'white',
                })}
            >
                <div
                    className={css({
                        maxWidth: '1200px',
                        margin: '0 auto',
                        display: 'flex',
                        gap: 'lg',
                        alignItems: 'center',
                    })}
                >
                    <Link
                        to="/"
                        className={css({
                            color: 'white',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            fontSize: 'xl',
                        })}
                    >
                        Bums On Seats
                    </Link>
                    <Link
                        to="/performances"
                        className={css({
                            color: 'white',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline',
                            },
                        })}
                    >
                        Performances
                    </Link>
                </div>
            </nav>
            <main
                className={css({
                    flex: 1,
                    maxWidth: '1200px',
                    width: '100%',
                    margin: '0 auto',
                    padding: 'xl',
                })}
            >
                {children}
            </main>
            <div
                className={css({
                    maxWidth: '1200px',
                    width: '100%',
                    margin: '0 auto',
                    padding: '0 xl xl',
                })}
            >
                <Footer />
            </div>
        </div>
    )
}
