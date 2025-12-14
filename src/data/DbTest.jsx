import { collection, addDoc, doc, updateDoc, deleteDoc, getDoc, where, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect } from "react";

const dumydata = {
    nama: "udines",
    age: 300
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 qss
async function addData() {
    try {
        const data = collection(db, "test")
        
        await addDoc(data, dumydata)        
    } catch (error) {
        console.log(error);
    }
}

async function updateData() {
    try {
        const data = doc(db, "test", "0IaPGcDkChX1t0CnJzCT")
        // console.log(data);
        await updateDoc(data, {
            nama: "bambang",
            alamat: "blitar"
        })
        
    } catch (error) {
        console.log(error);
        
    }
}

async function deleteData(dataId) {
    try {
        const dataDocRef = doc(db, "test", dataId)
        await deleteDoc(dataDocRef)
    } catch (error) {
        console.log(error);
        
    }
}

async function removeField(productId) {
    try {
        const productDocRef = doc(db, "products", productId);

        // Hapus field 'lastUpdated'
        await updateDoc(productDocRef, {
            lastUpdated: deleteField() 
        });

        console.log(`Field 'lastUpdated' successfully removed from document ${productId}.`);

    } catch (e) {
        console.error("Error removing field: ", e);
    }
}

async function bacaSatuData(idData) {
    try {
        const dataDocRef = doc(db, "test", idData);

        const docSnap = await getDoc(dataDocRef); 
        if (docSnap.exists()) { 
            const dataDokumen = docSnap.data();
            console.log("Data Dokumen:", dataDokumen);
            console.log({ id: docSnap.id, ...dataDokumen });
            return { id: docSnap.id, ...dataDokumen };
        } else {
            console.log(`Dokumen dengan ID: ${idData} tidak ditemukan.`);
            return null;
        }
    } catch (error) {
        console.error("Error saat membaca dokumen:", error);
        throw error; 
    }
}

async function bacaBanyakData(umur) {
    try {
        const koleksiDataRef = collection(db, "test")
        const q = query(koleksiDataRef, where("age", "<=", umur))
        const querySnapshot = await getDocs(q)
        const data = []
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() })
        })
        
        console.log(data);
        
    } catch (error) {
        console.log(error);
        
    }
}













const DbTest = () => {

    useEffect( () => {
        // addData()
        // updateData()
        // deleteData("0IaPGcDkChX1t0CnJzCT")
        // bacaSatuData("i9vvroL9terWVrlMGrhd")
        bacaBanyakData(500)
    }, [])







    return (
        <div style={{ fontSize: "20px", marginTop: "40px" }}>
            <p>hello this is db test</p>
        </div>
    )
}

export default DbTest;