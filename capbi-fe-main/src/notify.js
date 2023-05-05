import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Time } from './constant';

function notifySuccess(message) {
	toast(message, {
		position: 'top-center',
		autoClose: Time.runAfter.ThreeSeconds,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: 'light',
	});
}

function notifyError(message) {
	toast(message, {
		position: 'top-center',
		autoClose: Time.runAfter.ThreeSeconds,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: 'dark',
	});
}

export { notifySuccess, notifyError };
