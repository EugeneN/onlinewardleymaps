import React, { memo } from 'react';
import PropTypes from 'prop-types';

const CapabilitySymbol = props => {
	const { id, rx, ry, evolved, onClick, styles = {} } = props;
	const fill = evolved ? styles.evolvedFill : styles.fill;
	const stroke = evolved ? styles.evolved : styles.stroke;

	return (
		<rect
			id={id}
			rx={rx}
			ry={ry}
			strokeWidth={styles.strokeWidth}
			r={styles.radius}
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
	rx: PropTypes.string,
	ry: PropTypes.string,
	width: PropTypes.string,
	height: PropTypes.string,
	styles: PropTypes.object.isRequired,
	evolved: PropTypes.bool,
};

export default memo(CapabilitySymbol);
