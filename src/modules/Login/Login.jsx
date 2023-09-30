import { loginEmailPassword, signInGoogle } from "../../Firebase/config";
import Swal from 'sweetalert2'
import { Await, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getUsuarios } from "../../Firebase/api";

function Login() {

  const navigate = useNavigate();

  async function sigIn(){
    await signInGoogle();

    const email = JSON.parse(localStorage.getItem('email'));
    const userData = email != null ? JSON.parse(localStorage.getItem('user')) : {};

    if (userData !== null){
      navigate('/Home'); 
      window.location.reload();
    }else{
      const error = localStorage.getItem('error');
      if(error === 'FirebaseError: Firebase: Error (auth/user-disabled).'){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Algo salio mal!',
          footer: '<strong> Se te a restringido el acceso comunicate con el administrador.</strong>'
        })
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Algo salio mal! comunicate con el administrador',
          footer: '<strong>'+error+'</strong>'
        })
      }
    }
  }

  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")

  
  async function sigInEmail(){  
      if(email === "" || password === ""){
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Faltan datos por llenar!',
        })
      }else{
        try {
          await loginEmailPassword(email, password);
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error
        })
      }
    }
  }


  async function init(){  
    const correo = await localStorage.getItem('correo');

    if (correo !== null){    
   
    const users = await getUsuarios();
    
    let nombre = "Default";
    let imagen = "https://i.pinimg.com/280x280_RS/42/03/a5/4203a57a78f6f1b1cc8ce5750f614656.jpg";
    users.forEach((doc) => {
      if (doc.data().email === correo){
        nombre = doc.data().nombre;
        imagen = doc.data().perfil;
      }  
      
    });

    let userData = {
      user: {
        displayName: nombre,
        email: correo,
        photoURL: imagen
      }
    }

    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/Home');
    window.location.reload();

  }else{
    const error = localStorage.getItem('error');
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error
    })
  }
}

const correo = localStorage.getItem('correo');

  if (correo !== null ){    
    init();
  }

  const error = localStorage.getItem('error');

  if(error !== null){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error
    })
    localStorage.removeItem('error');
  }

    return (
      <div className="Login">
        <div className="login-card">
        <h2 className="title">LOGIN</h2>
        <form className="login-form">
          <input type="text" placeholder="Correo" onChange={e => setemail(e.target.value)} value={email}/>
          <input type="password" placeholder="Contraseña" onChange={e => setpassword(e.target.value)} value={password} />
          <a className="text-center" href="/Registrar">Regístrate aquí...</a>
          <button type="button" onClick={sigInEmail}>LOGIN</button>
          <button className="p-2" style={{backgroundColor: "red"}} onClick={sigIn} type="button">GOOGLE</button>
        </form>
      </div>
      </div>
    );
  }
  
  export default Login;
  