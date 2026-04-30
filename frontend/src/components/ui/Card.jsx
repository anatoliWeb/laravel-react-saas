function Card({ title, children }) {
  return (
    <article className="card">
      {title ? <h3 className="card-title">{title}</h3> : null}
      <div className="card-body">{children}</div>
    </article>
  );
}

export default Card;
