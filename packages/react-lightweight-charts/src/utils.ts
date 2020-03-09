import {CrosshairMode, LineStyle, LineType, PriceLineSource, PriceScaleMode} from 'lightweight-charts';

export const CROSSHAIR_MODE: Record<'NORMAL' | 'MAGNET', CrosshairMode> = {
	NORMAL: 0,
	MAGNET: 1,
}
export const LINE_STYLE: Record<'SOLID' | 'DOTTED' | 'DASHED' | 'LARGE_DASHED' | 'SPARSE_DOTTED', LineStyle> = {
	SOLID: 0,
	DOTTED: 1,
	DASHED: 2,
	LARGE_DASHED: 3,
	SPARSE_DOTTED: 4,
}
export const LINE_TYPE: Record<'SIMPLE' | 'WITH_STEPS', LineType> = {
	SIMPLE: 0,
	WITH_STEPS: 1,
}
export const PRICE_LINE_SOURCE: Record<'LAST_BAR' | 'LAST_VISIBLE', PriceLineSource> = {
	LAST_BAR: 0,
	LAST_VISIBLE: 1,
}
export const PRICE_SCALE_MODE: Record<'NORMAL' | 'LOGARITHMIC' | 'PERCENTAGE' | 'INDEXED_TO_100', PriceScaleMode> = {
	NORMAL: 0,
	LOGARITHMIC: 1,
	PERCENTAGE: 2,
	INDEXED_TO_100: 3,
}