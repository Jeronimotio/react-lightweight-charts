import React from 'react';
import {
    BarPrice,
    ChartOptions,
    createChart,
    DeepPartial,
    IChartApi,
    IPriceLine,
    ISeriesApi,
    MouseEventHandler,
    MouseEventParams,
    PriceLineOptions,
    SeriesDataItemTypeMap,
    SeriesMarker,
    SeriesPartialOptionsMap,
    SeriesType,
    Time,
    TimeRange,
    TimeRangeChangeEventHandler
} from 'lightweight-charts';

export type PriceLineInitialOptions = {
    // TODO: Nominal<number, 'BarPrice'> problem
    options: { price: BarPrice | number } & Omit<PriceLineOptions, 'price'>;
    ref?: (ref: IPriceLine) => void;
}

export type SeriesInitialOptions<T extends SeriesType> = {
    type: T;
    data: SeriesDataItemTypeMap[T][];
    options?: SeriesPartialOptionsMap[T];
    ref?: (ref: ISeriesApi<T>) => void;
} & {
    markers?: SeriesMarker<Time>[];
    priceLines?: PriceLineInitialOptions[];
};

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
                    setupSeries(series, definition);
                    break;
                }
                case 'Bar': {
                    const series = instance.addBarSeries(definition.options);
                    setupSeries(series, definition);
                    break;
                }
                case 'Candlestick': {
                    const series = instance.addCandlestickSeries(definition.options);
                    setupSeries(series, definition);
                    break;
                }
                case 'Histogram': {
                    const series = instance.addHistogramSeries(definition.options);
                    setupSeries(series, definition);
                    break;
                }
                case 'Line': {
                    const series = instance.addLineSeries(definition.options);
                    setupSeries(series, definition);
                    break;
                }
            }
        }
        this.subscribeEvents();
    }

    componentDidUpdate(prevProps: Readonly<ChartProps>, prevState: Readonly<ChartState>, snapshot?: any): void {
        if (prevState.options !== this.state.options) {
            this.api.applyOptions(this.state.options ?? {});
        }
    }

    componentWillUnmount(): void {
        this.unsubscribeEvents();

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

    private subscribeEvents(): void {
        this.api.subscribeClick(this._handleOnClick);
        this.api.subscribeCrosshairMove(this._handleOnCrosshairMove);
        this.api.subscribeVisibleTimeRangeChange(this._handleOnVisibleTimeRangeChange);
    }

    private unsubscribeEvents(): void {
        this.api.unsubscribeClick(this._handleOnClick);
        this.api.unsubscribeCrosshairMove(this._handleOnCrosshairMove);
        this.api.unsubscribeVisibleTimeRangeChange(this._handleOnVisibleTimeRangeChange);
    }

    private _handleOnClick: MouseEventHandler = (params: MouseEventParams) => {
        if (this.props.onClick) {
            this.props.onClick(params);
        }
    }

    private _handleOnCrosshairMove: MouseEventHandler = (params: MouseEventParams) => {
        if (this.props.onCrosshairMove) {
            this.props.onCrosshairMove(params);
        }
    }

    private _handleOnVisibleTimeRangeChange: TimeRangeChangeEventHandler = (timeRange: TimeRange | null) => {
        if (this.props.onVisibleTimeRangeChange) {
            this.props.onVisibleTimeRangeChange(timeRange);
        }
    }
}

function assert(condition: boolean, message?: string): asserts condition {
    if (!condition) {
        throw new Error(message ?? 'Failed assertion');
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

function setupSeries<T extends SeriesType>(series: ISeriesApi<T>, definition: SeriesInitialOptions<T>): void {
    series.setData(definition.data);
    if (definition.markers) {
        series.setMarkers(definition.markers);
    }
    if (definition.priceLines) {
        setupPriceLines(series, definition.priceLines);
    }
    if (definition.ref) {
        definition.ref(series);
    }
}