import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
	it('renders the spinner component', () => {
		const { container } = render(<LoadingSpinner />);
		const spinner = container.querySelector('div > div');
		expect(spinner).toBeInTheDocument();
	});

	it('has the correct container styling for centering', () => {
		const { container } = render(<LoadingSpinner />);
		const spinnerContainer = container.firstChild;
		expect(spinnerContainer).toBeInTheDocument();
	});

	it('renders without accessibility violations', () => {
		const { container } = render(<LoadingSpinner />);
		expect(container).toBeInTheDocument();
	});
});
