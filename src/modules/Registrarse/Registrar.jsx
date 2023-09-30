import { crearEmailPassword } from "../../Firebase/config";
import Swal from 'sweetalert2'
import { useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { saveUsuario } from "../../Firebase/api";
import BlockUI from "../../components/BlockUi";



function Registrar() {

  const [loading, setLoading] = useState(false);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [selectedImage, setSelectedImage] = useState("");

  async function guardarUsuario(url){

      let user = {
          nombre: nombre,
          email: email,
          perfil: url
      }
      
      try {
        await saveUsuario(user);
        await crearEmailPassword(email, password);
        setLoading(false);
        limpiar();
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Bienvenido a la plataforma',
          confirmButtonText: 'Ok'
        });
      }
       catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error,
          })
      }
  }

  const sigIn = (e) => {
    e.preventDefault()

    if(nombre === "" || email === "" || password === "" || selectedImage === ""){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Todos los campos son obligatorios',
        })
    }else{
        setLoading(true);
        const storage = getStorage();
        const storageRef = ref(storage, selectedImage.name);
        const uploadTask = uploadBytesResumable(storageRef, selectedImage);
    
        uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
         },
        (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error,
            })
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
             guardarUsuario(downloadURL);
          });
        });
    }
  };


  const limpiar = () => {
    setLoading(false);
    setNombre("");
    setEmail("");
    setPassword("");
    setSelectedImage("");
  };  

    return (
      <div className="Login">
        <div className="login-card">
        <h2 className="title" >REGISTRO</h2>
        <form  onSubmit={sigIn}>

        <div className="login-form mb-2">
          <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} required/>
          <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} required/>
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}/>
        </div>
       
          <label htmlFor="portada" className="form-label">FOTO DE PERFIL</label>
          <input type="file" className="form-control login-form-none mb-2" id="portada" accept="image/*" onChange={e => setSelectedImage(e.target.files[0])} required/>
           
          <a href="/">Inicia sesión aquí....</a>
          <div className="login-form mt-2">
            <button type="submit" className="login-btn">REGISTRARTE</button>
          </div>
        </form>
      </div>

      <BlockUI  blocking={loading} />

      </div>
    );
  }
  
  export default Registrar;
  