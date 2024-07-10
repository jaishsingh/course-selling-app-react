import axios from 'axios';

async function axiosWrapper(config) {
	return (await axios(config)).data;
}

export { axiosWrapper };
