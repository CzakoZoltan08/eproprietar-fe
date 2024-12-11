import styled from "styled-components";

type FlexProps = {
  justifycontent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";
  alignItems?: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
  width?: string;
  height?: string;
  flex?: string;
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
  flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
  overflow?: "visible" | "hidden" | "scroll" | "auto";
  margin?: string;
  padding?: string;
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
  gap?: string;
};

export const Flex = styled.div<FlexProps>`
  display: flex;
  align-content: center;
  justify-content: ${(props) => props.justifycontent || "center"};
  align-items: ${(props) => props.alignItems || "center"};
  width: ${(props) => props.width || "100%"} !important;
  height: ${(props) => props.height} !important;
  flex: ${(props) => props.flex};
  position: ${(props) => props.position};
  flex-direction: ${(props) => props.flexDirection};
  overflow: ${(props) => props.overflow};
  margin: ${(props) => props.margin};
  padding: ${(props) => props.padding};
  flex-wrap: ${(props) => props.flexWrap};
  gap: ${(props) => props.gap};
`;

export default Flex;
