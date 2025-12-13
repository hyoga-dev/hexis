import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

// const email = "pengguna.baru@contoh.com";
// const password = "password_kuat_123";

export function signUp(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log("Pendaftaran Berhasil!", user);
        window.location.href = '/habit';
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Gagal Mendaftar:", errorCode, errorMessage);
      });
}

export function signIn(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log("Login Berhasil!", user);
        window.location.href = '/habit';
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Gagal Login:", errorCode, errorMessage);

        alert("Password atau email salah")
      });
}