import React, { memo } from 'react';
import PropTypes from 'prop-types';

const CapabilitySymbol = props => {
	const { id, x, y, evolved, onClick, styles = {} } = props;
	const fill = evolved ? styles.evolvedFill : styles.fill;
	const stroke = evolved ? styles.evolved : styles.stroke;

	console.log('CapabilitySymbol', props, x, y, styles);

	return (
		<rect
			id={id}
			x={x}
			y={y}
			strokeWidth={styles.strokeWidth}
			width={styles.width}
			height={styles.height}
			stroke={stroke}
			fill={fill}
			onClick={onClick}
		/>
	);
};

CapabilitySymbol.propTypes = {
	onClick: PropTypes.func,
	id: PropTypes.string,
	x: PropTypes.string,
	y: PropTypes.string,
	width: PropTypes.string,
	height: PropTypes.string,
	styles: PropTypes.object.isRequired,
	evolved: PropTypes.bool,
};

export default memo(CapabilitySymbol);
