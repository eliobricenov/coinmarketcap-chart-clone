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
1import { BITCOIN_DATA } from "./mock-data/bitcoin-data.ts";
import { Timeframe } from "./types.ts";
import clsx from "clsx";
import CustomTooltip from "./components/CustomTooltip.tsx";

IgrZoomSliderModule.register();
IgrDataChartCoreModule.register();
IgrDataChartCategoryModule.register();
IgrDataChartInteractivityModule.register();
IgrDataChartAnnotationModule.register();
IgrNumberAbbreviatorModule.register();
IgrCrosshairLayerModule.register();

dayjs.extend(utc);
const MINIMAP_HEIGHT = "66px";

function App() {
  const [timeframe, setTimeframe] = useState<Timeframe>("all");
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

  const calculateZoomSliderWindow = (timeframe: Timeframe) => {
    const mainChart = mainChartRef.current;
    const zoomSlider = zoomSliderRef.current;

    if (!mainChart || !zoomSlider) return;

    const allData = BITCOIN_DATA["all"];
    const timeframeData = BITCOIN_DATA[timeframe];

    const startDate = timeframeData[0].date;
    let startPosition = allData.length - 1;

    // we loop backwards to find the earliest date in the allData array that is before the start date of the timeframe
    for (let i = startPosition; i >= 0; i--) {
      startPosition = i;
      if (dayjs(allData[i].date).isBefore(startDate)) {
        break;
      }
    }

    // once we have the start position, we can calculate the width of the zoom slider window
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

    setTimeframe(timeframe);
    updateMainChartZoom(zoom);
  };

  const handleZoomSliderWindowChanged = () => {
    const mainChart = mainChartRef.current;
    const zoomSlider = zoomSliderRef.current;

    if (!mainChart || !zoomSlider) return;

    // because the zoom charts uses all the historical data, we need to set the main chart source to historical too
    // to make sure the zoom chart is in sync with the main chart
    setTimeframe("all");

    const sliderWindow = zoomSlider.windowRect;
    const chartWindow = mainChart.actualWindowRect;

    const zoom = {
      top: chartWindow.top,
      left: sliderWindow.left,
      width: sliderWindow.width,
      height: chartWindow.height,
    };

    updateMainChartZoom(zoom);
  };

  const updateMainChartZoom = (zoom: IgRect) => {
    const data = BITCOIN_DATA["all"];
    const mainChart = mainChartRef.current;
    const zoomSlider = zoomSliderRef.current;

    if (!mainChart || !zoomSlider) return;

    const yAxis = mainChart.actualAxes[1] as IgrNumericYAxis;

    // we get the indexes using the current left and width of the zoom slider window
    let indexStart = Math.floor((data.length - 1) * zoom.left);
    let indexEnd = Math.ceil((data.length - 1) * (zoom.left + zoom.width));

    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;

    if (indexStart < 0) {
      indexStart = 0;
    }

    indexEnd = Math.min(indexEnd, data.length - 1);

    // once we have the indexes we calculate the min and max prices
    for (let i = indexStart; i <= indexEnd; i++) {
      min = Math.min(min, data[i].price);
      max = Math.max(max, data[i].price);
    }

    // with the price range we can calculate the min and max values for the y-axis
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
    <div className="w-[929px] h-[396px] mx-auto mt-[100px]">
      <div className="flex flex-row items-center">
        <ul className="flex items center bg-[#EFF2F5] p-1 rounded m-0 text-xs text-[#616e85] gap-1 ml-auto mb-4">
          <button
            className={clsx(
              "px-[8px] py-[5px] hover:bg-[#f8fafdd9] hover:font-medium hover:rounded",
              timeframe === "1d" && "bg-white font-medium rounded"
            )}
            onClick={() => calculateZoomSliderWindow("1d")}
          >
            1D
          </button>
          <button
            className={clsx(
              "px-[8px] py-[5px] hover:bg-[#f8fafdd9] hover:font-medium hover:rounded",
              timeframe === "1w" && "bg-white font-medium rounded"
            )}
            onClick={() => calculateZoomSliderWindow("1w")}
          >
            1W
          </button>
          <button
            className={clsx(
              "px-[8px] py-[5px] hover:bg-[#f8fafdd9] hover:font-medium hover:rounded",
              timeframe === "1m" && "bg-white font-medium rounded"
            )}
            onClick={() => calculateZoomSliderWindow("1m")}
          >
            1M
          </button>
          <button
            className={clsx(
              "px-[8px] py-[5px] hover:bg-[#f8fafdd9] hover:font-medium hover:rounded",
              timeframe === "1y" && "bg-white font-medium rounded"
            )}
            onClick={() => calculateZoomSliderWindow("1y")}
          >
            1Y
          </button>
          <button
            className={clsx(
              "px-[8px] py-[5px] hover:bg-[#f8fafdd9] hover:font-medium hover:rounded",
              timeframe === "all" && "bg-white font-medium rounded"
            )}
            onClick={() => calculateZoomSliderWindow("all")}
          >
            ALL
          </button>
        </ul>
      </div>
      <IgrDataChart
        ref={mainChartRef}
        dataSource={BITCOIN_DATA["all"]}
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
            <IgrTimeXAxis name="zoomXAxis" dateTimeMemberPath="date" />
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
  );
}

export default App;
