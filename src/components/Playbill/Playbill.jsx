import { css } from '@generated/css'

const Paper = ({children}) => <div className={css({
            containerType: "inline-size",
            width: "80%",
            maxWidth: "800px",
            minHeight: "80vh",
            margin: "2rem auto",
            paddingTop: "0.5rem",
            bg: '#e8dcc8',
            backgroundImage: `
                linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 30%, rgba(101,67,33,0.03) 100%),
                repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(101,67,33,0.015) 2px, rgba(101,67,33,0.015) 4px),
                repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(101,67,33,0.01) 2px, rgba(101,67,33,0.01) 4px)
            `,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
            transform: 'rotate(1deg)',
        })} >
{children}
            </div> 

export function Playbill({ fontSource }) {
    const letterSpacing = fontSource === 'local' ? '0.04em' : '0.05em'
    const fontWeight = fontSource === 'local' ? '400' : '500'

    return (
        <Paper>
            <div className={css({
                fontFamily: 'var(--font-caslon)',
                textAlign: 'center',
            })}>
                <h1 className={css({
                    fontWeight: "500",
                    letterSpacing: letterSpacing,
                    fontSize: '5cqw',
                    borderBottom: "1px solid black",
                    display: 'inline-block',
                    lineHeight: "1"
                })}>
                    For the <em className={css({ fontStyle: 'italic' })}>BENEFIT</em> of Mr. HILTON.
                </h1>
            </div>
        </Paper>
    )
}
