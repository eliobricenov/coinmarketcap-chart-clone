import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  AxisLabelsLocation,
  GridMode,
  IgrChartMouseEventArgs,
  IgrCrosshairLayer,
  IgrCrosshairLayerModule,
  IgrDataChart,
  IgrDataChartAnnotationModule,
  IgrDataChartCategoryModule,
  IgrDataChartCoreModule,
  IgrDataChartInteractivityModule,
  IgrNumberAbbreviatorModule,
  IgrNumericYAxis,
  IgrSeriesViewer,
  IgrSplineAreaSeries,
  IgrTimeXAxis,
  IgrZoomSlider,
  IgrZoomSliderModule,
  MarkerType,
} from "igniteui-react-charts";
import { IChartTooltipProps, IgRect, Visibility } from "igniteui-react-core";
import { useRef, useState } from "react";
import VolumeLegend from "./components/VolumeLegend.tsx";
import { BITCOIN_DATA } from "./mock-data/bitcoin-data.ts";
import { BitcoinData, Timeframe } from "./types.ts";

IgrZoomSliderModule.register();
IgrDataChartCoreModule.register();
IgrDataChartCategoryModule.register();
IgrDataChartInteractivityModule.register();
IgrDataChartAnnotationModule.register();
IgrNumberAbbreviatorModule.register();
IgrCrosshairLayerModule.register();

dayjs.extend(utc);
const MINIMAP_HEIGHT = "66px";

function formatValue(value: number, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    ...options,
  }).format(value);
}

function CustomTooltip({ data }: { data: BitcoinData }) {
  const date = dayjs(data.date);
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
        <span className="font-medium text-black">
          {formatValue(data.price)}
        </span>
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
  const [timeframe, setTimeframe] = useState<Timeframe>("all");
  const mainChartRef = useRef<IgrDataChart | null>(null);
  const zoomSliderRef = useRef<IgrZoomSlider | null>(null);

  const dataSource = BITCOIN_DATA[timeframe];

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

  const calculateZoomSliderWindow = (timeframe: Timeframe) => {
    const mainChart = mainChartRef.current;
    const zoomSlider = zoomSliderRef.current;

    if (!mainChart || !zoomSlider) return;

    const allData = BITCOIN_DATA["all"];
    const timeframeData = BITCOIN_DATA[timeframe];

    const startDate = timeframeData[0].date;
    let startPosition = 0;

    for (let i = 0; i < allData.length; i++) {
      startPosition = i;
      if (dayjs(allData[i].date).isAfter(startDate)) {
        break;
      }
    }

    const width = (allData.length - startPosition) / allData.length;

    zoomSlider.windowRect = {
      ...zoomSlider.windowRect,
      width,
      left: 1 - width,
    };

    const sliderWindow = zoomSlider.windowRect;
    const chartWindow = mainChart.actualWindowRect;

    const zoom = {
      top: chartWindow.top,
      left: sliderWindow.left,
      width: sliderWindow.width,
      height: chartWindow.height,
    };

    updateChartZoom(zoom);
  };

  const handleZoomSliderWindowChanged = () => {
    const mainChart = mainChartRef.current;
    const zoomSlider = zoomSliderRef.current;

    if (!mainChart || !zoomSlider) return;

    setTimeframe("all");

    const sliderWindow = zoomSlider.windowRect;
    const chartWindow = mainChart.actualWindowRect;

    const zoom = {
      top: chartWindow.top,
      left: sliderWindow.left,
      width: sliderWindow.width,
      height: chartWindow.height,
    };

    updateChartZoom(zoom);
  };

  const updateChartZoom = (zoom: IgRect) => {
    const data = BITCOIN_DATA["all"];
    const mainChart = mainChartRef.current;
    const zoomSlider = zoomSliderRef.current;

    if (!mainChart || !zoomSlider) return;

    const yAxis = mainChart.actualAxes[1] as IgrNumericYAxis;

    let indexStart = Math.floor((data.length - 1) * zoom.left);
    let indexEnd = Math.ceil((data.length - 1) * (zoom.left + zoom.width));

    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;

    if (indexStart < 0) {
      indexStart = 0;
    }

    indexEnd = Math.min(indexEnd, data.length - 1);

    for (let i = indexStart; i <= indexEnd; i++) {
      min = Math.min(min, data[i].price);
      max = Math.max(max, data[i].price);
    }

    const yMin =
      (min - yAxis.actualMinimumValue) /
      (yAxis.actualMaximumValue - yAxis.actualMinimumValue);

    const yMax =
      (max - yAxis.actualMinimumValue) /
      (yAxis.actualMaximumValue - yAxis.actualMinimumValue);

    mainChart.windowRect = {
      left: zoom.left,
      width: zoom.width,
      top: 1 - yMax,
      height: yMax - yMin,
    };
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          className="w-[50px] bg-gray-700 text-white"
          onClick={() => calculateZoomSliderWindow("1d")}
        >
          1D
        </button>
        <button
          className="w-[50px] bg-gray-700 text-white"
          onClick={() => calculateZoomSliderWindow("1w")}
        >
          1W
        </button>
        <button
          className="w-[50px] bg-gray-700 text-white"
          onClick={() => calculateZoomSliderWindow("1m")}
        >
          1M
        </button>
        <button
          className="w-[50px] bg-gray-700 text-white"
          onClick={() => calculateZoomSliderWindow("1y")}
        >
          1Y
        </button>
        <button
          className="w-[50px] bg-gray-700 text-white"
          onClick={() => calculateZoomSliderWindow("all")}
        >
          All
        </button>
      </div>

      <div className="w-[929px] h-[396px] mx-auto mt-[100px]">
        <IgrDataChart
          ref={mainChartRef}
          dataSource={dataSource}
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
            dateTimeMemberPath="date"
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
            valueMemberPath="price"
            title="Price"
            showDefaultTooltip="false"
            markerType={MarkerType.None}
          />
        </IgrDataChart>
        <div className={`w-full h-[${MINIMAP_HEIGHT}] relative mt-4`}>
          <div className={`w-full h-[${MINIMAP_HEIGHT}] absolute top-0 left-0`}>
            <IgrDataChart
              dataSource={BITCOIN_DATA["all"]}
              width="100%"
              height={MINIMAP_HEIGHT}
              outlines={["#f0f2f5"]}
              brushes={["#f0f2f5"]}
              gridMode={GridMode.None}
            >
              <IgrTimeXAxis
                name="zoomXAxis"
                dateTimeMemberPath="date"
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
                valueMemberPath="price"
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
    </>
  );
}

export default App;
