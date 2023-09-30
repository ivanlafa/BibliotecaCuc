

function CardHome(props) {
  return (
    <div className="CardHome">
      <div className="card">
        <img src={props.imagen} alt="" />
        <div className="card-content">
          <h2>
            <div style={{ wordWrap: 'break-word', wordBreak: 'break-all', textAlign: 'start' }}>
              {props.titulo}
            </div>
          </h2>
          <p>
            {props.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

export default CardHome;
