import { useEffect, useState } from 'react';
import SideBar from '../../components/Sidebar';
import { getLibros } from '../../Firebase/api';
import CardHome from '../../components/CardHome';
import CardLibro from '../../components/CardLibro';
import { Spinner } from 'react-bootstrap';


function Home() {

  const [loading, setLoading] = useState(false);

  const [buscador, setBuscador] = useState('');

  const [libros, setLibros] = useState([]);
  const [libros2, setLibros2] = useState([]);


  function textoCoincide(texto, patron) {
    const regex = new RegExp(patron.replace(/%/g, '.*'), 'i');
    return regex.test(texto);
  }

  const getLibrosDeApi = async () => {
    const querySnapshot = await getLibros();
    const docs = [];
    const docs2 = [];

    querySnapshot.forEach((doc) => {
      docs.push({ ...doc.data(), id: doc.id });

      if (textoCoincide(doc.data().titulo, buscador) || textoCoincide(doc.data().autor, buscador)) {
        docs2.push({ ...doc.data(), id: doc.id });
      }

    });
    setLibros(docs);
    setLibros2(docs2);
  };

  useEffect(() => {
    getLibrosDeApi();
  }, [buscador]);



  return (
    <div className="App">
      <SideBar />

      <main>


        <div className='container-cards'>

          {libros.length === 0 &&
            <Spinner animation="border" />
          }

          {libros.map((libro) => (
            <div key={libro.id}>
              <CardHome
                imagen={libro.imagen}
                titulo={libro.titulo}
                desc={libro.descripcion}
              />
            </div>
          ))}

        </div>

        <div className='row d-flex justify-content-center align-items-center mb-5 mt-5 ms-2 me-2'>
          <div className='col-sm d-flex justify-content-center align-items-center'>
            <h1 className='text-center title'>Reservar Libros</h1>
          </div>
          <div className='col-sm d-flex justify-content-center align-items-center'>
            <input type="text" placeholder="Buscador..." onChange={e => setBuscador(e.target.value)} value={buscador} style={{ width: '100%' }} className='form-control' />
          </div>
        </div>


        {libros2.length === 0 &&
          <h3 className="m-3 title">No se encontraron libros</h3>
        }


        <div className='row row-cols-md-auto d-flex justify-content-center align-items-center mb-5'>
          {libros2.filter((libro) => libro.disponible).map((libro) => (
            <div className='col d-flex justify-content-center align-items-center' key={libro.id}>
              <CardLibro
                id={libro.id}
                imagen={libro.imagen}
                titulo={libro.titulo}
                desc={libro.descripcion}
                reservado={libro.reservado}
                userReservado={libro.userReservado}
                callback={getLibrosDeApi}
              />
            </div>
          ))}
        </div>


      </main>

    </div>
  );
}

export default Home;
