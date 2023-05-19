import { BitcoinData } from "../types.ts";
import dayjs from "dayjs";
import { formatValue } from "../utils.ts";
import { HTMLProps } from "react";
import clsx from "clsx";

function VolumeLegend({ className, ...props }: HTMLProps<HTMLImageElement>) {
  return (
    <img
      className={clsx("inline w-[18px] h-[17px] ml-0 mr-1", className)}
      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTkiIHZpZXdCb3g9IjAgMCAyMCAxOSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjBfZCkiPgo8cGF0aCBkPSJNOC42NjIwNyAxNS43OTU5TDEuNjYyMDcgOS40OTU4NkMxLjI0MDY0IDkuMTE2NTggMSA4LjU3NjI1IDEgOC4wMDkyN1YyQzEgMC44OTU0MzIgMS44OTU0MyAwIDMgMEgxN0MxOC4xMDQ2IDAgMTkgMC44OTU0MzEgMTkgMlY4LjAwOTI3QzE5IDguNTc2MjUgMTguNzU5NCA5LjExNjU4IDE4LjMzNzkgOS40OTU4NkwxMS4zMzc5IDE1Ljc5NTlDMTAuNTc3MyAxNi40ODA0IDkuNDIyNjggMTYuNDgwNCA4LjY2MjA3IDE1Ljc5NTlaIiBmaWxsPSJ3aGl0ZSIvPgo8L2c+CjxwYXRoIGQ9Ik04LjY2MDIyIDEyLjc5MTJMMy42NjAyMiA4LjI3OTlDMy4yMzk5MSA3LjkwMDY3IDMgNy4zNjEwOCAzIDYuNzk0OThWNEMzIDIuODk1NDMgMy44OTU0MyAyIDUgMkgxNUMxNi4xMDQ2IDIgMTcgMi44OTU0MyAxNyA0VjYuNzk0OThDMTcgNy4zNjEwOCAxNi43NjAxIDcuOTAwNjcgMTYuMzM5OCA4LjI3OTlMMTEuMzM5OCAxMi43OTEyQzEwLjU3ODYgMTMuNDc3OSA5LjQyMTM5IDEzLjQ3NzkgOC42NjAyMiAxMi43OTEyWiIgZmlsbD0iI0E2QjBDMyIvPgo8cGF0aCBkPSJNOS4yODcyOCA5LjI3NTgxTDcuMjg3MjggNy4yNDM2NUM3LjEwMzE4IDcuMDU2NTkgNyA2LjgwNDY2IDcgNi41NDIyMVY2QzcgNS40NDc3MSA3LjQ0NzcyIDUgOCA1SDEyQzEyLjU1MjMgNSAxMyA1LjQ0NzcyIDEzIDZWNi41NDIyMUMxMyA2LjgwNDY2IDEyLjg5NjggNy4wNTY1OSAxMi43MTI3IDcuMjQzNjVMMTAuNzEyNyA5LjI3NTgxQzEwLjMyMSA5LjY3Mzg5IDkuNjc5MDUgOS42NzM4OSA5LjI4NzI4IDkuMjc1ODFaIiBmaWxsPSJ3aGl0ZSIvPgo8ZGVmcz4KPGZpbHRlciBpZD0iZmlsdGVyMF9kIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMTguMzA5MyIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPgo8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPgo8ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlQWxwaGEiIHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxMjcgMCIvPgo8ZmVPZmZzZXQgZHk9IjEiLz4KPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMC41Ii8+CjxmZUNvbG9yTWF0cml4IHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAuMzQ1MDk4IDAgMCAwIDAgMC40IDAgMCAwIDAgMC40OTQxMTggMCAwIDAgMC4xIDAiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJlZmZlY3QxX2Ryb3BTaGFkb3ciLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3ciIHJlc3VsdD0ic2hhcGUiLz4KPC9maWx0ZXI+CjwvZGVmcz4KPC9zdmc+Cg=="
      alt="Volume Legend"
      {...props}
    ></img>
  );
}

const boxShadow =
  "rgba(88, 102, 126, 0.08) 0px 1px 1px, rgba(88, 102, 126, 0.1) 0px 8px 16px;";

export default function CustomTooltip({ data }: { data: BitcoinData }) {
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
        <span
          className={`inline-block w-[14px] h-[14px] rounded-full shadow-[${boxShadow}] translate-y-[2px] bg-[#16c784] border-2 border-white mr-2 content-none`}
        />
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
