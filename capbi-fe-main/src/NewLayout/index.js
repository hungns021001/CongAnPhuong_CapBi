import styles from "./index.module.css";
import cn from "classnames";
import { useSelector } from "react-redux";
import SideBarComponent from "@/NewComponents/sideBarComponent";
import HeaderComponent from "@/NewComponents/headerComponent";
import { useEffect, useRef, useState } from "react";

function NewLayout({ children }) {
    const [mobile, setMobile] = useState(false);
    const [windowDimensions, setWindowDimensions] = useState(0);
    const [menuMobile, setMenuMobile] = useState(false);

    const paddingNum = useSelector((state) => state.paddingSlice.paddingNum);
    useEffect(() => {
        if (window.innerWidth <= 992) {
            setMobile(true);
        } else {
            setMobile(false);
        }
    });

    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height,
        };
    }

    useEffect(() => {
        // Necessary to make sure dimensions are set upon initial load
        setWindowDimensions(getWindowDimensions());

        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const divRef2 = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (divRef2.current && !divRef2.current.contains(event.target)) setMenuMobile(false);
        }
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [divRef2]);

    return (
        <div className={cn(styles.wrapper)}>
            <HeaderComponent toggleOpenMenu={() => setMenuMobile(true)} />
            <div className={cn(styles.body)}>
                <div className={cn(styles.sideBarComponent)}>
                    <SideBarComponent />
                </div>
                {!mobile && (
                    <div style={{ paddingLeft: `${paddingNum}px` }} className={cn(styles.contentArea)}>
                        {children}
                    </div>
                )}
                {mobile && <div className={cn(styles.contentArea)}>{children}</div>}
            </div>
            {mobile && menuMobile && (
                <div className={cn(styles.mobileWrapper)}>
                    <div ref={divRef2}>
                        <SideBarComponent />
                    </div>
                </div>
            )}
        </div>
    );
}

export default NewLayout;
