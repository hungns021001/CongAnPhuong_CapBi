import cn from "classnames";
import Link from "next/link";
import styles from "./index.module.css";
import { HiLogout } from "react-icons/hi";
import { AiOutlineMenu } from "react-icons/ai";
import { useEffect, useState } from "react";
import { SubStrings } from "@/constant";

function HeaderComponent({ toggleOpenMenu }) {
    const [userName, setUserName] = useState("");
    useEffect(() => {
        setUserName(window.localStorage.getItem("fullname"));
    }, []);

    return (
        <div className={cn(styles.wrapper)}>
            <Link href="/home" className={cn(styles.customLogo)}>
                <img className={cn(styles.sponsorName)} src={SubStrings.subDirection.imgs.policeLogo} />
            </Link>
            <div className={cn(styles.actionGroup)}>
                <p className={cn(styles.userName)}>{userName}</p>
                <div className={cn(styles.logout)}>
                    <Link className={cn(styles.logoutBtn)} href="/dang-nhap">
                        <HiLogout className={cn(styles.logoutIcon)} />
                    </Link>
                    <AiOutlineMenu onClick={toggleOpenMenu} className={cn(styles.menuMobileIcon)} />
                </div>
            </div>
        </div>
    );
}

export default HeaderComponent;
