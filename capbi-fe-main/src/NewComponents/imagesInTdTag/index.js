import cn from 'classnames';
import styles from './index.module.css';
import { Text } from '@/constant';

const FIRST_IMAGE = 0;
const SECOND_IMAGE = 1;
const THIRD_IMAGE = 2;

function ImagesInTdTag({ images, showSlideImage }) {
	return (
		<div className={cn(styles.images)}>
			<img src={images[FIRST_IMAGE].url} title={Text.seeImages} onClick={() => showSlideImage(FIRST_IMAGE)} />
			{images[SECOND_IMAGE] && (
				<img
					src={images[SECOND_IMAGE].url}
					title={Text.seeImages}
					onClick={() => showSlideImage(SECOND_IMAGE)}
				/>
			)}
			{images.length > Text.maxQuantityImagesToShow && (
				<div
					className={cn(styles.fakeLastImage)}
					title={Text.seeImages}
					onClick={() => showSlideImage(THIRD_IMAGE)}
				>
					<p className={cn(styles.numberOfImagesNotShown)}>
						{Text.plus}
						{images.length - Text.maxQuantityImagesToShow}
					</p>
				</div>
			)}
		</div>
	);
}

export default ImagesInTdTag;
