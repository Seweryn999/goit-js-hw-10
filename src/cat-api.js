const headers = new Headers({
  'Content-Type': 'application/json',
  'x-api-key':
    'live_jYBSQmrSnbg8PZPLVqb265F9dkK2KoApoUJ6rkMDhbtD3kkVVei4C8gvvs1KcJiW',
});

const requestOptions = {
  method: 'GET',
  headers: headers,
  redirect: 'follow',
};

export function fetchBreeds() {
  return fetch('https://api.thecatapi.com/v1/breeds', requestOptions);
}

export function fetchCatByBreed(breedId) {
  return fetch(
    `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`,
    requestOptions
  );
}
