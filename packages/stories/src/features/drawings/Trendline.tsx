import * as React from "react";
import {
    discontinuousTimeScaleProviderBuilder,
    CandlestickSeries,
    Chart,
    ChartCanvas,
    XAxis,
    YAxis,
    YAxisProps,
    withDeviceRatio,
    withSize,
    TrendLine,
} from "react-financial-charts";
import { IOHLCData, withOHLCData } from "../../data";

interface ChartProps extends Partial<YAxisProps> {
    readonly data: IOHLCData[];
    readonly height: number;
    readonly ratio: number;
    readonly width: number;
}

class TrendlineExample extends React.Component<ChartProps> {
    private readonly xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
        (d: IOHLCData) => d.date,
    );

    public state = {
        trendlines: [
            {
                start: [1675, 59.21684396668361],
                end: [1693, 54.89519878626569],
                selected: false,
                appearance: {
                    strokeStyle: "#000000",
                    strokeWidth: 1,
                    strokeDasharray: "Solid",
                    edgeStrokeWidth: 1,
                    edgeFill: "#FFFFFF",
                    edgeStroke: "#000000",
                    r: 6,
                },
                type: "LINE",
            },
            {
                start: [1670, 54.125004595696154],
                end: [1707, 54.146398878767535],
                selected: true,
                appearance: {
                    strokeStyle: "#000000",
                    strokeWidth: 1,
                    strokeDasharray: "Solid",
                    edgeStrokeWidth: 1,
                    edgeFill: "#FFFFFF",
                    edgeStroke: "#000000",
                    r: 6,
                },
                type: "LINE",
            },
        ] as any[],
    };

    public render() {
        const { axisAt = "right", data: initialData, height, ratio, width, ...rest } = this.props;

        const margin = {
            bottom: 24,
            left: axisAt === "left" ? 48 : 0,
            right: axisAt === "right" ? 48 : 0,
            top: 0,
        };

        const { data, xScale, xAccessor, displayXAccessor } = this.xScaleProvider(initialData);

        const max = xAccessor(data[data.length - 1]);
        const min = xAccessor(data[Math.max(0, data.length - 100)]);
        const xExtents = [min, max];

        return (
            <ChartCanvas
                height={height}
                ratio={ratio}
                width={width}
                margin={margin}
                data={data}
                displayXAccessor={displayXAccessor}
                seriesName="Data"
                xScale={xScale}
                xAccessor={xAccessor}
                xExtents={xExtents}
            >
                <Chart id={1} yExtents={this.yExtents}>
                    <XAxis />
                    <YAxis axisAt={axisAt} {...rest} />
                    <CandlestickSeries />
                    <TrendLine
                        enabled={false}
                        type="LINE"
                        snap={false}
                        snapTo={(d) => [d.high, d.low]}
                        onComplete={(e: React.MouseEvent, newTrends: any[]) => {
                            console.log({ newTrends });
                            this.setState({ trendlines: newTrends });
                        }}
                        trends={this.state.trendlines}
                        onSelect={(e: React.MouseEvent, interactives: any[], moreProps: any) => {
                            console.log({ e, interactives, moreProps });
                            this.setState({ trendlines: interactives });
                        }}
                    />
                </Chart>
            </ChartCanvas>
        );
    }

    private readonly yExtents = (data: IOHLCData) => {
        return [data.high, data.low];
    };
}

export default withOHLCData()(withSize({ style: { minHeight: 600 } })(withDeviceRatio()(TrendlineExample)));
