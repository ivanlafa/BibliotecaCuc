import { db } from "./config";

import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
  } from "firebase/firestore";

const libros = "libros";
const Favoritos = "favoritos";
const Usuario = "Usuario";
const Comentarios = "comentarios";

// libros
export const saveLibro = (newLink) =>
addDoc(collection(db, libros), newLink);

export const updateLibro = (id, updatedFields) =>
updateDoc(doc(db, libros, id), updatedFields);

export const getLibros = () => getDocs(collection(db, libros));

export const deleteLibro = (id) => deleteDoc(doc(db, libros, id));

export const getLibro = (id) => getDoc(doc(db, libros, id));


// Favoritos
export const saveFavorito = (newLink) =>
addDoc(collection(db, Favoritos), newLink);

export const updateFavorito = (id, updatedFields) =>
updateDoc(doc(db, Favoritos, id), updatedFields);

export const getFavoritos = () => getDocs(collection(db, Favoritos));

export const deleteFavorito = (id) => deleteDoc(doc(db, Favoritos, id));

export const getFavorito = (id) => getDoc(doc(db, Favoritos, id));


// Usuario
export const saveUsuario = (newLink) =>
addDoc(collection(db, Usuario), newLink);

export const updateUsuario = (id, updatedFields) =>
updateDoc(doc(db, Usuario, id), updatedFields);

export const getUsuarios = () => getDocs(collection(db, Usuario));

export const deleteUsuario = (id) => deleteDoc(doc(db, Usuario, id));

export const getUsuario = (id) => getDoc(doc(db, Usuario, id));


// Comentarios
export const saveComentario = (newLink) =>
addDoc(collection(db, Comentarios), newLink);

export const updateComentario = (id, updatedFields) =>
updateDoc(doc(db, Comentarios, id), updatedFields);

export const getComentarios = () => getDocs(collection(db, Comentarios));

export const deleteComentario = (id) => deleteDoc(doc(db, Comentarios, id));

export const getComentario = (id) => getDoc(doc(db, Comentarios, id));