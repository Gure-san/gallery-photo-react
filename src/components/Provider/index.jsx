const SMALL_DESKTOP = 1024;
const NORMAL_DEKSTOP = 1280;

const RANDOM_NUMB_DEBUG = () => Math.floor(Math.random() * 6);
const GET_ACCESS = (variable) => import.meta.env[variable];
const URL = {
  INITIAL: "https://api.unsplash.com",
  PHOTOS: "/photos",
  RANDOM: "/photos/random",
  SEARCH: "/search/photos",
  CLIENT_ID: "client_id=",
  PARAMS: {
    PER_PAGE: "per_page=",
    COUNT: "count=",
    QUERY: "query="
  },
};

const BASE_HEAD = `${URL.INITIAL}`; 
const BASE_FOOT = `${URL.CLIENT_ID}${GET_ACCESS('VITE_UNSPLASH_API_KEY')}`;

function generateUrl({ type, count = 1, customValue = false }) {
  let url;
  switch (type) {
    case "EDITORIAL" :
      url = `${BASE_HEAD}${URL.PHOTOS}?${URL.PARAMS.PER_PAGE}${count}&${BASE_FOOT}`;
      return url;

    case "RANDOM" :
      url = `${BASE_HEAD}${URL.RANDOM}?${URL.PARAMS.COUNT}${count}&${BASE_FOOT}`;
      return url;

    case "RANDOM_SEARCH" :
      url = `${BASE_HEAD}${URL.RANDOM}?${URL.PARAMS.COUNT}${count}&${URL.PARAMS.QUERY}&${customValue}&${BASE_FOOT}`;
      return url;

    case "SEARCH" :
      url = `${BASE_HEAD}${URL.SEARCH}?${URL.PARAMS.QUERY}${customValue}&${BASE_FOOT}`;
      return url;

    
  }
}

function nameConnector(firstName, lastName) {
  const first_name = firstName != null ? firstName : "";
  const last_name = lastName != null ? lastName : "";
  return `${first_name} ${last_name}`;
}

function selectProps(obj, debug = false) {
  if(debug) {
    const data = {
      alt: obj.alt,
      width: obj.width,
      height: obj.height,
      url: obj.url,
      photographer: {
        name: obj.photographer.name,
        profil: obj.photographer.profil,
      },
      download: obj.download,
    };
    
    return data;
  }

  const data = {
    alt: obj.alt_description == null ? "" : obj.alt_description,
    width: obj.width,
    height: obj.height,
    url: obj.urls.regular,
    photographer: {
      name: nameConnector(obj.user.first_name, obj.user.last_name),
      profil: obj.user.links.html,
    },
    download: obj.links.download_location,
  };
  
  return data;
}

function selectionProperties(data, debug = false) {
  console.log(data)
  if(Array.isArray(data)) {
    const tempData = [];
    data.forEach((obj) => {
      tempData.push(selectProps(obj, debug));
    });
    return tempData;
  }

  return selectProps(data, debug)
}

function getDummyUrl() {
  const numb = RANDOM_NUMB_DEBUG();
  const urlHead = 'src/test/';
  let url = null;

  switch (numb) {
    case 0 : 
      url = `${urlHead}dataRandom_one.json`;
      break;

    case 1 :
      url = `${urlHead}dataRandom_two.json`;
      break;
    
    case 2 :
      url = `${urlHead}dataRandom_three.json`;
      break;

    case 3 :
      url = `${urlHead}dataRandom_four.json`;
      break;

    case 4 :
      url = `${urlHead}dataRandom_five.json`;
      break;

    case 5 : 
    url = `${urlHead}dataRandom_six.json`;
    break;
  }

  return url;
}


export { 
  GET_ACCESS,
  URL, 
  NORMAL_DEKSTOP,
  SMALL_DESKTOP,
  generateUrl,
  nameConnector,
  selectionProperties,
  getDummyUrl
}