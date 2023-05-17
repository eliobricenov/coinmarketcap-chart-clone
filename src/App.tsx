import {
  AxisLabelsLocation,
  IgrCrosshairLayerModule,
  IgrDataChart,
  IgrDataChartAnnotationModule,
  IgrDataChartCategoryModule,
  IgrDataChartCoreModule,
  IgrDataChartInteractivityModule,
  IgrNumberAbbreviatorModule,
  IgrNumericYAxis,
  IgrSplineAreaSeries,
  IgrTimeXAxis,
  IgrZoomSlider,
  IgrZoomSliderModule,
  MarkerType,
  IgrChartMouseEventArgs,
  IgrSeriesViewer,
} from "igniteui-react-charts";
import { IgRect, IChartTooltipProps } from "igniteui-react-core";
import { useRef } from "react";
import { BITCOIN_DATA } from "./bitcoin-data.ts";

IgrZoomSliderModule.register();
IgrDataChartCoreModule.register();
IgrDataChartCategoryModule.register();
IgrDataChartInteractivityModule.register();
IgrDataChartAnnotationModule.register();
IgrNumberAbbreviatorModule.register();
IgrCrosshairLayerModule.register();

type BitcoinData = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  marketCap: number;
  timestamp: Date;
};

function formatValue(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    ...options,
  }).format(value);
}

function CustomTooltip({ data }: { data: BitcoinData }) {
  return (
    <div className="flex flex-col p-4">
      <span className="">{formatValue(data.open)}</span>
      <span className="">
        {formatValue(data.volume, {
          notation: "compact",
          maximumFractionDigits: 2,
        })}
      </span>
    </div>
  );
}

function App() {
  const mainChartRef = useRef<IgrDataChart | null>(null);
  const zoomSliderRef = useRef<IgrZoomSlider | null>(null);

  const handleMouseEnter = (
    _s: IgrSeriesViewer,
    chartEvent: IgrChartMouseEventArgs
  ) => {
    chartEvent.series.tooltipTemplate = ({
      dataContext,
    }: IChartTooltipProps) => {
      const { item } = dataContext;
      return <CustomTooltip data={item} />;
    };
  };

  const handleZoomSliderWindowChanged = () => {
    const mainChart = mainChartRef.current;
    const zoomSlider = zoomSliderRef.current;

    if (!mainChart || !zoomSlider) return;

    const zoomWindow = zoomSlider.windowRect;
    const chartWindow = mainChart.actualWindowRect;

    updateChartZoom(mainChart, {
      top: chartWindow.top,
      left: zoomWindow.left,
      width: zoomWindow.width,
      height: chartWindow.height,
    });
  };

  const updateChartZoom = (chart: IgrDataChart, zoom: IgRect) => {
    const data = BITCOIN_DATA;
    const mainChart = mainChartRef.current;
    const zoomSlider = zoomSliderRef.current;

    const yAxis = chart.actualAxes[1] as IgrNumericYAxis;

    if (!mainChart || !zoomSlider) return;

    let indexStart = Math.floor((data.length - 1) * zoom.left);
    let indexEnd = Math.ceil((data.length - 1) * (zoom.left + zoom.width));

    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;

    if (indexStart < 0) {
      indexStart = 0;
    }

    indexEnd = Math.min(indexEnd, data.length - 1);

    for (let i = indexStart; i <= indexEnd; i++) {
      min = Math.min(min, data[i].open);
      max = Math.max(max, data[i].open);
    }

    const yMin =
      (min - yAxis.actualMinimumValue) /
      (yAxis.actualMaximumValue - yAxis.actualMinimumValue);

    const yMax =
      (max - yAxis.actualMinimumValue) /
      (yAxis.actualMaximumValue - yAxis.actualMinimumValue);

    chart.windowRect = {
      left: zoom.left,
      width: zoom.width,
      top: 1 - yMax,
      height: yMax - yMin,
    };
  };

  return (
    <div style={{ width: "calc(100% - 10px)", height: "calc(100% - 10px)" }}>
      <IgrDataChart
        ref={mainChartRef}
        dataSource={BITCOIN_DATA}
        width="100%"
        height="calc(100% - 160px)"
        defaultInteraction="DragPan"
        seriesMouseEnter={handleMouseEnter}
        markerOutlines={["#19c785"]}
        markerBrushes={["#19c785"]}
        outlines={["#19c785"]}
        brushes={
          [
            {
              type: "linearGradient",
              colorStops: [
                {
                  color: "#c2ecd8",
                  offset: 0,
                },
                {
                  color: "#ffffff",
                  offset: 0.95,
                },
              ],
            },
          ] as any
        }
      >
        <IgrTimeXAxis
          name="xAxis"
          label="Date"
          dateTimeMemberPath="timestamp"
          titleLocation="outsideBottom"
          labelLocation="outsideBottom"
          strokeThickness={3}
        />
        <IgrNumericYAxis
          name="yAxis"
          abbreviateLargeNumbers={true}
          labelLocation={AxisLabelsLocation.OutsideRight}
        />
        <IgrSplineAreaSeries
          name="priceSeries"
          xAxisName="xAxis"
          yAxisName="yAxis"
          valueMemberPath="open"
          title="Price"
          showDefaultTooltip="false"
          markerType={MarkerType.None}
        />
      </IgrDataChart>
      <div style={{ width: "100%", height: "160px", position: "relative" }}>
        <div
          style={{
            width: "100%",
            height: "160px",
            position: "absolute",
            top: "0px",
            left: "0px",
          }}
        >
          <IgrDataChart
            dataSource={BITCOIN_DATA}
            width="100%"
            height="160px"
            isHorizontalZoomEnabled="true"
            isVerticalZoomEnabled="true"
          >
            <IgrTimeXAxis
              name="zoomXAxis"
              label="Date"
              dateTimeMemberPath="timestamp"
              titleLocation="outsideBottom"
              labelLocation="outsideBottom"
              strokeThickness={3}
            />
            <IgrNumericYAxis
              name="zoomYAxis"
              abbreviateLargeNumbers={true}
              labelLocation={AxisLabelsLocation.OutsideRight}
            />
            <IgrSplineAreaSeries
              name="priceSeries"
              xAxisName="zoomXAxis"
              yAxisName="zoomYAxis"
              valueMemberPath="open"
              title="Price"
              markerType={MarkerType.None}
            />
          </IgrDataChart>
        </div>
        <div
          style={{
            width: "100%",
            height: "160px",
            position: "absolute",
            top: "0px",
            left: "0px",
          }}
        >
          <IgrZoomSlider
            ref={zoomSliderRef}
            width="100%"
            height="100%"
            windowRectChanged={handleZoomSliderWindowChanged}
            areThumbCalloutsEnabled="true"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
