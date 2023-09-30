import { useEffect, useState } from "react";
import SideBar from "../../components/Sidebar";
import { getLibros } from "../../Firebase/api";
import CardReserva from "../../components/CardReserva";
import BlockUI from "../../components/BlockUi";

function Reservas() {


  const userData = JSON.parse(localStorage.getItem('user'));

    const [libros, setFavoritos] = useState([]);


    const getLibrossDeApi = async () => {
        const querySnapshot = await getLibros();

        const docs = [];

        querySnapshot.forEach((doc)  =>  {
          console.log(doc.data());
          console.log(doc.data().email);
            if(doc.data().reservado === true && doc.data().userReservado === 
            userData.user.email){
                docs.push({ ...doc.data(), id: doc.id });
            }
        });
        
      setFavoritos(docs);

    };


    useEffect(() => {
        getLibrossDeApi();
    }, []);



    return (
      <div className="Reservas">

        <SideBar/>

       <main>
        {libros.length > 0 &&
          <h1 className="m-3 title">Mis Reservas</h1>
        }
        {libros.length === 0 &&
          <h1 className="m-3 title">No tienes reservas</h1>
        }
        <div className='row row-cols-md-auto d-flex justify-content-center align-items-center'>      
              {libros.map((libro) => (
                   <div className='col d-flex justify-content-center align-items-center' key={libro.id}> 
                    <CardReserva
                      id = {libro.id}
                      imagen = {libro.imagen}
                      titulo = {libro.titulo}
                      desc =  {libro.descripcion}
                      reservado = {libro.reservado}
                      userReservado = {libro.userReservado}
                      callback = {getLibrossDeApi}
                    />
                  </div>
                ))}
            </div>


       </main>
      </div>
    );
  }
  
  export default Reservas;
  