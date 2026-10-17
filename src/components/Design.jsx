import Illustration from './Illustration.jsx'
import FlowIllustration from './FlowIllustration.jsx'

// Playground page for evaluating illustrations before they are used in the app.
export default function Design() {
  return (
    <section>
      <h1>
        <span className="hl">Design</span>
      </h1>
      <p className="tagline">illustrations to evaluate — line art only</p>

      <div className="design-wide">
        <FlowIllustration />
        <p className="muted">Study loop and sleeping student — line art, not used in the app yet.</p>
      </div>

      <div className="postit c-yellow design-card">
        <h3>Sleeping student</h3>
        <Illustration />
        <p className="muted">Not used in the app yet.</p>
      </div>
    </section>
  )
}
