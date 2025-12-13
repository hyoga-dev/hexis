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

export function resetPassword() {
  const emailPengguna = "user@example.com"; 

  sendPasswordResetEmail(auth, emailPengguna)
    .then(() => {
      // Email reset password berhasil terkirim!
      console.log("Email Reset Password Terkirim!");
      
      // ***Tindakan KRUSIAL***: Beri tahu pengguna
      alert(`Tautan reset password telah dikirim ke ${emailPengguna}. Silakan cek kotak masuk Anda.`);
      
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Gagal Mengirim Email Reset:", errorCode, errorMessage);
      
      if (errorCode === 'auth/user-not-found') {
        alert("Jika email Anda terdaftar, tautan reset password akan dikirimkan.");
      } else {
        alert(`Gagal mengirim email reset: ${errorMessage}`);
      }
    });
}