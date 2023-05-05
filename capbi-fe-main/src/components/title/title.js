import cn from "classnames";
import style from "./title.module.css";

function Title({ text }) {
    return (
        <div className={cn(style.title)}>
            <h2>{text}</h2>
        </div>
    );
}

export default Title;
