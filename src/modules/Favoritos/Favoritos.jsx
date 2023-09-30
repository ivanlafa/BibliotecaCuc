import { useEffect, useState } from "react";
import SideBar from "../../components/Sidebar";
import { getFavoritos } from "../../Firebase/api";
import CardFavorito from "../../components/CardFavorito";


function Favoritos() {


  const userData = JSON.parse(localStorage.getItem('user'));

    const [favoritos, setFavoritos] = useState([]);


    const getFavoritosDeApi = async () => {
        const querySnapshot = await getFavoritos();

        const docs = [];

        querySnapshot.forEach((doc)  =>  {
            if(doc.data().usuario === userData.user.email){
                docs.push({ ...doc.data(), id: doc.id });
            }
        });
        
      setFavoritos(docs);

    };


    useEffect(() => {
        getFavoritosDeApi();
    }, []);



    return (
      <div className="Favoritos">

        <SideBar/>

       <main>
        {favoritos.length > 0 &&
        <h1 className="m-3 title">Mis Favoritos</h1>
        }
        {favoritos.length === 0 &&
          <h1 className="m-3 title">No tienes favoritos</h1>
        }
        <div className='row row-cols-md-auto d-flex justify-content-center align-items-center'>          
                {favoritos.map((favorito) => (
                  <div className='col d-flex justify-content-center align-items-center' key={favorito.id}> 
                    <CardFavorito
                      id = {favorito.id}
                      imagen = {favorito.imagen}
                      titulo = {favorito.titulo}
                      desc =  {favorito.descripcion}
                      callback = {getFavoritosDeApi}
                    />
                  </div>
                ))}
            </div>


       </main>
      </div>
    );
  }
  
  export default Favoritos;
  