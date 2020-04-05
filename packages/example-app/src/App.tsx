import React from 'react';
import {SeriesType} from 'lightweight-charts';
import {Chart, SeriesInitialOptions} from 'react-lightweight-charts';
import {LINE_STYLE, PRICE_SCALE_MODE} from 'react-lightweight-charts/utils';
import {RealtimeExample} from './samples/realtime';
import {VolumeExample} from './samples/volume';

import styles from './App.module.css';

const initialSeries: SeriesInitialOptions<SeriesType>[] = [
    {
        type: 'Area',
        data: [
            {time: '2018-12-22', value: 32.51},
            {time: '2018-12-23', value: 31.11},
            {time: '2018-12-24', value: 27.02},
            {time: '2018-12-25', value: 27.32},
            {time: '2018-12-26', value: 25.17},
            {time: '2018-12-27', value: 28.89},
            {time: '2018-12-28', value: 25.46},
            {time: '2018-12-29', value: 23.92},
            {time: '2018-12-30', value: 22.68},
            {time: '2018-12-31', value: 22.67},
        ],
        ref: (series) => console.log('Area created:', series),
    },
    {
        type: 'Line',
        data: [
            {time: '2018-12-12', value: 24.11},
            {time: '2018-12-13', value: 31.74},
        ],
        markers: [
            {
                time: '2019-04-09',
                position: 'aboveBar',
                color: 'black',
                shape: 'arrowDown',
            },
            {
                time: '2019-05-31',
                position: 'belowBar',
                color: 'red',
                shape: 'arrowUp',
                id: 'id3',
            },
            {
                time: '2019-05-31',
                position: 'belowBar',
                color: 'orange',
                shape: 'arrowUp',
                id: 'id4',
            },
        ],
        ref: (series) => console.log('Line created:', series),
    },
    {
        type: 'Bar',
        data: [
            {time: '2018-12-19', open: 141.77, high: 170.39, low: 120.25, close: 145.72},
            {time: '2018-12-20', open: 145.72, high: 147.99, low: 100.11, close: 108.19},
        ],
        priceLines: [
            {
                options: {
                    price: 80.0,
                    color: 'green',
                    lineWidth: 2,
                    lineStyle: LINE_STYLE.DOTTED,
                    axisLabelVisible: true,
                },
                ref: (priceLine) => console.log('Price line created:', priceLine),
            },
            {
                options: {
                    price: 80.0,
                    color: 'green',
                    lineWidth: 2,
                    lineStyle: LINE_STYLE.DASHED,
                    axisLabelVisible: true,
                },
                ref: (priceLine) => console.log('Price line created:', priceLine),
            }
        ],
        ref: (series) => console.log('Bar created:', series),
    }
];

function App() {
    return (
        <React.Fragment>
            <Chart
                className={styles.chart}
                style={{display: 'inline-block'}}
                options={{
                    width: 600,
                    height: 300,
                    priceScale: {
                        mode: PRICE_SCALE_MODE.NORMAL,
                    },
                }}
                initialSeries={initialSeries}
                onClick={(...args) => console.log('chart click', args)}
                onCrosshairMove={(...args) => console.log('crosshair move', args)}
                onVisibleTimeRangeChange={(...args) => console.log('time range change', args)}
            />
            <VolumeExample/>
            <RealtimeExample/>
        </React.Fragment>
    );
}

export default App;
