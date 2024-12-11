import styled from "styled-components";
import { COLOR_ERROR, COLOR_RED_BUTTON } from "@/constants/colors";

const FormHelperText = styled.div`
  color: ${COLOR_ERROR};
  font-size: 12px;
  margin-left: 14px;
`;

const HelperText = ({ children }: { children: any }) => (
  <FormHelperText>{children}</FormHelperText>
);

export default HelperText;
