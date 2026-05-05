export default function SectionDivider() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
      <div
        style={{
          height: '1px',
          background: 'linear-gradient(to right, transparent 0%, rgba(168,85,247,0.7) 50%, transparent 100%)',
          boxShadow: '0 0 10px rgba(168,85,247,0.45), 0 0 20px rgba(168,85,247,0.2)',
        }}
      />
    </div>
  )
}
