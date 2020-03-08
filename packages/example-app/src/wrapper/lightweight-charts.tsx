import React from 'react';
import {
    BarPrice,
    ChartOptions,
    createChart,
    DeepPartial,
    IChartApi, IPriceLine, ISeriesApi, MouseEventHandler, PriceLineOptions, SeriesDataItemTypeMap, SeriesMarker,
    SeriesPartialOptionsMap,
    SeriesType, Time, TimeRangeChangeEventHandler
} from 'lightweight-charts';

export type PriceLineInitialOptions = {
    // TODO: Nominal<number, 'BarPrice'> problem
    options: { price: BarPrice | number } & Omit<PriceLineOptions, 'price'>;
    ref?: (ref: IPriceLine) => void;
}

export type SeriesInitialOptions<T> = T extends SeriesType ? {
    type: T;
    data: SeriesDataItemTypeMap[T][];
    options?: SeriesPartialOptionsMap[T];
    ref?: (ref: ISeriesApi<T>) => void;
} & {
    markers?: SeriesMarker<Time>[];
    priceLines?: PriceLineInitialOptions[];
} : never;

export type ChartProps = {
    className?: string;
    style?: React.CSSProperties;
    options?: DeepPartial<ChartOptions>;
    initialSeries?: SeriesInitialOptions<SeriesType>[];
    onClick?: MouseEventHandler;
    onCrosshairMove?: MouseEventHandler;
    onVisibleTimeRangeChange?: TimeRangeChangeEventHandler;
}

export type ChartState = {
    options?: DeepPartial<ChartOptions>;
}

export class Chart extends React.PureComponent<ChartProps, ChartState> {
    private instance: IChartApi | null = null;
    private container: HTMLElement | null = null;

    constructor(props: ChartProps) {
        super(props);
        this.state = Chart.getStateFromProps(props);
    }

    static getDerivedStateFromProps(props: ChartProps): ChartState {
        // May be we should compare props.options and state.options
        return Chart.getStateFromProps(props);
    }

    private static getStateFromProps(props: ChartProps): ChartState {
        return {
            options: props.options,
        };
    }

    componentDidMount(): void {
        assert(this.container !== null);
        const instance = this.instance = createChart(this.container, this.state.options);

        const {initialSeries = []} = this.props;
        for (const definition of initialSeries) {
            switch (definition.type) {
                case 'Area': {
                    const series = instance.addAreaSeries(definition.options);
                    series.setData(definition.data);
                    setupCommonSeriesOptions(series, definition);
                    if (definition.ref) {
                        definition.ref(series);
                    }
                    break;
                }
                case 'Bar': {
                    const series = instance.addBarSeries(definition.options);
                    series.setData(definition.data);
                    setupCommonSeriesOptions(series, definition);
                    if (definition.ref) {
                        definition.ref(series);
                    }
                    break;
                }
                case 'Candlestick': {
                    const series = instance.addCandlestickSeries(definition.options);
                    series.setData(definition.data);
                    setupCommonSeriesOptions(series, definition);
                    if (definition.ref) {
                        definition.ref(series);
                    }
                    break;
                }
                case 'Histogram': {
                    const series = instance.addHistogramSeries(definition.options);
                    series.setData(definition.data);
                    setupCommonSeriesOptions(series, definition);
                    if (definition.ref) {
                        definition.ref(series);
                    }
                    break;
                }
                case 'Line': {
                    const series = instance.addLineSeries(definition.options);
                    series.setData(definition.data);
                    setupCommonSeriesOptions(series, definition);
                    if (definition.ref) {
                        definition.ref(series);
                    }
                    break;
                }
            }
        }

        this.updateSubscriptions(null, this.props);
    }

    componentDidUpdate(prevProps: Readonly<ChartProps>, prevState: Readonly<ChartState>, snapshot?: any): void {
        if (prevState.options !== this.state.options) {
            this.api.applyOptions(this.state.options ?? {});
        }
        this.updateSubscriptions(prevProps, this.props);
    }

    componentWillUnmount(): void {
        this.updateSubscriptions(this.props, null);

        assert(this.instance !== null);
        this.instance.remove();
        this.instance = null;
    }

    get api(): IChartApi {
        assert(this.instance !== null);
        return this.instance;
    }

    render(): React.ReactNode {
        const {options, initialSeries, onClick, onCrosshairMove, onVisibleTimeRangeChange, ...rest} = this.props;
        return (
            <div {...rest } ref={this.handleContainerRef}/>
        );
    }

    private handleContainerRef = (ref: HTMLElement | null) => {
        this.container = ref;
    }

    private updateSubscriptions(prevProps: ChartProps | null, nextProps: ChartProps | null): void {
        if (prevProps?.onClick) {
            this.api.unsubscribeClick(prevProps.onClick);
        }
        if (prevProps?.onCrosshairMove) {
            this.api.unsubscribeCrosshairMove(prevProps.onCrosshairMove);
        }
        if (prevProps?.onVisibleTimeRangeChange) {
            this.api.unsubscribeVisibleTimeRangeChange(prevProps.onVisibleTimeRangeChange);
        }

        if (nextProps?.onClick) {
            this.api.subscribeClick(nextProps.onClick);
        }
        if (nextProps?.onCrosshairMove) {
            this.api.subscribeCrosshairMove(nextProps.onCrosshairMove);
        }
        if (nextProps?.onVisibleTimeRangeChange) {
            this.api.subscribeVisibleTimeRangeChange(nextProps.onVisibleTimeRangeChange);
        }
    }
}

function assert(condition: boolean, message?: string): asserts condition {
    if (!condition) {
        throw new Error(message ?? 'Failed assertion');
    }
}

function setupCommonSeriesOptions(series: ISeriesApi<SeriesType>, definition: SeriesInitialOptions<SeriesType>) {
    if (definition.markers) {
        series.setMarkers(definition.markers);
    }
    if (definition.priceLines) {
        setupPriceLines(series, definition.priceLines);
    }
}

function setupPriceLines(series: ISeriesApi<SeriesType>, priceLines: PriceLineInitialOptions[]): void {
    for (const definition of priceLines) {
        // TODO: Nominal<number, 'BarPrice'> problem
        const line = series.createPriceLine(definition.options as PriceLineOptions)
        if (definition.ref) {
            definition.ref(line);
        }
    }
}