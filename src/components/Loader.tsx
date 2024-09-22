export default function Loader(){
    return (<div className="loader">
        <svg viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="14" stroke="#ccc" strokeWidth="4" fill="none" />
            <path d="M28 16A12 12 0 1 1 4 16" fill="none" stroke="#0070f3" strokeWidth="4" strokeLinecap="round">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 16 16"
                    to="360 16 16"
                    dur="1s"
                    repeatCount="indefinite"
                />
            </path>
        </svg>
    </div>)
}