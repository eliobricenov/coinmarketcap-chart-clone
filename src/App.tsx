import {
  AxisLabelsLocation,
  IgrCrosshairLayer,
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
  GridMode,
} from "igniteui-react-charts";
import { IgRect, IChartTooltipProps, Visibility } from "igniteui-react-core";
import { useRef } from "react";
import { BITCOIN_DATA } from "./bitcoin-data.ts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import VolumeLegend from "./components/VolumeLegend.tsx";

IgrZoomSliderModule.register();
IgrDataChartCoreModule.register();
IgrDataChartCategoryModule.register();
IgrDataChartInteractivityModule.register();
IgrDataChartAnnotationModule.register();
IgrNumberAbbreviatorModule.register();
IgrCrosshairLayerModule.register();

dayjs.extend(utc);

type BitcoinData = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  marketCap: number;
  timestamp: Date;
};

const MINIMAP_HEIGHT = "66px";

function formatValue(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    ...options,
  }).format(value);
}

function CustomTooltip({ data }: { data: BitcoinData }) {
  const date = dayjs(data.timestamp);
  return (
    <div className="flex flex-col p-2 gap-2">
      <div className="flex justify-between items-center mb-1">
        <span className="font-medium text-black">
          {date.format("MM/DD/YYYY")}
        </span>
        <span className="ml-5 text-gray-500 text-xs">
          {date.format("h:mm:ss A")}
        </span>
      </div>
      <span className="text-gray-500">
        <span className="indicator" />
        Price:{" "}
        <span className="font-medium text-black">{formatValue(data.open)}</span>
      </span>
      <span className="text-gray-500">
        <VolumeLegend />
        Vol 24h:{" "}
        <span className="font-medium text-black">
          {formatValue(data.volume, {
            notation: "compact",
            maximumFractionDigits: 2,
          })}
        </span>
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
    <div className="w-[929px] h-[396px] mx-auto mt-[100px]">
      <IgrDataChart
        ref={mainChartRef}
        dataSource={BITCOIN_DATA}
        width="100%"
        height={`calc(100% - ${MINIMAP_HEIGHT})`}
        defaultInteraction="DragPan"
        seriesMouseEnter={handleMouseEnter}
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
          dateTimeMemberPath="timestamp"
          titleLocation="outsideBottom"
          labelLocation="outsideBottom"
          stroke="#f0f2f5"
        />
        <IgrNumericYAxis
          name="yAxis"
          abbreviateLargeNumbers={true}
          labelLocation={AxisLabelsLocation.OutsideRight}
          majorStroke="#f5f6f7"
          stroke="#f0f2f5"
        />
        <IgrCrosshairLayer
          name="CrosshairLayer"
          thickness={1.1}
          verticalLineStroke="#a6b0c3"
          horizontalLineStroke="#a6b0c3"
          yAxisAnnotationBackground="#7d879a"
          xAxisAnnotationBackground="#7d879a"
          yAxisAnnotationBackgroundCornerRadius={0}
          xAxisAnnotationBackgroundCornerRadius={0}
          isAxisAnnotationEnabled={true}
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
      <div className={`w-full h-[${MINIMAP_HEIGHT}] relative mt-4`}>
        <div className={`w-full h-[${MINIMAP_HEIGHT}] absolute top-0 left-0`}>
          <IgrDataChart
            dataSource={BITCOIN_DATA}
            width="100%"
            height={MINIMAP_HEIGHT}
            outlines={["#f0f2f5"]}
            brushes={["#f0f2f5"]}
            gridMode={GridMode.None}
          >
            <IgrTimeXAxis
              name="zoomXAxis"
              dateTimeMemberPath="timestamp"
              labelVisibility={Visibility.Collapsed}
            />
            <IgrNumericYAxis
              name="zoomYAxis"
              labelVisibility={Visibility.Collapsed}
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
          // not using class because the canvas of the slider does not inherit the classnames
          style={{
            width: "100%",
            height: MINIMAP_HEIGHT,
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
            barExtent={0}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
