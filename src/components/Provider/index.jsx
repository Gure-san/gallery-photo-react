const SMALL_DESKTOP = 1024;
const NORMAL_DEKSTOP = 1280;

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

    case "SEARCH" :
      url = `${BASE_HEAD}${URL.SEARCH}?${URL.PARAMS.QUERY}${customValue}&${BASE_FOOT}`;
      return url;

    
  }
}

export { 
  GET_ACCESS,
  URL, 
  NORMAL_DEKSTOP,
  SMALL_DESKTOP,
  generateUrl
}