import { Button, Col, Modal, Toast } from "react-bootstrap";
import { FaHandHoldingHeart, FaCalendarDay, FaRegComments, FaHeartBroken } from "react-icons/fa";
import { deleteFavorito, getComentarios, getFavoritos, getLibro, saveComentario, saveFavorito, updateLibro } from "../Firebase/api";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

function CardLibro(props) {

  const [favorito, setFavorito] = useState(false);
  const [favoritos, setFavoritos] = useState([]);
  const [idFavorito, setIdFavorito] = useState("");

  const userData = JSON.parse(localStorage.getItem('user'));

  const guardarFavorito = async () => {
    setFavorito(true);
    try {

      const querySnapshot = await getFavoritos();
      const existe = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().idLibro === props.id && doc.data().usuario === userData.user.email) {
          existe.push({ ...doc.data(), id: doc.id });
        }
      });

      if (existe.length === 0) {

        let favorito = {
          "idLibro": props.id,
          "imagen": props.imagen,
          "titulo": props.titulo,
          "desc": props.desc,
          "usuario": userData.user.email
        }

        await saveFavorito(favorito);
        await getFavoritosDeApi();

      }


    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error,
      })
    }

  }

  const eliminarFavorito = async () => {
    await getFavoritosDeApi();
    try {
      await deleteFavorito(idFavorito);
      setFavorito(false);
      props.callback();
      await getFavoritosDeApi();
    } catch (error) {
      console.log(error);
      eliminarFavorito();
    }
  }


  const getFavoritosDeApi = async () => {
    const querySnapshot = await getFavoritos();
    const docs = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().idLibro === props.id && doc.data().usuario === userData.user.email) {
        setFavorito(true);
        setIdFavorito(doc.id);
        docs.push({ ...doc.data(), id: doc.id });
      }
    });
    setFavoritos(docs);
  };

  const [comentarios, setcomentarios] = useState([])

  const getComentariosDeApi = async () => {
    const querySnapshot = await getComentarios();
    const docs = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().idLibro === props.id) {
        docs.push({ ...doc.data(), id: doc.id });
      }
    });
    setcomentarios(docs);
  };


  useEffect(() => {
    getFavoritosDeApi();
    getComentariosDeApi();
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

    let newLibro = {
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

  const [mensaje, setMensaje] = useState("");

  const guardarComentario = async () => {

    let newComent = {
      idLibro: props.id,
      mensaje: mensaje,
      nombre: userData.user.displayName
    }

    if (mensaje === "") {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Debes ingresar un mensaje",
      })
    } else {
      try {
        saveComentario(newComent);
        getComentariosDeApi();
        setMensaje("");
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error,
        })
      }

    }

  };


  const handleReservar = async () => {

    let idLibro = props.id;

    let libro = await getLibro(idLibro);
    let reservado = libro.data().reservado;

    if (reservado) {

      Swal.fire({
        icon: 'error',
        title: 'Vaya...',
        text: "Lo sentimos parece que este libro ya fue reservado",
      })

    } else {

      let newLibro = {
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
          <Button onClick={handleReservar} className="m-2 btnLibro" variant="success"> <FaCalendarDay /> </Button>
        }

        {props.reservado && props.userReservado !== userData.user.email &&
          <Button className="m-2 btnLibro" variant="secondary"> <FaCalendarDay /> </Button>
        }

        {props.reservado && props.userReservado === userData.user.email &&
          <Button onClick={handleCancelarReservar} className="m-2 btnLibro" variant="danger"> <FaCalendarDay /> </Button>
        }




        <Button onClick={handleModalOpen} className="btnLibro" variant="primary"> <FaRegComments /> </Button>

        {!favorito &&
          <Button onClick={guardarFavorito} className="m-2 btnLibro"
            variant="secondary"
          > <FaHandHoldingHeart /> </Button>
        }

        {favorito &&
          <Button onClick={eliminarFavorito} className="m-2 btnLibro"
            variant="danger"
          > <FaHeartBroken /> </Button>
        }

      </div>


      {/* Modal Preview */}
      <Modal centered show={isModalOpen} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title className='textCenter'>Comentarios</Modal.Title>
        </Modal.Header>
        <Modal.Body className='d-flex justify-content-start align-items-center flex-column' style={{ overflowY: "scroll", width: "100%", height: "50vh" }}>

          {comentarios.map((comentario) => (
            <Toast show={true} animation={false} style={{ width: "100%", marginBottom: "20px" }}>
              <Toast.Header closeButton={false}>
                <img
                  src="holder.js/20x20?text=%20"
                  className="rounded me-2"
                  alt=""
                />
                <strong className="me-auto">{comentario.nombre}</strong>
              </Toast.Header>
              <Toast.Body>{comentario.mensaje}</Toast.Body>
            </Toast>
          ))}




        </Modal.Body>
        <Modal.Footer>
          <Col>

            <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)} type="text" placeholder="Escribe aquí..." style={{ width: "100%", borderRadius: "5px", resize: "none" }}></textarea>

            <Button variant="success" onClick={guardarComentario}>
              Enviar
            </Button>



          </Col>

        </Modal.Footer>
      </Modal>
      {/* MODAL PARA BORRAR */}

    </div>
  );
}

export default CardLibro;