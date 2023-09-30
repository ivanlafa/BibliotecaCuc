import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

import { FaHome, FaHeart, FaArchive, FaRegIdCard , FaSignOutAlt} from "react-icons/fa";

function SideBar() {

    const navigate = useNavigate();
    const toggleSidebar = () => document.body.classList.toggle("open");
    const userData = JSON.parse(localStorage.getItem('user'));

    function signOut(){

        Swal.fire({
            title: 'Seguro que quieres salir?',
            text: "Asegúrate de haber acabado todo lo que hacías :)",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Si, Seguro!'
          }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                window.location.reload();
            }
          })
    
        
    }

    return (
      <div className="SideBar">
        
        <button type="button" className="burger" onClick={toggleSidebar}>
        <img className="burger-avatar" src={userData.user.photoURL} alt="" />
        <span className="burger-icon"></span>
        </button>
        <div className="overlay"></div>
        <aside className="sidebar">
        <img className="sidebar-avatar" src={userData.user.photoURL} alt="avatar" />
        <div className="sidebar-username text-center">{userData.user.displayName}</div>
        <nav className="sidebar-menu">

            <button type="button" onClick={() => navigate('/')}>
            <FaHome size={20} color="#fff"/>
            <span>Home</span>
            </button>

            <button type="button"  onClick={() => navigate('/Favoritos')}>
            <FaHeart size={20} color="#fff"/>
            <span>Favoritos</span>
            </button>

            <button type="button"  onClick={() => navigate('/Reservas')}>
            <FaArchive size={20} color="#fff"/>
            <span>Reservas</span>
            </button>



        </nav>
        <nav className="sidebar-menu bottom">

        { userData.user.email === 'ivanlafa98@gmail.com' &&
            <button type="button"  onClick={() => navigate('/Admin')}>
            <FaRegIdCard size={20} color="#fff"/>
            <span>Admin</span>
            </button>
        }

            <button type="button" onClick={signOut}>
            <FaSignOutAlt size={35} color="#fff"/>
            <span>Cerrar Sesión</span>
            </button>
            
        </nav>
        </aside>

      </div>
    );
  }
  
  export default SideBar;
  