import axios from 'axios';
import { wrapper as axiosCookieJarSupport } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

axiosCookieJarSupport(axios);

const BASE_URL = "http://10.242.109.78:8000"

const jar = new CookieJar();

export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  jar,
})
