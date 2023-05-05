import styles from "./index.module.css";
import cn from "classnames";

function Loading() {
  return (
    <div className={cn(styles.wrapper)}>
      <div className={cn(styles.itemLoading)}>
        <div className={cn(styles.ldsRoller)}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
