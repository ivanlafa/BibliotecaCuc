import { useEffect, useState } from "react";
import SideBar from "../../components/Sidebar";
import { Button, Modal, ProgressBar } from "react-bootstrap";
import Swal from "sweetalert2";
import { getLibros, saveLibro, updateLibro, deleteLibro } from "../../Firebase/api";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import iconEdit from "../../assets/icons/edit.png";
import iconDelete from "../../assets/icons/delete.png";
import BlockUI from "../../components/BlockUi";

function Admin() {
  const [loading, setLoading] = useState(false);
  const [save, setSave] = useState(true);
  const [id, setId] = useState("");

  const [progreso, setProgreso] = useState(0);
  const [position, setPosition] = useState("top-start");
  const [verProgres, setVerProgres] = useState(true);

  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [disponible, setDisponible] = useState(false);

  const [libros, setLibros] = useState([]);

  const [previewImage, setPreviewImage] = useState("");

  const handleImageSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile !== undefined) {
      setSelectedImage(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));
    } else {
      setSelectedImage(null);
      setPreviewImage(null);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const validarCampos = () => {
    if (
      titulo.length === 0 ||
      autor.length === 0 ||
      descripcion.length === 0 ||
      fecha.length === 0 ||
      selectedImage === null
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Parece que te falto algún campo!",
      });
      return false;
    } else {
      handleModalOpen();
    }
  };

  const LimpiarCampos = async () => {
    setVerProgres(true);
    setLoading(false);
    setTitulo("");
    setAutor("");
    setDescripcion("");
    setFecha("");
    setProgreso(0);
    setSelectedImage("");
    setPreviewImage("");
    setSave(true);
  };

  const guardarImagen = () => {
    handleModalClose();
    setLoading(true);
    const storage = getStorage();
    const storageRef = ref(storage, selectedImage.name);
    const uploadTask = uploadBytesResumable(storageRef, selectedImage);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgreso(progress);
      },
      (error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error,
        });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          guardarLibro(downloadURL);
        });
      }
    );
  };

  const guardarLibro = async (url) => {
    let libro = {
      titulo: titulo,
      autor: autor,
      descripcion: descripcion,
      fecha: fecha,
      imagen: url,
      disponible: disponible,
      reservado: false,
      userReservado: "",
    };

    try {
      if (save) {
        await saveLibro(libro);
        handleModalClose();
        LimpiarCampos();
        getLibrosDeApi();
        Swal.fire({
          icon: "success",
          title: "¡Genial!",
          text: "Se ha guardado el libro",
        });
      } else {
        await updateLibro(id, libro);
        handleModalClose();
        LimpiarCampos();
        getLibrosDeApi();
        Swal.fire({
          icon: "success",
          title: "¡Genial!",
          text: "Se ha actualizado el libro",
        });
      }
    } catch (error) {
      getLibrosDeApi();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
    }
  };

  const editarLibro = (
    id,
    titulo,
    autor,
    descripcion,
    fecha,
    imagen,
    disponible
  ) => {
    setSave(false);
    setId(id);
    setTitulo(titulo);
    setAutor(autor);
    setDescripcion(descripcion);
    setFecha(fecha);
    setSelectedImage(null);
    setPreviewImage("");
  };

  const eliminarLibro = async (id) => {
    try {
      Swal.fire({
        text: "¿Estás seguro de que deseas eliminar este libro?",
        title: "Alerta",
        icon: "question",
        showCancelButton: true,
      }).then(async (respuesta)=> {
        if (respuesta.isConfirmed) {
          await deleteLibro(id)
          Swal.fire({
            text: "Libro eliminado",
            title: "Correcto",
            icon: "success",
          }).then((respuesta) => {
            getLibrosDeApi();
          })
        }
      })
  } catch (error) {
      setLoading(false);
      Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error,
        })
  }
  };

  const getLibrosDeApi = async () => {
    const querySnapshot = await getLibros();
    const docs = [];
    querySnapshot.forEach((doc) => {
      docs.push({ ...doc.data(), id: doc.id });
    });
    setLibros(docs);
  };

  useEffect(() => {
    getLibrosDeApi();
  }, []);

  return (
    <div className="App">
      <SideBar />

      <main>
        <h1 className="m-3 title">PANEL ADMINISTRADOR</h1>

        <div className="container">
          <div className="col">
            <div className="row-lg mb-5">
              <form>
                <div className="row">
                  <div className="mb-3 col">
                    <label htmlFor="titulo" className="form-label">
                      Titulo:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="titulo"
                      maxLength={35}
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                    />
                  </div>

                  <div className="mb-3 col">
                    <label htmlFor="autor" className="form-label">
                      Autor:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="autor"
                      maxLength={35}
                      value={autor}
                      onChange={(e) => setAutor(e.target.value)}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="mb-3 col">
                    <label htmlFor="fecha" className="form-label">
                      Fecha de publicación:
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="fecha"
                      value={fecha}
                      onChange={(e) => setFecha(e.target.value)}
                    />
                  </div>

                  <div className="mb-3 col">
                    <label htmlFor="portada" className="form-label">
                      Portada:
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="portada"
                      accept="image/*"
                      onChange={handleImageSelect}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label">
                    Descripción:
                  </label>
                  <textarea
                    className="form-control"
                    id="descripcion"
                    rows="3"
                    maxLength={200}
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  ></textarea>
                </div>

                <div className="form-check mb-3">
                  <label className="form-check-label" htmlFor="disponible">
                    ¿Disponible?
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="disponible"
                    value={disponible}
                    onChange={(e) => setDisponible(e.target.checked)}
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-danger m-1"
                  onClick={LimpiarCampos}
                >
                  Limpiar campos
                </button>
                <button
                  type="button"
                  className="btn btn-success m-1"
                  onClick={validarCampos}
                >
                  {save ? "Guardar Libro" : "Actualizar Libro"}
                </button>
              </form>
            </div>
            <div className="row-lg">
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr className="text-center">
                      <th scope="col">Id</th>
                      <th scope="col">Titulo</th>
                      <th scope="col">Autor</th>
                      <th scope="col">Descripción</th>
                      <th scope="col">Fecha</th>
                      <th scope="col">Portada</th>
                      <th scope="col">¿Disponible?</th>
                      <th scope="col">Editar</th>
                      <th scope="col">Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {libros.map((libro) => (
                      <tr className="text-center" key={libro.id}>
                        <td>{libro.id}</td>
                        <td>{libro.titulo}</td>
                        <td>{libro.autor}</td>
                        <td>{libro.descripcion}</td>
                        <td>{libro.fecha}</td>
                        <td>
                          {" "}
                          <img
                            style={{ width: "100px", minHeight: "150px" }}
                            src={libro.imagen}
                            alt="Error al cargar la portada"
                          />
                        </td>
                        <td>
                          {libro.disponible ? "Disponible" : "No disponible"}
                        </td>

                        <td>
                          <Button
                            variant="transparent"
                            onClick={() =>
                              editarLibro(
                                libro.id,
                                libro.titulo,
                                libro.autor,
                                libro.descripcion,
                                libro.fecha,
                                libro.imagen,
                                libro.disponible
                              )
                            }
                          >
                            <img className="iconEdit" src={iconEdit} alt="" />
                          </Button>
                        </td>

                        <td>
                          <Button
                            variant="transparent"
                            onClick={() => eliminarLibro(libro.id)}
                          >
                            <img className="iconEdit" src={iconDelete} alt="" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Preview */}
        <Modal centered show={isModalOpen} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title className="textCenter">Vista previa libro</Modal.Title>
          </Modal.Header>
          <Modal.Body className="d-flex justify-content-center align-items-center flex-column">
            {previewImage && (
              <img
                src={previewImage}
                style={{ width: "200px", minHeight: "250px" }}
                className="mb-3"
                alt="Preview"
              />
            )}

            <h5 className="textCenter">{titulo}</h5>
            <h5 className="textCenter">{autor}</h5>
            <h6 className="textCenter">{fecha}</h6>

            <p
              style={{
                wordWrap: "break-word",
                width: "80%",
                textAlign: "center",
                margin: "auto",
              }}
            >
              {descripcion}
            </p>
            <p>{disponible ? "Disponible" : "No disponible"}</p>

            {progreso > 0 && (
              <ProgressBar
                animated
                variant="primary"
                now={progreso}
                style={{ width: "80%", margin: "auto" }}
                className="text-center mt-3 progress"
                striped
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              CERRAR
            </Button>
            <Button variant="success" onClick={guardarImagen}>
              CONFIRMAR
            </Button>
          </Modal.Footer>
        </Modal>
        {/* MODAL PARA BORRAR */}

        <ToastContainer
          className="p-3 position-fixed"
          position={position}
          style={{ zIndex: 1 }}
          hidden={verProgres}
        >
          <Toast>
            <Toast.Header closeButton={false}>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto">Espera un poco </strong>
            </Toast.Header>
            <Toast.Body className="d-flex justify-content-center align-items-center flex-column text-center">
              Se esta guardando el libro por favor no cierres la pestaña ni
              cambies de vista
              {progreso > 0 && (
                <ProgressBar
                  animated
                  variant="primary"
                  now={progreso}
                  style={{ width: "80%", margin: "auto" }}
                  className="text-center mt-3 progress"
                  striped
                />
              )}
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </main>

      <BlockUI blocking={loading} />
    </div>
  );
}

export default Admin;
