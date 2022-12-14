import { refs } from './refs';
const {
  watchedBtn,
  queueBtn,
  gallerySection__gallery,
  search,
  libraryFilter,
  galleryLibrary,
  libraryBtn,
  galleryMain,
} = refs;

import { makeGallaryLibrary } from './templates/renderMoviesLibrary';
import { pagination } from './pagination';
import { FirebaseService } from './firebaseservice';
import { ApiServise } from './apiServise';
export const apiServise = new ApiServise();
import { emailCuter } from './authorization';
import { switchGalleryTitleLibraryDarkTheme } from './colorSwitcher';
const firebase = new FirebaseService();

// function openLibrary() {
//
//  -------------------------------> Merget to navigation <----------------------

//   search.classList.add('visually-hidden');
//   libraryFilter.classList.remove('visually-hidden');
//   galleryLibrary.classList.remove('visually-hidden');
//   galleryLibrary.classList.add('library');
// }
export async function loadWatced(user) {
  refs.watchedBtn.classList.add('library__btn--selected');
  refs.queueBtn.classList.remove('library__btn--selected');
  galleryLibrary.innerHTML = '';

  if (user == null) return;
  const data = await firebase.GetUserWached(emailCuter(user.email));
  makeGallaryLibrary(data);
  switchGalleryTitleLibraryDarkTheme(refs);
  //TODO: додати рендер карток при натискані на кнопку
}

export async function loadQueue(user) {
  refs.watchedBtn.classList.remove('library__btn--selected');
  refs.queueBtn.classList.add('library__btn--selected');
  galleryLibrary.innerHTML = '';

  if (user == null) return;
  const data = await firebase.GetUserQueue(emailCuter(user.email));
  makeGallaryLibrary(data);
  switchGalleryTitleLibraryDarkTheme(refs);

  //TODO: додати рендер карток при натискані на кнопку
}
//  -------------------------------> addEventListener loadWatced AND loadQueue Merget to authorization
// watchedBtn.addEventListener('click', loadWatced);
// queueBtn.addEventListener('click', loadQueue); <----------------------

// libraryBtn.addEventListener('click', () => {
//   openLibrary()
//   onTrendMovies()
// });

//  -------------------------------> test <----------------------

// export async function onTrendMovies() {
//   const res = await apiServise.fetchTrendingMovies();
//   makeGallaryLibrary(res.results);
//   apiServise.totalPage = res.total_pages;
//   pagination(apiServise);
// }
// libraryBtn.addEventListener('click', onTrendMovies);
