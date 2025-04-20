/* eslint-disable */
import axios from 'axios';
import { showAlert} from './alert';

export const updateData = (name,email) => {
  try {
    const res = await axios({
      method: 'patch',

    })
  } catch (e) {
    showAlert(`error`, e.message.data.message);
  }
}
