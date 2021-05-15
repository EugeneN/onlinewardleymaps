import React, { memo } from 'react';
import PropTypes from 'prop-types';

const ResourceSymbol = props => {
	const { id, x, y, evolved, onClick, styles = {} } = props;
	const fill = evolved ? styles.evolvedFill : styles.fill;
	const stroke = evolved ? styles.evolved : styles.stroke;
	const points = `0,${styles.height} ${styles.width / 2},0 ${styles.width},${
		styles.height
	}`;

	console.log('ResourceSymbol', props, x, y, styles);

	return (
		<polygon
			id={id}
			x={x}
			y={y}
			points={points}
			strokeWidth={styles.strokeWidth}
			width={styles.width}
			height={styles.height}
			stroke={stroke}
			fill={fill}
			onClick={onClick}
		/>
	);
};

ResourceSymbol.propTypes = {
	onClick: PropTypes.func,
	id: PropTypes.string,
	x: PropTypes.string,
	y: PropTypes.string,
	width: PropTypes.string,
	height: PropTypes.string,
	styles: PropTypes.object.isRequired,
	evolved: PropTypes.bool,
};

export default memo(ResourceSymbol);
