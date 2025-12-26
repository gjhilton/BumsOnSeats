import { css } from '@generated/css';

const SPINNER_SIZE = '48px';
const SPINNER_BORDER_WIDTH = '5px';
const SPINNER_BORDER_RADIUS = '50%';
const SPINNER_ANIMATION = 'rotation 1s linear infinite';

const LoadingSpinner = () => (
	<div
		className={css({
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			height: '100vh',
			width: '100vw',
		})}
	>
		<div
			className={css({
				width: SPINNER_SIZE,
				height: SPINNER_SIZE,
				border: `${SPINNER_BORDER_WIDTH} solid`,
				borderColor: 'ink',
				borderBottomColor: 'transparent',
				borderRadius: SPINNER_BORDER_RADIUS,
				display: 'inline-block',
				boxSizing: 'border-box',
				animation: SPINNER_ANIMATION,
			})}
		/>
	</div>
);

export { LoadingSpinner };
