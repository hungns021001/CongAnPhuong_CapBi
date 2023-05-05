import React from 'react';
import classNames from 'classnames/bind';
import { TiDelete } from 'react-icons/ti';
import styles from './index.module.css';
const cx = classNames.bind(styles);

function ImagesInCreatedModal({ images, deleteImage, showSlideImage }) {
	const handleDeleteImage = (e, index) => {
		e.stopPropagation();
		deleteImage(index);
	};

	return (
		<div className={cx('uploadedImages')}>
			{images &&
				images.length > 0 &&
				images.map((image, index) => {
					return (
						<div
							className={cx('imageAndIconDelete')}
							key={image.url + index}
							onClick={() => showSlideImage(index)}
						>
							<img src={image.url} />
							<TiDelete className={cx('iconDelete')} onClick={(e) => handleDeleteImage(e, index)} />
						</div>
					);
				})}
		</div>
	);
}

export default ImagesInCreatedModal;
