import React from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo })
    // You can also log the error to an error reporting service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertTitle>Oops! Something went wrong.</AlertTitle>
            <AlertDescription>
              We're sorry, but an error occurred while rendering this page. Please try refreshing the page or contact support if the problem persists.
            </AlertDescription>
          </Alert>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-4 p-4 bg-gray-100 rounded-lg">
              <summary className="font-bold cursor-pointer">Error Details</summary>
              <pre className="mt-2 whitespace-pre-wrap">
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary