import { Button, Modal } from "react-bootstrap";
import { FaHandHoldingHeart, FaCalendarDay, FaRegComments, FaHeartBroken } from "react-icons/fa";
import { deleteFavorito, getFavoritos, getLibro, saveFavorito, updateLibro } from "../Firebase/api";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

function CardReserva(props) {
    
    const [favorito, setFavorito] = useState(false);
    const [idFavorito, setIdFavorito] = useState("");

    const userData = JSON.parse(localStorage.getItem('user'));

    const guardarFavorito = async () => {
      setFavorito(true);
        try {

            let favorito = {
                "idLibro": props.id,
                "imagen": props.imagen,
                "titulo": props.titulo,
                "desc":  props.desc,
                "usuario": userData.user.email
            }

            await saveFavorito(favorito);
            getFavoritosDeApi();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
              })
        }
    }

    const eliminarFavorito = async () => {
      setFavorito(false);
      try {
          await deleteFavorito(idFavorito);
          setFavorito(false);
          props.callback();
          getFavoritosDeApi();
      } catch (error) {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error,
            })
      }
  }


    const getFavoritosDeApi = async () => {
        const querySnapshot = await getFavoritos();
        const docs = [];
        querySnapshot.forEach((doc) => {
            if (doc.data().idLibro === props.id && doc.data().usuario === userData.user.email) {
                setFavorito(true);
                setIdFavorito(doc.id);
            }

            if(doc.data().usuario === userData.user.email){
                docs.push({ ...doc.data(), id: doc.id });
            }
            
        });
    };

    useEffect(() => {
        getFavoritosDeApi();
    }, []);


    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalOpen = () => {
      setIsModalOpen(true);
    };
  
    const handleModalClose = () => {
      setIsModalOpen(false);
    };


    const handleCancelarReservar = async () => {

      let idLibro = props.id;

      let newLibro =  {
        reservado: false,
        userReservado: "",
      } 

      Swal.fire({
        title: '¿Quieres cancelar la reserva?',
        text: "Se cancelara la reserva y quedara disponible para todos los usuarios!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, cancelar reserva!',
        cancelButtonText: 'No, mantener reserva!'
      }).then(async (result) => {
        if (result.isConfirmed) {
         
          try {
            await updateLibro(idLibro, newLibro);
            Swal.fire({
              icon: 'success',
              title: 'Reserva cancelada!',
            })
            props.callback();
            getFavoritosDeApi();
          } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
              })
          }
        
        }
      })


    };


    const handleReservar = async () => {

      let idLibro = props.id;

      let libro = await getLibro(idLibro);
      let reservado = libro.data().reservado;

      if(reservado){

        Swal.fire({
          icon: 'error',
          title: 'Vaya...',
          text: "Lo sentimos parece que este libro ya fue reservado",
        })

      }else{

      let newLibro =  {
        reservado: true,
        userReservado: userData.user.email,
      } 

      Swal.fire({
        title: '¿Quieres reservar este libro?',
        text: "Verificaremos la disponibilidad del libro y si esta disponible lo apartaremos para ti!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, reservar!',
        cancelButtonText: 'No, cancelar!'
      }).then(async (result) => {
        if (result.isConfirmed) {
         
          try {
            await updateLibro(idLibro, newLibro);
            Swal.fire({
              icon: 'success',
              title: 'Libro reservado!',
            })
            props.callback();
            getFavoritosDeApi();
          } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
              })
          }
        
        }
      })

    }

    };

    return (
      <div className="CardLibro">
        <img src={props.imagen} alt="Imagen no disponible" />
        <div className="optionsLibro">

          
              {!props.reservado &&
                <Button  onClick={handleReservar} className="m-2 btnLibro" variant="success"> <FaCalendarDay/> </Button>
              }     

              {props.reservado && props.userReservado !== userData.user.email &&  
                <Button  className="m-2 btnLibro" variant="secondary"> <FaCalendarDay/> </Button>
              }    

              {props.reservado && props.userReservado === userData.user.email &&
                <Button onClick={handleCancelarReservar} className="m-2 btnLibro" variant="danger"> <FaCalendarDay/> </Button>
              }   
          

        </div>


         {/* Modal Preview */}
         <Modal centered show={isModalOpen} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title className='textCenter'>Comentarios y opiniones</Modal.Title>
        </Modal.Header>
        <Modal.Body className='d-flex justify-content-center align-items-center flex-column'>
      
        
        

        </Modal.Body>
        <Modal.Footer>

          <Button variant="success" >
            Enviar
          </Button>
        </Modal.Footer>
      </Modal>
      {/* MODAL PARA BORRAR */}

      </div>
    );
  }
  
  export default CardReserva;