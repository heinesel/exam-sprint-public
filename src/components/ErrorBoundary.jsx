import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error, info) {
    console.error('ExamSprint could not render the current screen.', error, info)
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="error-screen">
          <div className="postit c-pink">
            <h1>
              Something <span className="hl">went wrong</span>
            </h1>
            <p>Your saved progress is still in this browser. Return to the start page and try again.</p>
            <button className="btn" onClick={() => window.location.assign(import.meta.env.BASE_URL)}>
              Go to the start page
            </button>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
