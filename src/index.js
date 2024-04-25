import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

axios.defaults.headers.common['x-api-key'] =
  'live_jYBSQmrSnbg8PZPLVqb265F9dkK2KoApoUJ6rkMDhbtD3kkVVei4C8gvvs1KcJiW';

const catBreedsList = document.querySelector('.breed-select');
const loadingPanel = document.querySelector('.loader');
const spinnerLoader = document.querySelector('.loader_circle');
const errorMessage = document.querySelector('.error');
const catDetailsContainer = document.querySelector('.cat-info');

catBreedsList.setAttribute('hidden', '');
errorMessage.setAttribute('hidden', '');

const hideLoading = () => loadingPanel.setAttribute('hidden', '');

const showLoading = () => loadingPanel.removeAttribute('hidden');

const deleteSpinner = () => spinnerLoader.remove();

const switchSpinner = () => spinnerLoader.classList.toggle('loader_circle');

const addBreedOption = obj => {
  const option = document.createElement('option');
  option.value = obj.id;
  option.textContent = obj.name;
  catBreedsList.insertAdjacentElement('beforeend', option);
};

const displayCatDetails = catData => {
  const catImage = document.createElement('img');
  catImage.src = catData[0].url;
  catImage.width = '320';
  catImage.style.marginTop = '20px';

  catDetailsContainer.insertAdjacentElement('beforeend', catImage);

  const textDetails = document.createElement('div');
  textDetails.style.paddingLeft = '20px';
  catDetailsContainer.insertAdjacentElement('beforeend', textDetails);

  const catBreed = catData[0].breeds[0];

  const breedHeader = document.createElement('h2');
  breedHeader.textContent = catBreed.name;
  breedHeader.style.fontFamily = 'Pacifico';
  textDetails.insertAdjacentElement('beforeend', breedHeader);

  const breedDescription = document.createElement('p');
  breedDescription.textContent = catBreed.description;
  textDetails.insertAdjacentElement('beforeend', breedDescription);

  const breedTemperament = document.createElement('p');
  breedTemperament.innerHTML = `<b>Temperament: </b>${catBreed.temperament}.`;
  textDetails.insertAdjacentElement('beforeend', breedTemperament);
};

fetchBreeds()
  .then(response => response.text())
  .then(result => {
    Notify.success('Breeds loades succesfully');
    catBreedsList.removeAttribute('hidden');
    hideLoading();
    deleteSpinner();

    const catBreedsArray = JSON.parse(result);
    catBreedsArray.forEach(addBreedOption);
  })
  .catch(error => {
    hideLoading();
    switchSpinner();
    errorMessage.removeAttribute('hidden');
    Notify.failure('Server is out of our reach');
    console.log(error);
  });

catBreedsList.addEventListener('change', ev => {
  loadingPanel.after(spinnerLoader);
  catDetailsContainer.innerHTML = '';
  showLoading();

  fetchCatByBreed(ev.target.value)
    .then(response => response.text())
    .then(data => {
      Notify.success(`We've found your cat`);
      hideLoading();
      deleteSpinner();
      const catData = JSON.parse(data);
      displayCatDetails(catData);
      console.log(catData[0].breeds[0]);
    })
    .catch(error => {
      hideLoading();
      spinnerLoader.classList.remove('loader_circle');
      errorMessage.removeAttribute('hidden');
      Notify.failure(`We weren't able to find your cat`);
      console.log(error);
    });
});
