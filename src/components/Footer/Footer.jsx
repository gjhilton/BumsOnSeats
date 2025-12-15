import React from 'react'
import { css } from '@generated/css'

const MARGIN_TOP = '5xl'
const TEXT_MARGIN_TOP = 'lg'
const FONT_SIZE_SMALL = '0.875rem'
const GITHUB_URL = 'https://github.com/gjhilton/BumsOnSeats'

export function Footer() {
    return (
        <footer
            className={css({
                marginTop: MARGIN_TOP,
                paddingTop: 'xl',
                borderTop: '1px solid',
                borderColor: 'gray.200',
            })}
        >
            <div
                className={css({
                    fontSize: FONT_SIZE_SMALL,
                    marginTop: TEXT_MARGIN_TOP,
                    fontStyle: 'italic',
                    color: 'gray.600',
                })}
            >
                Design and <a href={GITHUB_URL}>code</a> copyright ©2025
                g.j.hilton
            </div>
        </footer>
    )
}
