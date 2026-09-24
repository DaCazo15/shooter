import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { useFirestore, useCollection } from 'vuefire'

export function useCatalogo() {
  const db = useFirestore()
  const catalogoRef = collection(db, 'catalogo')

  const catalogo = useCollection(catalogoRef)

  const agregarItem = async (nuevoItem) => {
    return await addDoc(catalogoRef, nuevoItem)
  }

  const eliminarItem = async (id) => {
    return await deleteDoc(doc(db, 'catalogo', id))
  }

  const actualizarItem = async (id, datosActualizados) => {
    return await updateDoc(doc(db, 'catalogo', id), datosActualizados)
  }

  return {
    catalogo,
    agregarItem,
    eliminarItem,
    actualizarItem
  }
}
