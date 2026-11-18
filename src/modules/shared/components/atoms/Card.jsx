// `padded={false}` removes the inner padding (tables that span the card).
// Passing `p-0` in className does not work: Tailwind resolves conflicting
// utilities by CSS order, not by class order.
function Card({ children, className = '', padded = true }) {
  return (
    <div
      className={`bg-med-card border border-med-border rounded-xl shadow-xs ${padded ? 'p-5' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
