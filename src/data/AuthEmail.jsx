import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
// import { useNavigate } from "react-router-dom";

const auth = getAuth();
// const navigate = useNavigate();

// const email = "pengguna.baru@contoh.com";
// const password = "password_kuat_123";

export function signUp(email, password) {
  // const navigate = useNavigate();
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    // console.log("Pendaftaran Berhasil!", user);
    // navigate("/habit")
    window.location.href = '/habit';

  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Gagal Mendaftar:", errorCode, errorMessage);
  });
}

export function signIn(email, password) {
  // const navigate = useNavigate();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      window.location.href = '/habit';

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Gagal Login:", errorCode, errorMessage);

      alert("Password atau email salah")
    });
}

export function resetPassword(emailPengguna) {
  console.log("running")
  sendPasswordResetEmail(auth, emailPengguna)
    .then(() => {
      console.log("Email Reset Password Terkirim!");
      
      // alert(`Tautan reset password telah dikirim ke ${emailPengguna}. Silakan cek kotak masuk Anda.`);
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