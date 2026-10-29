export default function Ranking({ ranking }) {
  return (
    <aside className="ranking">
      <h2>🏆 Ranking</h2>
      {ranking.length === 0 ? (
        <p>Nenhuma pontuação ainda. Seja o primeiro!</p>
      ) : (
        <ol>
          {ranking.map((r, i) => (
            <li key={i}>
              <span>{r.nome}</span>
              <b>{r.pontos}</b>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}
