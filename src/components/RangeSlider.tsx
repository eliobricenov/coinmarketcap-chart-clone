import cn from "classnames";
import ReactSlider, { ReactSliderProps } from "react-slider";

export default function RangeSlider<T extends number | readonly number[]>(
  _props: ReactSliderProps<T>
) {
  const isVertical = _props.orientation === "vertical";
  return (
    <ReactSlider
      {..._props}
      renderThumb={(props, state) => (
        <div
          {...props}
          className={cn({
            "h-full": !isVertical,
            "w-full": isVertical,
            "aspect-square rounded-full bg-indigo-500 text-xs text-white flex items-center justify-center cursor-grab":
              true,
          })}
        >
          {state.valueNow}
        </div>
      )}
      renderTrack={(props, state) => {
        const points = Array.isArray(state.value) ? state.value.length : null;
        const isMulti = true;
        const isLast = isMulti ? state.index === points : state.index != 0;
        const isFirst = state.index === 0;
        return (
          <div
            {...props}
            className={cn({
              "h-1/4 top-1/2 -translate-y-1/2": !isVertical,
              "w-1/4 left-1/2 -translate-x-1/2": isVertical,
              "rounded-full": true,
              "bg-gray-200": true,
              "bg-indigo-500": !isFirst && !isLast,
            })}
          ></div>
        );
      }}
      renderMark={(props) => {
        return (
          <div
            {...props}
            className={cn({
              "top-1/2 -translate-y-1/2": !isVertical,
              "left-1/2 -translate-x-1/2": isVertical,
              "h-1 w-1": true,
              "rounded-full bg-indigo-500": true,
            })}
          ></div>
        );
      }}
    />
  );
}
