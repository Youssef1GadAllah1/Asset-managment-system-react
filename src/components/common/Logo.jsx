import { Link } from 'react-router-dom'

const style = `
@keyframes step1 {
  0%,100% { opacity:0; transform: translateY(6px); }
  15%,85% { opacity:1; transform: translateY(0); }
}
@keyframes step2 {
  0%,10%,100% { opacity:0; transform: translateY(6px); }
  25%,85% { opacity:1; transform: translateY(0); }
}
@keyframes step3 {
  0%,20%,100% { opacity:0; transform: translateY(6px); }
  35%,85% { opacity:1; transform: translateY(0); }
}
@keyframes arrowSlide {
  0%   { opacity:0; transform: translateX(-4px); }
  40%  { opacity:1; transform: translateX(0); }
  70%  { opacity:1; transform: translateX(3px); }
  85%  { opacity:0; transform: translateX(6px); }
  100% { opacity:0; transform: translateX(-4px); }
}
@keyframes glowPulse {
  0%,100% { filter: drop-shadow(0 0 3px rgba(13,148,136,0.3)); }
  50%      { filter: drop-shadow(0 0 8px rgba(13,148,136,0.7)); }
}
.ns-logo-svg   { animation: glowPulse 3s ease-in-out infinite; }
.ns-step1      { animation: step1 3s ease-out infinite; }
.ns-step2      { animation: step2 3s ease-out infinite; }
.ns-step3      { animation: step3 3s ease-out infinite; }
.ns-arrow      { animation: arrowSlide 3s ease-in-out infinite; }
`

export const Logo = ({ size = 'md', to = '/', className = '' }) => {
  const sizes = {
    sm: { box: 24, text: 'text-base' },
    md: { box: 32, text: 'text-xl' },
    lg: { box: 44, text: 'text-3xl' },
    xl: { box: 60, text: 'text-5xl' },
  }
  const s = sizes[size] || sizes.md
  const b = s.box

  const inner = (
    <span className={`inline-flex items-center gap-2 select-none ${className}`}>
      <style>{style}</style>

      {/* Animated SVG icon */}
      <svg
        width={b}
        height={b}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="ns-logo-svg flex-shrink-0"
      >
        {/* Background circle */}
        <circle cx="20" cy="20" r="20" fill="#0d9488" />

        {/* Step 1 — bottom left */}
        <rect className="ns-step1" x="7" y="26" width="8" height="5" rx="1.5" fill="white" fillOpacity="0.85" />

        {/* Step 2 — middle */}
        <rect className="ns-step2" x="16" y="20" width="8" height="11" rx="1.5" fill="white" />

        {/* Step 3 — top right */}
        <rect className="ns-step3" x="25" y="14" width="8" height="17" rx="1.5" fill="white" fillOpacity="0.85" />

        {/* Arrow on top of step 3 */}
        <g className="ns-arrow">
          <path
            d="M26 11 L30 8 L34 11"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <line x1="30" y1="8" x2="30" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>

      {/* Wordmark */}
      <span className={`font-bold tracking-tight leading-none ${s.text}`}>
        <span className="text-gray-900 dark:text-white">Next</span>
        <span className="text-primary-600">-Step</span>
      </span>
    </span>
  )

  return to ? (
    <Link to={to} className="inline-flex items-center">
      {inner}
    </Link>
  ) : (
    inner
  )
}
