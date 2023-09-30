import { Button } from "react-bootstrap";
import { FaHeartBroken } from "react-icons/fa";
import { deleteFavorito, getFavoritos } from "../Firebase/api";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

function CardFavorito(props) {

    const userData = JSON.parse(localStorage.getItem('user'));

    const eliminarFavorito = async () => {
        try {
            console.log(props.id)
            await deleteFavorito(props.id);
            props.callback();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
            })
        }
    }

    const [favorito, setFavorito] = useState(false);

    const getFavoritosDeApi = async () => {
        const querySnapshot = await getFavoritos();
        querySnapshot.forEach((doc) => {
            if (doc.data().idLibro === props.id && doc.data().usuario === userData.user.email) {
                setFavorito(true);
            }
        });
    };

    useEffect(() => {
        getFavoritosDeApi();
    }, []);

    return (
        <div className="CardFavorito">
            <img src={props.imagen} alt="Imagen no disponible" />
            <div className="optionsLibro">

                <Button onClick={eliminarFavorito} className="m-2 btnLibro"
                    variant="danger"
                > <FaHeartBroken /> </Button>

            </div>
        </div>
    );
}

export default CardFavorito;