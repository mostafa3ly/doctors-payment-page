import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://sbcheckout.PayFort.com/'
});

instance.defaults.headers.post['Content-Type'] = 'multipart/form-data';


export default instance;