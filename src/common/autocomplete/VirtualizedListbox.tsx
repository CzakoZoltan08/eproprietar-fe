import { FixedSizeList, ListChildComponentProps } from "react-window";

import React from "react";

const LISTBOX_PADDING = 8;

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  const dataSet = data[index];

  const inlineStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
  };

  // Clone the MUI-generated <li> and inject our style
  return React.cloneElement(dataSet, {
    style: { ...dataSet.props.style, ...inlineStyle },
  });
}

export const ListboxComponent = React.forwardRef(function ListboxComponent(
  props: any,
  ref: React.Ref<HTMLDivElement>
) {
  const { children, ...other } = props;
  const itemData = React.Children.toArray(children);
  const itemCount = itemData.length;
  const itemSize = 36;

  return (
    <div
      ref={ref}
      {...other}
      style={{ padding: 0, margin: 0, overflow: "hidden" }} // ✅ prevent outer scrollbars
    >
      <FixedSizeList
        height={(Math.max(Math.min(8, itemCount), 5)) * itemSize}
        width="100%"
        itemSize={itemSize}
        itemCount={itemCount}
        itemData={itemData}
        overscanCount={5}
        outerElementType="div"
        innerElementType="ul"
      >
        {renderRow}
      </FixedSizeList>
    </div>
  );
});