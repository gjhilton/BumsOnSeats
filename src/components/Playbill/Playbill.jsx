import { css } from '@generated/css'

const Paper = ({children}) => <div className={css({
            containerType: "inline-size",
            width: "80%",
            maxWidth: "800px",
            minHeight: "80vh",
            margin: "2rem auto",
            paddingTop: "0.5rem",
            bg: '#e8dcc8',
            borderRadius: '3px 5px 4px 6px',
            backgroundImage: `
                radial-gradient(circle at 15% 20%, rgba(101,67,33,0.08) 0%, transparent 8%),
                radial-gradient(circle at 85% 15%, rgba(101,67,33,0.06) 0%, transparent 10%),
                radial-gradient(circle at 92% 80%, rgba(101,67,33,0.09) 0%, transparent 12%),
                radial-gradient(circle at 8% 85%, rgba(101,67,33,0.07) 0%, transparent 9%),
                radial-gradient(circle at 50% 95%, rgba(101,67,33,0.05) 0%, transparent 15%),
                radial-gradient(ellipse at 95% 5%, rgba(80,50,20,0.12) 0%, transparent 6%),
                radial-gradient(ellipse at 5% 8%, rgba(80,50,20,0.10) 0%, transparent 7%),
                linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 30%, rgba(101,67,33,0.03) 100%),
                repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(101,67,33,0.015) 2px, rgba(101,67,33,0.015) 4px),
                repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(101,67,33,0.01) 2px, rgba(101,67,33,0.01) 4px)
            `,
            boxShadow: `
                inset 0 0 60px rgba(101,67,33,0.08),
                inset 20px 0 40px rgba(101,67,33,0.06),
                inset -20px 0 40px rgba(101,67,33,0.06),
                inset 0 20px 40px rgba(101,67,33,0.06),
                inset 0 -20px 40px rgba(101,67,33,0.05),
                0 4px 12px rgba(0,0,0,0.1),
                0 2px 4px rgba(0,0,0,0.06)
            `,
            transform: 'rotate(1deg)',
        })} >
{children}
            </div> 

const Benefit = ({fontSource}) => 
 <h1 className={css({
                    fontWeight: "500",
                    letterSpacing: '0.05em',
                    fontSize: '5cqw',
                    borderBottom: "1px solid black",
                    display: 'inline-block',
                    lineHeight: "1"
                })}>
                    For the <em className={css({ fontStyle: 'italic' })}>BENEFIT</em> of Mr. HILTON.
                </h1>

export function Playbill({ fontSource }) {
    // e.g. const letterSpacing = fontSource === 'local' ? '0.04em' : '0.05em'


    return (
        <Paper>
            <div className={css({
                fontFamily: 'var(--font-caslon)',
                textAlign: 'center',
            })}>
               <Benefit />
            </div>
        </Paper>
    )
}
