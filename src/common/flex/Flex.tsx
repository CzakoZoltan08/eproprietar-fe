import styled from "styled-components";

type FlexProps = {
  $justifyContent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";
  $alignItems?: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
  width?: string;
  height?: string;
  flex?: string;
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
  $flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
  overflow?: "visible" | "hidden" | "scroll" | "auto";
  margin?: string;
  $padding?: string;
  flexWrap?: "nowrap" | "wrap" | "wrap-reverse";
  $gap?: string;
};

export const Flex = styled.div<FlexProps>`
  display: flex;
  align-content: center;
  justify-content: ${(props) => props.$justifyContent || "center"};
  align-items: ${(props) => props.$alignItems || "center"};
  width: ${(props) => props.width || "100%"} !important;
  height: ${(props) => props.height || "auto"} !important;
  flex: ${(props) => props.flex || "0 1 auto"};
  position: ${(props) => props.position || "relative"};
  flex-direction: ${(props) => props.$flexDirection || "row"};
  overflow: ${(props) => props.overflow || "visible"};
  margin: ${(props) => props.margin || "0"};
  padding: ${(props) => props.$padding || "0"};
  flex-wrap: ${(props) => props.flexWrap || "nowrap"};
  gap: ${(props) => props.$gap || "0"};
`;

export default Flex;