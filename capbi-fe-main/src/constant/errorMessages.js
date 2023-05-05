const please = 'Vui lòng ';
const pleaseCheckAgain = ' ' + please + 'kiểm tra lại.';
const ErrorMessages = {
	inputData: {
		empty: 'Tồn tại ít nhất một trường chưa có dữ liệu.' + pleaseCheckAgain,
		passwordsAreNotMatch: 'Mật khẩu và xác nhận mật khẩu không trùng nhau.' + pleaseCheckAgain,
	},
	register: {
		failed: 'Không thể đăng ký tài khoản bây giờ.',
	},
	get: 'Lấy dữ liệu không thành công',
	edit: 'Sửa dữ liệu không thành công',
	delete: 'Xóa dữ liệu không thành công.',
	create: 'Tạo mới dữ liệu không thành công',
	roles: {
		get: 'Chưa có dữ liệu để chọn vai trò khi đăng kí mới.',
		noChoose: 'Bạn chưa chọn vai trò cho người dùng.' + pleaseCheckAgain,
	},
	search: {
		noMatchingResults: 'Không có kết quả phù hợp với mong muốn tìm kiếm của bạn.',
	},
	upload: {
		maxFile: please + 'chỉ đăng tối đa ',
		maxSize: please + 'chỉ đăng file có kích thước tối đa ',
		formatFile: 'Định dạng file tải lên không đúng. ' + please + 'chỉ tải lên định dạng ',
	},
};

export default ErrorMessages;
