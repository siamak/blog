window.onload = () => {
	/* Cache Elements */
	const placeholder = document.querySelector('.cover');
	const ratiobody = document.querySelector('#ratio_body');
	const small = placeholder.querySelector('.img-small');
	let ratio = placeholder.dataset.ratio;

	/* Calculate Aspect Ratio */
	if (ratio.length > 6) {
		ratio = (1 / ratio) * 100;
	}
	ratiobody.style.paddingBottom = `${ratio}%`;

	/**
	 * Load Blur image before load Hero-image
	 * @return {[type]} [description]
	 */
	function createImg() {
		const img = new Image();
		img.src = small.src;
		img.onload = () => {
			small.classList.add('super--hero');
		};

		const imgLarge = new Image();
		imgLarge.src = placeholder.dataset.large;
		imgLarge.onload = () => {
			imgLarge.classList.add('super--hero');
			setTimeout(() => {
				small.remove();
			}, 2500);
		};
		placeholder.appendChild(imgLarge);
	}

	/* setTimeout :) */
	setTimeout(createImg, 1000);
};
