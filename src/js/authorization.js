import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import { FirebaseService } from './firebaseservice';
import { refs } from './refs';
import { loadQueue, loadWatced } from './myLibrary';
import { openLibrary } from './navigation';
import { compareID } from './modal';
import { clickOnFilm } from './modal';
import { modalBtnRefs } from './modal-btn';

const userDisplayName = document.querySelector('.display-name');
const signIn = document.querySelector('[data-sign-in]');
const logout = document.querySelector('[data-sign-out]');
const signInBaner = document.querySelector('.sign-in-wrapper');
const galleryLibrary = document.querySelector('.gallery__list--library');
const pagination = document.querySelector('.pagination');
const libraryBtn = document.querySelector('[data-library]');

// -----------------------------------------------------------------------------
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB8JosctUlnHoYDhx27o-9K5qjoYQVd5I0',
  authDomain: 'filmoteka-29879.firebaseapp.com',
  projectId: 'filmoteka-29879',
  storageBucket: 'filmoteka-29879.appspot.com',
  messagingSenderId: '472506073059',
  appId: '1:472506073059:web:2595b335e9952e9d2bead6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();
const firebase = new FirebaseService();

// function writeUserData(userId, name, email) {
//   const db = getDatabase();
//   set(ref(db, 'users/' + userId), {
//     username: name,
//     email: email,
//   });
// }

const userAuth = () => {
  signInWithPopup(auth, provider)
    .then(result => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      firebase.userReg(user);
      firebase.user = emailCuter(user.email);
      // ...
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    })
    .finally(() => {
      window.location.reload();
    });
};

const signOutUser = () => {
  signOut(auth)
    .then(() => {
      signIn.parentNode.classList.toggle('is-hidden');
      logout.parentNode.classList.toggle('is-hidden');
      //Sigh-out successfull.
    })
    .catch(() => {
      // An error happened.
    });
};

onAuthStateChanged(auth, user => {
  console.log('user', user);

  // if (user == null) {
  //   signIn.addEventListener('click', () => {
  //     user.relo
  //   });
  // }

  libraryBtn.addEventListener('click', () => {
    if (user !== null) return;
    signInBaner.classList.remove('visually-hidden');
    pagination.classList.add('visually-hidden');
    galleryLibrary.classList.add('visually-hidden');
  });

  refs.movieList.addEventListener('click', e => {
    // const cardID = e.path[3].getAttribute('data-id');
    const cardID = e.target.closest('.gallery__item')
      ? e.target.closest('.gallery__item').dataset.id
      : null;

    console.log();
    clickOnFilm(e);
    if (user == null) {
      refs.wached.classList.add('visually-hidden');
      refs.queue.classList.add('visually-hidden');
      document.querySelector(
        '.btn_wraper'
      ).innerHTML = `<span style=" margin-left: auto;
        margin-right: auto;font-size: 10px;
        line-height: 1.19; color: red;">To add a movie to the library please login to your account! </span>`;
      return;
    }
    compareID(cardID, user);
  });

  if (user !== null) {
    signInBaner.classList.add('visually-hidden');
    galleryLibrary.classList.remove('visually-hidden');
    pagination.classList.remove('visually-hidden');
    firebase.user = emailCuter(user.email);
    refs.queueBtn.classList.add('library__btn--selected');

    // document.querySelector('.sign_notific').classList.add('visually-hidden')

    userDisplayName.innerHTML = emailCuter(user.email);
    signIn.parentNode.classList.toggle('is-hidden');
    logout.parentNode.classList.toggle('is-hidden');
  }

  modalBtnUserWatcher(user);
  libraryBtnUserWatcher(user);
});

signIn.addEventListener('click', () => {
  userAuth();
});

logout.addEventListener('click', () => {
  signOutUser();
  userDisplayName.innerHTML = null;
  // e.preventDefault()
});

function modalBtnUserWatcher(user) {
  refs.wached.addEventListener('click', e => {
    if (user == null) return;
    const info = JSON.parse(
      document.querySelector('.title_item_info').innerHTML
    );
    if (refs.wached.textContent === modalBtnRefs.addWatched.text) {
      firebase.postMovieToLibraryWached(info, emailCuter(user.email));
      refs.wached.textContent = modalBtnRefs.removeWatched.text;
      refs.wached.dataset.action = modalBtnRefs.removeWatched.act;
      if (refs.queue.textContent === modalBtnRefs.removeQueue.text) {
        firebase.removeMovieFromLibraryQueue(info, emailCuter(user.email));
        refs.queue.textContent = modalBtnRefs.addQueue.text;
        refs.queue.dataset.action = modalBtnRefs.addQueue.act;
      }
    } else {
      firebase.removeMovieFromLibraryWached(info, emailCuter(user.email));
      refs.wached.textContent = modalBtnRefs.addWatched.text;
      refs.wached.dataset.action = modalBtnRefs.addWatched.act;
    }
  });

  refs.queue.addEventListener('click', e => {
    if (user == null) return;
    const info = JSON.parse(
      document.querySelector('.title_item_info').innerHTML
    );
    if (refs.queue.textContent === modalBtnRefs.addQueue.text) {
      firebase.postMovieToLibraryQueue(info, emailCuter(user.email));
      refs.queue.textContent = modalBtnRefs.removeQueue.text;
      refs.queue.dataset.action = modalBtnRefs.removeQueue.act;
      if (refs.wached.textContent === modalBtnRefs.removeWatched.text) {
        firebase.removeMovieFromLibraryWached(info, emailCuter(user.email));
        refs.wached.textContent = modalBtnRefs.addWatched.text;
        refs.wached.dataset.action = modalBtnRefs.addWatched.act;
      }
    } else {
      firebase.removeMovieFromLibraryQueue(info, emailCuter(user.email));
      refs.queue.textContent = modalBtnRefs.addQueue.text;
      refs.queue.dataset.action = modalBtnRefs.addQueue.act;
    }
  });
}

function libraryBtnUserWatcher(user) {
  refs.watchedBtn.addEventListener('click', e => {
    loadWatced(user);
  });
  refs.queueBtn.addEventListener('click', e => {
    loadQueue(user);
  });

  refs.libraryBtn.addEventListener('click', () => {
    openLibrary(user);
  });
}

export function emailCuter(email) {
  return email.split('@')[0].replace(/[^a-zа-яё\s]/gi, '');
}
