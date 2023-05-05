import React, { useEffect, useRef, useState } from 'react';
import { TiDelete } from 'react-icons/ti';
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from 'react-icons/io';
import classNames from 'classnames/bind';
import { Text } from '@/constant';
import styles from './index.module.css';

const cx = classNames.bind(styles);

function SlideImages({ images, selectedImageIndex, closeSlideImage }) {
	const divRef = useRef(null);
	const [currentImageIndex, setCurrentImageIndex] = useState(selectedImageIndex);
	const [disableArrowRight, setDisableArrowRight] = useState('');
	const [disableArrowLeft, setDisableArrowLeft] = useState('');

	const showNextImage = () => {
		if (!disableArrowRight && currentImageIndex < images.length - 1) setCurrentImageIndex(currentImageIndex + 1);
	};

	const showPreviousImage = () => {
		if (!disableArrowLeft && currentImageIndex > 0) setCurrentImageIndex(currentImageIndex - 1);
	};

	useEffect(() => {
		setDisableArrowRight(currentImageIndex === images.length - 1 ? Text.disableArrowRight : '');
		setDisableArrowLeft(currentImageIndex === 0 ? Text.disableArrowLeft : '');
	}, [currentImageIndex, images]);

	useEffect(() => {
		const handleKeyPress = (e) => {
			switch (e.keyCode) {
				case Text.key.escape:
					closeSlideImage();
					break;
				case Text.key.arrowRight:
					showNextImage();
					break;
				case Text.key.arrowLeft:
					showPreviousImage();
					break;
			}
		};

		document.addEventListener(Text.keydown, handleKeyPress);

		return () => {
			document.removeEventListener(Text.keydown, handleKeyPress);
		};
	}, [closeSlideImage, currentImageIndex]);

	useEffect(() => {
		function handleClickOutside(e) {
			if (divRef.current && !divRef.current.contains(e.target)) closeSlideImage();
		}

		document.addEventListener(Text.mousedown, handleClickOutside);

		return () => {
			document.removeEventListener(Text.mousedown, handleClickOutside);
		};
	}, [divRef]);

	return (
		<div className={cx('wrapper')}>
			<TiDelete className={cx('iconClose')} onClick={closeSlideImage} />
			<div className={cx('imageFrame')} ref={divRef}>
				<img src={images[currentImageIndex].url} />
				{images && images.length > 1 && (
					<>
						<IoIosArrowDropleftCircle
							className={cx('arrowToLeft', `${disableArrowLeft}`)}
							onClick={showPreviousImage}
						/>
						<IoIosArrowDroprightCircle
							className={cx('arrowToRight', `${disableArrowRight}`)}
							onClick={showNextImage}
						/>
					</>
				)}
			</div>
		</div>
	);
}

export default SlideImages;
