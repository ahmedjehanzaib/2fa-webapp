import * as React from 'react'

export class ErrorBoundary extends React.Component {
	state = {error: '', errorInfo: null}
	/* tslint:disable-next-line */
	componentDidCatch(error: Error, errorInfo: any): void {
		// Catch errors in any components below and re-render with error message
		this.setState({
			error: error,
			errorInfo: errorInfo
		})
	}
	/* tslint:disable-next-line */
	render(): any {
		if (this.state.errorInfo) {
		// Error path
			return (
				<div>
				<h2>Something went wrong.</h2>
				<details style={{ whiteSpace: 'pre-wrap' }}>
					{this.state.error && this.state.error.toString()}
					<br />
					{/* tslint:disable-next-line */}
					{(this.state.errorInfo as any).componentStack}
				</details>
				</div>
			);
		}
		// Normally, just render children
		return this.props.children;
	}
}