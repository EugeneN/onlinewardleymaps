import React, { useMemo } from 'react';
import MethodElement from './MethodElement';
import MapElements from '../../MapElements';
import MapGrid from './foundation/MapGrid';
import MapEvolution from './foundation/MapEvolution';
import Pipeline from './Pipeline';
import ComponentLink from './ComponentLink';
import EvolvingComponentLink from './EvolvingComponentLink';
import MapComponent from './MapComponent';
import AnnotationElement from './AnnotationElement';
import AnnotationBox from './AnnotationBox';
import Anchor from './Anchor';
import Note from './Note';
import Attitude from './Attitude';
import LinksBuilder from '../../linkStrategies/LinksBuilder';
import MapGraphics from './foundation/MapGraphics';
import MapBackground from './foundation/MapBackground';
import SubMapSymbol from '../symbols/SubMapSymbol';
import ComponentSymbol from '../symbols/ComponentSymbol';
import CapabilitySymbol from '../symbols/CapabilitySymbol';
import ResourceSymbol from '../symbols/ResourceSymbol';
import MarketSymbol from '../symbols/MarketSymbol';
import EcosystemSymbol from '../symbols/EcosystemSymbol';

function MapCanvas(props) {
	const mapElements = new MapElements(
		[
			{ collection: props.mapComponents, type: 'component' },
			{ collection: props.mapSubMaps, type: 'submap' },
			{ collection: props.mapMarkets, type: 'market' },
			{ collection: props.mapEcosystems, type: 'ecosystem' },
			{ collection: props.mapCapabilities, type: 'capability' },
			{ collection: props.mapResources, type: 'resource' },
		],
		props.mapEvolved,
		props.mapPipelines
	);
	var getElementByName = function(elements, name) {
		var hasName = function(element) {
			return element.name === name;
		};
		return elements.find(hasName);
	};

	const linksBuilder = new LinksBuilder(
		props.mapLinks,
		mapElements,
		props.mapAnchors
	);
	const links = useMemo(() => linksBuilder.build(), [linksBuilder]);

	const asMethod = m =>
		Object.assign(
			{},
			{
				name: m.name,
				maturity: m.maturity,
				visibility: m.visibility,
				method: m.decorators.method,
			}
		);

	const decoratedComponentsMethods = mapElements
		.getMergedElements()
		.filter(m => m.decorators && m.decorators.method)
		.map(m => asMethod(m));

	const methods = props.mapMethods
		.filter(m => getElementByName(mapElements.getNonEvolvedElements(), m.name))
		.map(m => {
			const el = getElementByName(mapElements.getNonEvolvedElements(), m.name);
			const toTransform = Object.assign(el, {
				decorators: { method: m.method },
			});
			return asMethod(toTransform);
		});
	const allMeths = methods.concat(decoratedComponentsMethods);

	return (
		<React.Fragment>
			<svg
				fontFamily={props.mapStyleDefs.fontFamily}
				fontSize={props.mapStyleDefs.fontSize}
				className={props.mapStyleDefs.className}
				id="svgMap"
				width={props.mapDimensions.width + 2 * props.mapPadding}
				height={props.mapDimensions.height + 4 * props.mapPadding}
				viewBox={
					'-' +
					props.mapPadding +
					' 0 ' +
					(props.mapDimensions.width + props.mapPadding) +
					' ' +
					(props.mapDimensions.height + props.mapPadding)
				}
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
			>
				<MapGraphics mapStyleDefs={props.mapStyleDefs} />
				<g id="grid">
					<MapBackground
						mapDimensions={props.mapDimensions}
						mapStyleClass={props.mapStyleDefs.className}
					/>
					<MapGrid
						mapYAxis={props.mapYAxis}
						mapDimensions={props.mapDimensions}
						mapStyleDefs={props.mapStyleDefs}
						evolutionOffsets={props.evolutionOffsets}
					/>
					<MapEvolution
						mapDimensions={props.mapDimensions}
						mapEvolutionStates={props.mapEvolutionStates}
						mapStyleDefs={props.mapStyleDefs}
						evolutionOffsets={props.evolutionOffsets}
					/>
				</g>
				<g id="map">
					<g id="attitudes">
						{props.mapAttitudes.map((a, i) => (
							<Attitude
								key={i}
								mapDimensions={props.mapDimensions}
								mapStyleDefs={props.mapStyleDefs}
								mapText={props.mapText}
								mutateMapText={props.mutateMapText}
								attitude={a}
							/>
						))}
					</g>

					<g id="methods">
						{allMeths.map((m, i) => (
							<MethodElement
								key={i}
								element={m}
								mapStyleDefs={props.mapStyleDefs}
								mapDimensions={props.mapDimensions}
								method={m.method}
							/>
						))}
					</g>

					{links.map(current => {
						return (
							<g id={current.name} key={current.name}>
								{current.links.map((l, i) => (
									<ComponentLink
										setMetaText={props.setMetaText}
										metaText={props.metaText}
										mapStyleDefs={props.mapStyleDefs}
										key={i}
										mapDimensions={props.mapDimensions}
										startElement={l.startElement}
										endElement={l.endElement}
										link={l.link}
									/>
								))}
							</g>
						);
					})}

					<g id="evolvedLinks">
						{mapElements.getEvolveElements().map((e, i) => (
							<EvolvingComponentLink
								mapStyleDefs={props.mapStyleDefs}
								key={i}
								mapDimensions={props.mapDimensions}
								startElement={getElementByName(
									mapElements.getEvolvedElements(),
									e.name
								)}
								endElement={getElementByName(
									mapElements.getEvolveElements(),
									e.name
								)}
								link={e}
								evolutionOffsets={props.evolutionOffsets}
							/>
						))}
						;
					</g>
					<g id="anchors">
						{props.mapAnchors.map((el, i) => (
							<Anchor
								key={i}
								mapDimensions={props.mapDimensions}
								anchor={el}
								mapText={props.mapText}
								mutateMapText={props.mutateMapText}
								mapStyleDefs={props.mapStyleDefs}
								setHighlightLine={props.setHighlightLine}
							/>
						))}
					</g>
					<g id="pipelines">
						{mapElements.getMapPipelines().map((p, i) => (
							<Pipeline
								key={i}
								mapDimensions={props.mapDimensions}
								pipeline={p}
								mapText={props.mapText}
								mutateMapText={props.mutateMapText}
								setMetaText={props.setMetaText}
								metaText={props.metaText}
								mapStyleDefs={props.mapStyleDefs}
								setHighlightLine={props.setHighlightLine}
							/>
						))}
					</g>
					<g id="elements">
						{mapElements.getMergedElements().map((el, i) => (
							<MapComponent
								key={i}
								keyword={el.type}
								launchUrl={props.launchUrl}
								mapDimensions={props.mapDimensions}
								element={el}
								mapText={props.mapText}
								mutateMapText={props.mutateMapText}
								setMetaText={props.setMetaText}
								metaText={props.metaText}
								mapStyleDefs={props.mapStyleDefs}
								setHighlightLine={props.setHighlightLine}
							>
								{el.type === 'component' && (
									<ComponentSymbol
										id={'element_circle_' + el.id}
										styles={props.mapStyleDefs.component}
										evolved={el.evolved}
										onClick={() => props.setHighlightLine(el.line)}
									/>
								)}

								{(el.decorators && el.decorators.ecosystem) ||
								el.type === 'ecosystem' ? (
									<EcosystemSymbol
										id={'ecosystem_circle_' + el.id}
										styles={props.mapStyleDefs.component}
										onClick={() => props.setHighlightLine(el.line)}
									/>
								) : null}

								{(el.decorators && el.decorators.market) ||
								el.type === 'market' ? (
									<MarketSymbol
										id={'market_circle_' + el.id}
										styles={props.mapStyleDefs.component}
										onClick={() => props.setHighlightLine(el.line)}
									/>
								) : null}

								{el.type === 'submap' && (
									<SubMapSymbol
										id={'element_circle_' + el.id}
										styles={props.mapStyleDefs.submap}
										evolved={el.evolved}
										onClick={() => props.setHighlightLine(el.line)}
										launchUrl={() => props.launchUrl(el.url)}
									/>
								)}

								{el.type === 'capability' && (
									<CapabilitySymbol
										id={'capability_rect_' + el.id}
										styles={props.mapStyleDefs.capability}
										evolved={el.evolved}
										onClick={() => props.setHighlightLine(el.line)}
									/>
								)}

								{el.type === 'resource' && (
									<ResourceSymbol
										id={'resource_rect_' + el.id}
										styles={props.mapStyleDefs.resource}
										evolved={el.evolved}
										onClick={() => props.setHighlightLine(el.line)}
									/>
								)}
							</MapComponent>
						))}
					</g>

					<g id="notes">
						{props.mapNotes.map((el, i) => (
							<Note
								key={i}
								mapDimensions={props.mapDimensions}
								note={el}
								mapText={props.mapText}
								mutateMapText={props.mutateMapText}
								mapStyleDefs={props.mapStyleDefs}
								setHighlightLine={props.setHighlightLine}
							/>
						))}
					</g>

					<g id="annotations">
						{props.mapAnnotations.map((a, i) => (
							<React.Fragment key={i}>
								{a.occurances.map((o, i1) => (
									<AnnotationElement
										mapStyleDefs={props.mapStyleDefs}
										key={i1 + '_' + i}
										annotation={a}
										occurance={o}
										occuranceIndex={i1}
										mapDimensions={props.mapDimensions}
										mutateMapText={props.mutateMapText}
										mapText={props.mapText}
									/>
								))}
							</React.Fragment>
						))}
						{props.mapAnnotations.length === 0 ? null : (
							<AnnotationBox
								mapStyleDefs={props.mapStyleDefs}
								mutateMapText={props.mutateMapText}
								mapText={props.mapText}
								annotations={props.mapAnnotations}
								position={props.mapAnnotationsPresentation}
								mapDimensions={props.mapDimensions}
							/>
						)}
					</g>
				</g>
			</svg>
		</React.Fragment>
	);
}

export default MapCanvas;
