const GET_ACCESS = (variable) => import.meta.env[variable];
const URL = {
  INITIAL: "https://api.unsplash.com",
  RANDOM: "/photos/random",
  SEARCH: "/search/photos",
  CLIENT_ID: "client_id=",
  PARAMS: {
    PER_PAGE: "per_page=",
    COUNT: "count=",
  },
};

export { GET_ACCESS, URL }