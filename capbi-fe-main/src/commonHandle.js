import { Text, ErrorMessages } from './constant';
import { notifyError } from './notify';

function MoveToOtherPage(subDirectory) {
	window.location.href = subDirectory;
}

function deepObjectEqual(object1, object2) {
	const keys1 = Object.keys(object1);
	const keys2 = Object.keys(object2);

	if (keys1.length !== keys2.length) return false;

	for (const key of keys1) {
		const val1 = object1[key];
		const val2 = object2[key];
		const areObjects = isObject(val1) && isObject(val2);
		if ((areObjects && !deepObjectEqual(val1, val2)) || (!areObjects && val1 !== val2)) return false;
	}

	return true;
}

function isObject(obj) {
	return obj != null && typeof obj === 'object';
}

function getAllValuesOfObject(obj) {
	return Object.values(obj);
}

function checkIfEmptyValueExists(obj) {
	let allValues = getAllValuesOfObject(obj);

	for (let i in allValues) {
		if (allValues[i] === '') return true;
	}

	return false;
}

function checkMaxQuantityUploadedFiles(arrayFiles, maxNumberFiles) {
	if (arrayFiles.length > maxNumberFiles) {
		notifyError(ErrorMessages.upload.maxFile + maxNumberFiles + ' ' + Text.images + Text.dots);
		return true;
	}

	return false;
}

function checkMaxSizeUploadedFile(file, maxSize) {
	if (file && file.size && file.size > maxSize) {
		notifyError(ErrorMessages.upload.maxSize + Text.twoMegaByte + Text.dots);
		return true;
	}

	return false;
}

function checkTypeUploadedFile(file, arrayTypes) {
	if (file && file.type && !arrayTypes.includes(file.type)) {
		notifyError(ErrorMessages.upload.formatFile + Text.imageTypesString);
		return true;
	}

	return false;
}

function uploadFiles(
	previouslyUploadedFiles,
	recentlyUploadedFiles,
	maxQuantityUploadedFiles,
	maxSizeUploadedFile,
	arrayTypes,
	uploadFromModal = false,
) {
	let arrayFiles = [...previouslyUploadedFiles, ...Array.from(recentlyUploadedFiles)];
	let checkQuantityUploadedFiles = checkMaxQuantityUploadedFiles(arrayFiles, maxQuantityUploadedFiles);
	if (checkQuantityUploadedFiles) return;

	for (let i = 0; i < arrayFiles.length; i++) {
		let file = arrayFiles[i];

		let checkSizeUploadedFile = checkMaxSizeUploadedFile(file, maxSizeUploadedFile);
		if (checkSizeUploadedFile) return;
		let checkTypeFile = checkTypeUploadedFile(file, arrayTypes);
		if (checkTypeFile) return;

		// if (uploadFromModal) {
		file.url = URL.createObjectURL(file);
		arrayFiles[i] = file;
		// }
	}

	// Todo: Call api to create image object

	return arrayFiles;
}

function deleteFile(files, index) {
	const newFiles = [...files];
	newFiles.splice(index, 1);

	return newFiles;
}

export { MoveToOtherPage, deepObjectEqual, checkIfEmptyValueExists, uploadFiles, deleteFile };
