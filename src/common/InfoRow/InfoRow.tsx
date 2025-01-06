import Flex from "@/common/flex/Flex";
import React from "react";
import styles from "./InfoRow.module.css";

interface InfoRowProps {
  title: string;
  value?: string | number | null;
}

const InfoRow: React.FC<InfoRowProps> = ({ title, value }) => {
  if (!value) return null;

  return (
    <>
      <Flex>
        <div>{title}:</div>
        <div>{value}</div>
      </Flex>
      <div className={styles.divider} />
    </>
  );
};

export default InfoRow;