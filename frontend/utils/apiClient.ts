import { hc } from 'hono/client';
import { AppType } from '../../../position_management/dist/src/app';


const apiUrl = 'http://localhost:3000/';

const token = localStorage.getItem('token')

const client: any = hc<AppType>(apiUrl, {

  headers: {
    Authorization: token ? `${token}`: '',
  }
  
}
)

export default client






