import {CrosshairMode, LineStyle, LineType, PriceLineSource, PriceScaleMode} from 'lightweight-charts';

export const CROSSHAIR_MODE = {
	NORMAL: CrosshairMode.Normal,
	MAGNET: CrosshairMode.Magnet,
} as const;
export const LINE_STYLE = {
	SOLID: LineStyle.Solid,
	DOTTED: LineStyle.Dotted,
	DASHED: LineStyle.Dashed,
	LARGE_DASHED: LineStyle.LargeDashed,
	SPARSE_DOTTED: LineStyle.SparseDotted,
} as const;
export const LINE_TYPE = {
	SIMPLE: LineType.Simple,
	WITH_STEPS: LineType.WithSteps,
} as const;
export const PRICE_LINE_SOURCE = {
	LAST_BAR: PriceLineSource.LastBar,
	LAST_VISIBLE: PriceLineSource.LastVisible,
} as const;
export const PRICE_SCALE_MODE = {
	NORMAL: PriceScaleMode.Normal,
	LOGARITHMIC: PriceScaleMode.Logarithmic,
	PERCENTAGE: PriceScaleMode.Percentage,
	INDEXED_TO_100: PriceScaleMode.IndexedTo100,
} as const;
